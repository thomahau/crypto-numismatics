'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {app, runServer, closeServer} = require('../server');
const {JWT_SECRET, TEST_DATABASE_URL} = require('../config');
const models = require('../models');

const User = models.User;
const Holding = models.Holding;
const expect = chai.expect;
let user;

chai.use(chaiHttp);

function seedPortfolioData() {
	console.info('Seeding portfolio data');
	const seedData = [];

	for (let i = 0; i <= 5; i++) {
		seedData.push(generateHoldingData());
	}
	return Holding.insertMany(seedData);
}

function getRandomCoin() {
	const coins = ['BTC', 'ETH', 'XRP', 'BCH', 'LTC'];
	return coins[Math.floor(Math.random() * coins.length)];
}

function generateHoldingData(coin = getRandomCoin()) {
	const amount = Math.floor(Math.random() * 50);
	return {
		symbol: coin,
		amount: amount,
		user: user
	};
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('Protected holdings API resource', function() {
	const username = 'exampleUser';
	const password = 'examplePassword';
	const token = jwt.sign(
		{
			user: {
				username
			}
		},
		JWT_SECRET,
		{
			algorithm: 'HS256',
			subject: username,
			expiresIn: '30d'
		}
	);

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return User.hashPassword(password)
			.then(password => {
				return User.create({username, password});
			})
			.then(_user => {
				user = _user;
				return seedPortfolioData();
			});
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('Protection', function() {
		it('Should reject requests with no credentials', function() {
			return chai
				.request(app)
				.get('/holdings')
				.then(res => {
					expect(res).to.have.status(401);
				});
		});

		it('Should reject requests with an invalid token', function() {
			const incorrectToken = jwt.sign(
				{
					user: username
				},
				'wrongSecret',
				{
					algorithm: 'HS256',
					subject: username,
					expiresIn: '30d'
				}
			);

			return chai
				.request(app)
				.get('/holdings')
				.set('Authorization', `Bearer ${incorrectToken}`)
				.then(res => {
					expect(res).to.have.status(401);
				});
		});

		it('Should reject requests with an expired token', function() {
			const expiredToken = jwt.sign(
				{
					user: {
						username
					},
					exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
				},
				JWT_SECRET,
				{
					algorithm: 'HS256',
					subject: username
				}
			);

			return chai
				.request(app)
				.get('/holdings')
				.set('authorization', `Bearer ${expiredToken}`)
				.then(res => {
					expect(res).to.have.status(401);
				});
		});
	});

	describe('GET endpoint', function() {
		it('should return all existing holdings for current user', function() {
			const token = jwt.sign(
				{
					user: {
						username
					}
				},
				JWT_SECRET,
				{
					algorithm: 'HS256',
					subject: username,
					expiresIn: '30d'
				}
			);
			let res;

			return chai
				.request(app)
				.get('/holdings')
				.set('authorization', `Bearer ${token}`)
				.then(_res => {
					res = _res;
					expect(res).to.have.status(200);
					expect(res.body.holdings).to.have.length.of.at.least(1);
					return Holding.count();
				})
				.then(count => {
					expect(res.body.holdings).to.have.lengthOf(count);
				});
		});

		it('should return holdings with the right fields', function() {
			let resHolding;
			return chai
				.request(app)
				.get('/holdings')
				.set('authorization', `Bearer ${token}`)
				.then(res => {
					expect(res).to.have.status(200);
					expect(res).to.be.json;
					expect(res.body.holdings).to.be.a('array');
					expect(res.body.holdings).to.have.length.of.at.least(1);

					res.body.holdings.forEach(holding => {
						expect(holding).to.be.a('object');
						expect(holding).to.include.keys(
							'id',
							'symbol',
							'amount'
						);
					});
					resHolding = res.body.holdings[0];
					return Holding.findById(resHolding.id);
				})
				.then(holding => {
					expect(resHolding.id).to.equal(holding.id);
					expect(resHolding.symbol).to.equal(holding.symbol);
					expect(resHolding.amount).to.equal(holding.amount);
				});
		});
	});

	describe('POST endpoint', function() {
		it('should add a new holding', function() {
			const newHolding = generateHoldingData('EOS');

			return chai
				.request(app)
				.post('/holdings')
				.set('authorization', `Bearer ${token}`)
				.send(newHolding)
				.then(res => {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys('id', 'symbol', 'amount');
					expect(res.body.id).to.not.be.null;
					expect(res.body.symbol).to.equal(newHolding.symbol);
					return Holding.findById(res.body.id);
				})
				.then(holding => {
					expect(holding.symbol).to.equal(newHolding.symbol);
					expect(holding.amount).to.equal(newHolding.amount);
				});
		});
	});

	describe('PUT endpoint', function() {
		it('should update a holding with the amount you send it', function() {
			const updateData = {
				amount: 42
			};

			return Holding.findOne()
				.then(holding => {
					updateData.id = holding.id;
					return chai
						.request(app)
						.put(`/holdings/${holding.id}`)
						.set('authorization', `Bearer ${token}`)
						.send(updateData);
				})
				.then(res => {
					expect(res).to.have.status(204);
					return Holding.findById(updateData.id);
				})
				.then(holding => {
					expect(holding.amount).to.equal(updateData.amount);
				});
		});
	});

	describe('DELETE endpoint', function() {
		it('should delete a holding by ID', function() {
			let holding;

			return Holding.findOne()
				.then(_holding => {
					holding = _holding;
					return chai
						.request(app)
						.delete(`/holdings/${holding.id}`)
						.set('authorization', `Bearer ${token}`);
				})
				.then(res => {
					expect(res).to.have.status(204);
					return Holding.findById(holding.id);
				})
				.then(_restaurant => {
					expect(_restaurant).to.be.null;
				});
		});
	});
});
