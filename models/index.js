'use strict';
const mongoose = require('mongoose');

const models = {};

models.User = require('./user');
models.Holding = require('./holding');

module.exports = models;
