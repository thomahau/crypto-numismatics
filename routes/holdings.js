'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const models = require('../models');

const router = express.Router();
const jsonParser = bodyParser.json();
const jwtAuth = passport.authenticate('jwt', {session: false});
const Holding = models.Holding;
const User = models.User;

router.get('/', jwtAuth, (req, res) => {
	User.findOne({username: req.user.username})
		.then(user => {
			return Holding.find({user});
		})
		.then(holdings => {
			res.json({
				holdings: holdings.map(holding => holding.serialize())
			});
		})
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

router.post('/', jwtAuth, jsonParser, (req, res) => {
	const requiredFields = ['symbol', 'name', 'amount'];
	for (let i = 0; i < requiredFields.length; i++) {
		const field = requiredFields[i];
		if (!(field in req.body)) {
			const message = `Missing \`${field}\` in request body`;
			console.error(message);
			return res.status(400).send(message);
		}
	}

	User.findOne({username: req.user.username})
		.then(user => {
			return Holding.findOneAndUpdate(
				{symbol: req.body.symbol, user: user},
				{
					symbol: req.body.symbol,
					name: req.body.name,
					$inc: {
						amount: req.body.amount
					},
					user: user
				},
				{upsert: true, new: true, runValidators: true}
			);
		})
		.then(holding => res.status(201).json(holding.serialize()))
		.catch(err => {
			console.error(err);
			res.status(500).json({message: 'Internal server error'});
		});
});

router.put('/:id', jwtAuth, jsonParser, (req, res) => {
	if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
		const message =
			`Request path id (${req.params.id}) and request body id ` +
			`(${req.body.id}) must match`;
		console.error(message);
		return res.status(400).json({message: message});
	}
	const {amount} = req.body;

	Holding.findByIdAndUpdate(req.params.id, {$set: {amount: amount}})
		.then(holding => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

router.delete('/:id', jwtAuth, (req, res) => {
	Holding.findByIdAndRemove(req.params.id)
		.then(holding => res.status(204).end())
		.catch(err => res.status(500).json({message: 'Internal server error'}));
});

module.exports = {router};
