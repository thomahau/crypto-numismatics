'use strict';
const mongoose = require('mongoose');

const holdingSchema = mongoose.Schema({
	// user: {
	// 	type: Schema.Types.ObjectId,
	// 	ref: 'User'
	// },
	symbol: {type: String, required: true},
	name: {type: String, required: true},
	amount: {type: Number, required: true}
});

holdingSchema.methods.serialize = function() {
	return {
		id: this._id,
		symbol: this.symbol,
		name: this.name,
		amount: this.amount
		// user: this.user
	};
};

const Holding = mongoose.model('Holding', holdingSchema);

module.exports = Holding;
