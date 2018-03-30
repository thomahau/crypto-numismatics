'use strict';

const chai = require('chai');
const chaiHttp = require('chai-http');
const {app, runServer, closeServer} = require('../server');

const expect = chai.expect;

chai.use(chaiHttp);

describe('index page', function() {
	before(function() {
		return runServer();
	});

	after(function() {
		return closeServer();
	});

	it('should return an HTML page', function() {
		return chai
			.request(app)
			.get('/')
			.then(function(res) {
				expect(res).to.have.status(200);
				expect(res).to.be.html;
			});
	});
});
