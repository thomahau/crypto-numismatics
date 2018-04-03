'use strict';

function populateSearchOptions() {
	$('#coin').autocomplete({
		source: COINS
	});
}

function handleNewHoldingSubmit() {
	$('.add-coin-form').submit(function(event) {
		event.preventDefault();
		const inputAmount = $(this)
			.find('#amount')
			.val();
		const inputCoin = $(this)
			.find('#coin')
			.val();

		if (isValidInput(inputCoin)) {
			const coinElements = inputCoin.split('(');

			// TODO: remove help text if visible
			const portfolioItem = {
				coin: coinElements[0],
				symbol: coinElements[1].slice(0, -1),
				amount: parseFloat(inputAmount, 10)
			};

			addToPortfolio(portfolioItem);
		} else {
			// TODO: add help text
			alert('invalid input');
		}
	});
}

function isValidInput(input) {
	let validInput = false;

	COINS.forEach(coin => {
		if (input === coin) {
			validInput = true;
			return validInput;
		}
	});
	return validInput;
}

function addToPortfolio(item) {
	// console.log(item);  CLEAN UP HERE
	let portfolioItem = mockData.filter(coin => coin.symbol === item.symbol)[0];
	console.log(portfolioItem);
	portfolioItem.name = item.coin;
	portfolioItem.amount = item.amount;
	portfolioItem.value = item.amount * portfolioItem.price_usd;
	$('.js-welcome-container').remove(); // or empty?
	renderPortfolio(portfolioItem);
}

function renderPortfolio(item) {
	// TODO: Add portfolio totals on top | Add colors for gain/loss | Add allocation formula | format decimals | Add "save portfolio"
	// Different colors for thead + totals etc | delete cross in last cell
	const portfolioHtml = `
		<table class="u-full-width">
		  <thead>
		    <tr>
		      <th>Coin</th>
		      <th>Price</th>
		      <th>24h % chg</th>
		      <th>Amount</th>
		      <th>Value</th>
		      <th>Allocation</th>
		      <th></th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr>
		      <td>${item.name} (${item.symbol})</td>
		      <td>$${item.price_usd}</td>
		      <td>${item.percent_change_24h}%</td>
		      <td>${item.amount}</td>
		      <td>$${item.value}</td>
		      <td>100%</td>
		      <td>X</td>
		    </tr>
		  </tbody>
		</table>`;

	$('.js-portfolio-container')
		.attr('hidden', false)
		.html(portfolioHtml);
}

$(function() {
	populateSearchOptions();
	handleNewHoldingSubmit();
});
