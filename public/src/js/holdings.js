'use strict';
App.Holdings = {
	URI: 'holdings',
	getAuthHeaders: function() {
		const token = localStorage.getItem('token');
		return {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`
		};
	},
	get: function() {
		return fetch(this.URI, {
			headers: this.getAuthHeaders()
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		});
	},
	add: function(data) {
		return fetch(this.URI, {
			method: 'POST',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(data)
		}).then(res => {
			if (res.ok) {
				return res.json();
			}
		});
	},
	update: function(data) {
		return fetch(`${this.URI}/${data.id}`, {
			method: 'PUT',
			headers: this.getAuthHeaders(),
			body: JSON.stringify(data)
		}).then(res => {
			if (res.ok) {
				return;
			}
		});
	},
	delete: function(id) {
		return fetch(`${this.URI}/${id}`, {
			method: 'DELETE',
			headers: this.getAuthHeaders()
		}).then(res => {
			if (res.ok) {
				return;
			}
		});
	},
	populate: function(holdings) {
		const currency = localStorage.getItem('currency').toLowerCase();
		let populatedHoldings = [];

		holdings.forEach(holding => {
			const tickerObj = tickerData.filter(
				element => element.symbol === holding.symbol
			)[0];
			const populatedHolding = {
				id: holding.id,
				symbol: holding.symbol,
				name: holding.name,
				amount: holding.amount,
				price: parseFloat(tickerObj[`price_${currency}`]),
				value:
					holding.amount * parseFloat(tickerObj[`price_${currency}`]),
				percent_change_24h: parseFloat(tickerObj.percent_change_24h),
				percent_change_7d: parseFloat(tickerObj.percent_change_7d)
			};
			populatedHoldings.push(populatedHolding);
		});
		return populatedHoldings;
	},
	getTotals: function(populatedHoldings) {
		const total = populatedHoldings.reduce((sum, holding) => {
			return sum + holding.value;
		}, 0);
		const total24HrsAgo = populatedHoldings.reduce((sum, holding) => {
			return (
				sum +
				this.getPastValue(holding.value, holding.percent_change_24h)
			);
		}, 0);
		const change24Hrs = total - total24HrsAgo;
		const change24HrsPct = 100 * (total / total24HrsAgo - 1);
		const total7DaysAgo = populatedHoldings.reduce((sum, holding) => {
			return (
				sum +
				this.getPastValue(holding.value, holding.percent_change_7d)
			);
		}, 0);
		const change7Days = total - total7DaysAgo;
		const change7DaysPct = 100 * (total / total7DaysAgo - 1);
		const totalBTC = this.getBTCValue(total);

		return {
			total: total,
			totalBTC: App.Lib.round(totalBTC, 3),
			change24Hrs: App.Lib.round(change24Hrs),
			change24HrsPct: App.Lib.round(change24HrsPct),
			change7Days: App.Lib.round(change7Days),
			change7DaysPct: App.Lib.round(change7DaysPct)
		};
	},
	getPastValue: function(value, pctChange) {
		return value / (1 + pctChange / 100);
	},
	getBTCValue: function(value) {
		const currency = localStorage.getItem('currency').toLowerCase();
		const btcObj = tickerData.find(element => element.symbol === 'BTC');

		return value / btcObj[`price_${currency}`];
	}
};