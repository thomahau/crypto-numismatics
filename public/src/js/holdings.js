'use strict';
App.Holdings = {
  URI: 'holdings',
  getAuthHeaders: function() {
    // access to protected API endpoints requires valid JWT token
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
    const populatedHoldings = [];
    // parse desired ticker data for each of user's holdings
    holdings.forEach(holding => {
      const tickerObj = tickerData.filter(element => element.symbol === holding.symbol)[0];
      const populatedHolding = {
        id: holding.id,
        symbol: holding.symbol,
        name: holding.name,
        amount: holding.amount,
        price: parseFloat(tickerObj.price),
        value: holding.amount * parseFloat(tickerObj.price),
        percent_change_24h: (parseFloat(tickerObj['1d'].price_change_pct) * 100).toFixed(2),
        percent_change_7d: (parseFloat(tickerObj['7d'].price_change_pct) * 100).toFixed(2),
        percent_change_30d: (parseFloat(tickerObj['30d'].price_change_pct) * 100).toFixed(2)
      };
      populatedHoldings.push(populatedHolding);
    });

    return populatedHoldings.sort((a, b) => b.value - a.value);
  },
  getTotals: function(populatedHoldings) {
    // calculate aggregate portfolio value and performance
    const total = populatedHoldings.reduce((sum, holding) => {
      return sum + holding.value;
    }, 0);
    const total24HrsAgo = populatedHoldings.reduce((sum, holding) => {
      return sum + this.getPastValue(holding.value, holding.percent_change_24h);
    }, 0);
    const change24Hrs = total - total24HrsAgo;
    const change24HrsPct = 100 * (total / total24HrsAgo - 1);
    const total7DaysAgo = populatedHoldings.reduce((sum, holding) => {
      return sum + this.getPastValue(holding.value, holding.percent_change_7d);
    }, 0);
    const change7Days = total - total7DaysAgo;
    const change7DaysPct = 100 * (total / total7DaysAgo - 1);
    const total30DaysAgo = populatedHoldings.reduce((sum, holding) => {
      return sum + this.getPastValue(holding.value, holding.percent_change_30d);
    }, 0);
    const change30Days = total - total30DaysAgo;
    const change30DaysPct = 100 * (total / total30DaysAgo - 1);
    const totalBTC = this.getBTCValue(total);

    return {
      total: total,
      totalBTC: App.Lib.round(totalBTC, 3),
      change24Hrs: App.Lib.round(change24Hrs),
      change24HrsPct: change24HrsPct.toFixed(2),
      change7Days: App.Lib.round(change7Days),
      change7DaysPct: change7DaysPct.toFixed(2),
      change30Days: App.Lib.round(change30Days),
      change30DaysPct: change30DaysPct.toFixed(2)
    };
  },
  getPastValue: function(value, pctChange) {
    return value / (1 + pctChange / 100);
  },
  getBTCValue: function(value) {
    const currency = localStorage.getItem('currency').toLowerCase();
    const btcObj = tickerData.find(element => element.symbol === 'BTC');

    return value / btcObj.price;
  }
};
