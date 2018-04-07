'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const models = require('../models');

const Holding = mongoose.model('Holding');
const expect = chai.expect;

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
	const coins = [
		{symbol: 'BTC', name: 'Bitcoin'},
		{symbol: 'ETH', name: 'Ethereum'},
		{symbol: 'XRP', name: 'Ripple'},
		{symbol: 'BCH', name: 'Bitcoin Cash'},
		{symbol: 'LTC', name: 'Litecoin'}
	];
	return coins[Math.floor(Math.random() * coins.length)];
}

function generateHoldingData() {
	const coin = getRandomCoin();
	const amount = Math.floor(Math.random() * 50);
	return {
		symbol: coin.symbol,
		name: coin.name,
		amount: amount
	};
}

function tearDownDb() {
	console.warn('Deleting database');
	return mongoose.connection.dropDatabase();
}

describe('holdings API resource', function() {
	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	beforeEach(function() {
		return seedPortfolioData();
	});

	afterEach(function() {
		return tearDownDb();
	});

	after(function() {
		return closeServer();
	});

	describe('GET endpoint', function() {
		it('should return all existing holdings', function() {
			let res;
			return chai
				.request(app)
				.get('/holdings')
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
							'name',
							'amount'
						);
					});
					resHolding = res.body.holdings[0];
					return Holding.findById(resHolding.id);
				})
				.then(holding => {
					expect(resHolding.id).to.equal(holding.id);
					expect(resHolding.symbol).to.equal(holding.symbol);
					expect(resHolding.name).to.equal(holding.name);
					expect(resHolding.amount).to.equal(holding.amount);
				});
		});
	});

	describe('POST endpoint', function() {
		it('should add a new holding', function() {
			const newHolding = generateHoldingData();

			return chai
				.request(app)
				.post('/holdings')
				.send(newHolding)
				.then(res => {
					expect(res).to.have.status(201);
					expect(res).to.be.json;
					expect(res.body).to.be.a('object');
					expect(res.body).to.include.keys(
						'id',
						'symbol',
						'name',
						'amount'
					);
					expect(res.body.id).to.not.be.null;
					expect(res.body.symbol).to.equal(newHolding.symbol);
					expect(res.body.name).to.equal(newHolding.name);
					return Holding.findById(res.body.id);
				})
				.then(holding => {
					expect(holding.symbol).to.equal(newHolding.symbol);
					expect(holding.name).to.equal(newHolding.name);
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
					return chai.request(app).delete(`/holdings/${holding.id}`);
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
