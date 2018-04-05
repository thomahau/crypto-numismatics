'use strict';

// const PORTFOLIO = {
// 	items: [],
// 	value: 0,
// 	value_24_hrs_ago: 0
// };

let PORTFOLIO = [];
let globalPortfolioValue = 0;

function populateSearchOptions() {
	$('.coin-search').autocomplete({
		source: COINS
	});
}

function handleNewCoinSubmit() {
	$('main').on('submit', '.js-add-coin-form', function(event) {
		event.preventDefault();
		const inputAmount = $(this)
			.find('.coin-amount')
			.val();
		const inputCoin = $(this)
			.find('.coin-search')
			.val();

		if (isValidInput(inputCoin)) {
			const coinElements = inputCoin.split('(');

			// TODO: remove help text if visible
			const portfolioItem = {
				coin: coinElements[0].slice(0, -1),
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
	// CLEAN UP HERE
	let portfolioItem = mockData.filter(coin => coin.symbol === item.symbol)[0];
	// Look for coin already in PORTFOLIO
	portfolioItem.name = item.coin;
	addPastPrices(portfolioItem);

	if (alreadyInPortfolio(portfolioItem)) {
		const existingPortfolioItem = PORTFOLIO.filter(
			el => el.symbol === portfolioItem.symbol
		)[0];

		portfolioItem.amount = existingPortfolioItem.amount + item.amount;
	} else {
		portfolioItem.amount = item.amount;
	}

	portfolioItem.value = portfolioItem.amount * portfolioItem.price_usd;
	portfolioItem.value_24_hrs_ago =
		portfolioItem.amount * portfolioItem.price_usd_24_hrs_ago;
	// item.value_7_days_ago = item.amount * item.price_usd_7_days_ago;

	PORTFOLIO.push(portfolioItem);
	PORTFOLIO = [...new Set(PORTFOLIO)];
	renderPortfolio();
}

function alreadyInPortfolio(newItem) {
	let existsInPortfolio = false;

	PORTFOLIO.forEach(item => {
		if (newItem.symbol === item.symbol) {
			existsInPortfolio = true;
			return existsInPortfolio;
		}
	});
	return existsInPortfolio;
}

function addPastPrices(item) {
	const divider = (100 + item.percent_change_24h) / 100;
	item.price_usd_24_hrs_ago = item.price_usd / divider;
	// item.price_usd_7_days_ago = item.price_usd / ((100 + item.percent_change_7d) / 100);
	return item;
}

function renderPortfolio() {
	// TODO: Add colors for gain/loss | Add allocation formula | format decimals
	// Different colors for thead + totals etc? | functioning delete cross in last cell
	const portfolioHeader = getPortfolioHeader();
	const portfolioTable = getPortfolioTable();
	const portfolioFooter = getPortfolioFooter();

	$('.js-welcome-container').remove(); // or empty?
	$('.js-portfolio-container')
		.attr('hidden', false)
		.empty()
		.append(portfolioHeader)
		.append(portfolioTable)
		.append(portfolioFooter);
}

// TODO: make all of these functions on the Mongoose model of portfolio + allocation (item value / portfolio value)
function getPortfolioHeader() {
	let portfolioValue = 0;
	let portfolioValue24HrsAgo = 0;
	// let portfolioValue7DaysAgo = 0;

	PORTFOLIO.forEach(item => {
		portfolioValue += item.value;
		portfolioValue24HrsAgo += item.value_24_hrs_ago;
		// portfolioValue7DaysAgo += item.value_7_days_ago;
	});

	const portfolio24HrChange = +(
		portfolioValue - portfolioValue24HrsAgo
	).toFixed(2);
	const portfolio24HrPercentChange = +(
		(portfolioValue - portfolioValue24HrsAgo) /
		portfolioValue24HrsAgo *
		100
	).toFixed(2);
	portfolioValue = +portfolioValue.toFixed(2);
	globalPortfolioValue = portfolioValue;
	// const portfolio7DayChange = portfolioValue - portfolioValue7DaysAgo;
	// const portfolio7DayPercentChange = portfolio7DayChange / 100;

	const gainOrLoss24Hrs = portfolio24HrPercentChange > 0 ? 'gain' : 'loss';

	const portfolioHeader = `
		<div class="row darkest">
			<ul class="portfolio-menu portfolio-header">
				<li class="u-pull-left">My Portfolio</li>
				<li class="u-pull-right">
					<a class="portfolio-link share-portfolio">
						<i class="fas fa-share-square"></i><span> Share</span>
					</a>
				</li>
				<li class="u-pull-right li-space">
					<a class="portfolio-link portfolio-settings">
						<i class="fas fa-cog"></i><span> Settings</span>
					</a>
				</li>
			</ul>
		</div>
		<div class="row darker portfolio-overview">
			<div class="three columns text-left">
				<strong>PORTFOLIO VALUE</strong>
				<p class="large-text">$${portfolioValue}</p>
			</div>
			<div class="three columns text-left">
				<strong>24 HOURS</strong>
				<p class="${gainOrLoss24Hrs} large-text">$${portfolio24HrChange} <small>(${portfolio24HrPercentChange}%)</small></p>
			</div>
			<div class="six columns">
				<button class="button-primary u-pull-right">Save Portfolio</button>
			</div>
		</div>`;

	return portfolioHeader;
	// TODO: Add other time periods?
	// <div class="three columns text-left">
	// 	<strong>7 DAYS</strong>
	// 	<p>$X <small>X%</small></p>
	// </div>
}

function getPortfolioTable() {
	let tableRowsHtmlString = '';
	PORTFOLIO.forEach(item => {
		const gainOrLoss = item.percent_change_24h > 0 ? 'gain' : 'loss';
		const allocationPct = +(
			item.value /
			globalPortfolioValue *
			100
		).toFixed(2);
		tableRowsHtmlString += `
		<tr>
		<td><span class="leftmost-cell">${item.name} (${item.symbol})</span></td>
		<td>$${item.price_usd}</td>
		<td class="${gainOrLoss}">${item.percent_change_24h}%</td>
		<td>${item.amount}</td>
		<td>$${item.value}</td>
		<td>${allocationPct}%</td>
		<td><span class="rightmost-cell">X</span></td>
		</tr>`;
	});

	return `
		<table class="u-full-width">
		  <thead class="darkest">
		    <tr>
		      <th><span class="leftmost-cell">Coin</span></th>
		      <th>Price</th>
		      <th>24h % chg</th>
		      <th>Amount</th>
		      <th>Value</th>
		      <th>Allocation</th>
		      <th></th>
		    </tr>
		  </thead>
		  <tbody>
			${tableRowsHtmlString}
		  </tbody>
		 </table>`;
}

function getPortfolioFooter() {
	return `
		<div class="row portfolio-footer darkest">
			<ul class="portfolio-menu portfolio-footer-menu">
				<li class="u-pull-left li-space">
					<a class="portfolio-link add-portfolio-item">
						<i class="fas fa-plus"></i><span> Add</span>
					</a>
				</li>
				<li class="u-pull-left">
					<a class="portfolio-link edit-portfolio-holdings">
						<i class="fas fa-edit"></i><span> Edit</span>
					</a>
				</li>
			</ul>
		</div>`;
}

function handleAddPortfolioItemClick() {
	$('main').on('click', '.add-portfolio-item', function() {
		const newItemForm = getNewItemForm();

		$('.portfolio-footer').remove();
		$('.js-portfolio-container').append(newItemForm);
		populateSearchOptions();
	});
}

function getNewItemForm() {
	return `
	<form class="js-add-coin-form">
		<div class="row portfolio-footer text-left darkest">
			<div class="six columns">
				<input type="search" class="coin-search" placeholder="Coin name" required />
				<input type="number" class="coin-amount" placeholder="Amount" min="0" step="any" required />
			</div>
			<div class="four columns">
				<button type="submit" class="button">Add coin</button>
				<a class="button">Cancel</a>
			</div>
		</div>
	</form>`;
}

$(function() {
	populateSearchOptions();
	handleNewCoinSubmit();
	handleAddPortfolioItemClick();
});
