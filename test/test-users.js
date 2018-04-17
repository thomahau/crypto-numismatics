'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require('../server');
const {TEST_DATABASE_URL} = require('../config');
const models = require('../models');

const User = mongoose.model('User');
const expect = chai.expect;

chai.use(chaiHttp);

describe('Users endpoints', function() {
	const username = 'exampleUser';
	const password = 'examplePass';
	const usernameB = 'exampleUserB';
	const passwordB = 'examplePassB';

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	});

	beforeEach(function() {});

	afterEach(function() {
		return User.remove({});
	});

	describe('/users', function() {
		describe('POST', function() {
			it('should reject users with missing username', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						password
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
						expect(res.body.location).to.equal('username');
					});
			});

			it('should reject users with missing password', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal('Missing field');
						expect(res.body.location).to.equal('password');
					});
			});

			it('should reject users with non-string username', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username: 1234,
						password
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Incorrect field type: expected string'
						);
						expect(res.body.location).to.equal('username');
					});
			});

			it('should reject users with non-string password', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username,
						password: 1234
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Incorrect field type: expected string'
						);
						expect(res.body.location).to.equal('password');
					});
			});

			it('should reject users with non-trimmed username', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username: ` ${username} `,
						password
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Cannot start or end with whitespace'
						);
						expect(res.body.location).to.equal('username');
					});
			});

			it('should reject users with non-trimmed password', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username,
						password: ` ${password} `
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Cannot start or end with whitespace'
						);
						expect(res.body.location).to.equal('password');
					});
			});

			it('should reject users with empty username', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username: '',
						password
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at least 1 characters long'
						);
						expect(res.body.location).to.equal('username');
					});
			});

			it('should reject users with password less than ten characters', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username,
						password: '123456789'
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at least 10 characters long'
						);
						expect(res.body.location).to.equal('password');
					});
			});

			it('should reject users with password greater than 72 characters', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username,
						password: new Array(73).fill('a').join('')
					})
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Must be at most 72 characters long'
						);
						expect(res.body.location).to.equal('password');
					});
			});

			it('should reject users with duplicate username', function() {
				return User.create({
					username,
					password
				})
					.then(() =>
						// Try to create a second user with the same username
						chai
							.request(app)
							.post('/users')
							.send({
								username,
								password
							})
					)
					.then(res => {
						expect(res).to.have.status(422);
						expect(res.body.reason).to.equal('ValidationError');
						expect(res.body.message).to.equal(
							'Username already taken'
						);
						expect(res.body.location).to.equal('username');
					});
			});

			it('should create a new user', function() {
				return chai
					.request(app)
					.post('/users')
					.send({
						username,
						password
					})
					.then(res => {
						expect(res).to.have.status(201);
						expect(res.body).to.be.an('object');
						expect(res.body).to.have.keys('username');
						expect(res.body.username).to.equal(username);
						return User.findOne({
							username
						});
					})
					.then(user => {
						expect(user).to.not.be.null;
						return user.validatePassword(password);
					})
					.then(passwordIsCorrect => {
						expect(passwordIsCorrect).to.be.true;
					});
			});
		});

		// describe('GET', function() {
		//   it('should return an empty array initially', function() {
		//     return chai
		//       .request(app)
		//       .get('/users')
		//       .then(res => {
		//         expect(res).to.have.status(200);
		//         expect(res.body).to.be.an('array');
		//         expect(res.body).to.have.length(0);
		//       });
		//   });

		//   it('should return an array of users', function() {
		//     return User.create(
		//       {
		//         username,
		//         password
		//       },
		//       {
		//         username: usernameB,
		//         password: passwordB
		//       }
		//     )
		//       .then(() => chai.request(app).get('/users'))
		//       .then(res => {
		//         expect(res).to.have.status(200);
		//         expect(res.body).to.be.an('array');
		//         expect(res.body).to.have.length(2);
		//         expect(res.body[0]).to.deep.equal({
		//           username
		//         });
		//         expect(res.body[1]).to.deep.equal({
		//           username: usernameB
		//         });
		//       });
		//   });
		// });
	});
});