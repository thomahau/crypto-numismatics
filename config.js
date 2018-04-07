'use strict';
exports.DATABASE_URL =
	process.env.DATABASE_URL || 'mongodb://localhost/crypto-numismatics';
exports.TEST_DATABASE_URL =
	process.env.TEST_DATABASE_URL ||
	'mongodb://localhost/test-crypto-numismatics';
exports.PORT = process.env.PORT || 8080;
exports.JWT_SECRET = process.env.JWT_SECRET;
exports.JWT_EXPIRY = process.env.JWT_EXPIRY || '30d';
