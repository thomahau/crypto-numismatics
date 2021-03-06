'use strict';
App.Lib = {
  round: function(value, decimals = 2) {
    // rounds input to selected number of decimals and applies a comma thousands-separator to large values
    if (Math.abs(value) >= 1) {
      return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
        .toFixed(decimals)
        .toString()
        .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return value.toFixed(5).toString();
    }
  },
  getCurrencySymbol: function(currency) {
    if (currency === 'USD') {
      return '$';
    } else if (currency === 'EUR') {
      return '€';
    } else if (currency === 'GBP') {
      return '£';
    } else if (currency === 'JPY') {
      return '¥';
    } else if (currency === 'NOK') {
      return 'kr ';
    }
  },
  formatForSort: function(s) {
    // make sure we have clean values to compare in table sort function
    // if input is numerical (value, amount, or percentage), strip currency symbol + comma and return number
    // if input is string, return in lowerCase
    if (/^-?\$?\d*,?\d*\.?\d+%?$/.test(s)) {
      return parseFloat(s.replace(/[\$€£,]/g, ''), 10);
    }
    return s.toLowerCase();
  }
};
