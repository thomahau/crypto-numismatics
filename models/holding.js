'use strict';
const mongoose = require('mongoose');

const HoldingSchema = mongoose.Schema({
	symbol: {type: String, required: true},
	amount: {type: Number, required: true},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

HoldingSchema.methods.serialize = function() {
	return {
		id: this._id,
		symbol: this.symbol,
		amount: this.amount
	};
};

const Holding = mongoose.model('Holding', HoldingSchema);

module.exports = Holding;
