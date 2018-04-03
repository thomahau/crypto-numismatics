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
	console.log(item);
}

$(function() {
	populateSearchOptions();
	handleNewHoldingSubmit();
});
