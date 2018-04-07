'use strict';
let PORTFOLIO = [];
let globalPortfolioValue = 0;

function populateSearchOptions() {
	$('.coin-search').autocomplete({
		source: COINS
	});
}

function handleRegisterDropdown() {
	$('.js-register-drop-btn').click(function() {
		$('.dropdown-register').toggleClass('show');
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
	const portfolioHeader = getPortfolioHeader();
	const portfolioTable = getPortfolioTable();
	const portfolioFooter = getPortfolioFooter();

	$('.welcome-container').remove(); // or empty?
	$('.portfolio-container')
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
		item.value = +(item.amount * item.price_usd).toFixed(2);
		item.value_24_hrs_ago = item.amount * item.price_usd_24_hrs_ago;
		// item.value_7_days_ago = item.amount * item.price_usd_7_days_ago;
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
			<ul class="nav-list portfolio-header">
				<li class="u-pull-right">
					<a class="portfolio-link share-portfolio disabled">
						<i class="fas fa-share-square"></i> Share
					</a>
				</li>
				<li class="u-pull-right li-space">
					<div class="dropdown">
						<a class="portfolio-link portfolio-settings js-drop-btn">
							<i class="fas fa-cog"></i><span> Settings</span>
						</a>
						<div class="dropdown-content">
							<a class="js-edit-portfolio">Edit holdings</a>
							<a class="js-add-portfolio-item">Add holding</a>
							<a class="disabled">Edit currency</a>
						</div>
					</div>
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
		<td><span class="leftmost-cell">${item.name}</span></td>
		<td>$${item.price_usd}</td>
		<td class="${gainOrLoss}">${item.percent_change_24h}%</td>
		<td>${item.amount}</td>
		<td>$${item.value}</td>
		<td>${allocationPct}%</td>
		<td><a class="portfolio-link delete-holding rightmost-cell" data-coin="${
			item.symbol
		}">x</a></td>
		</tr>`;
	});

	return `
		<table class="u-full-width">
		  <thead class="darkest">
		    <tr>
		      <th><span class="leftmost-cell">Coin</span></th>
		      <th>Price</th>
		      <th>24 hr change</th>
		      <th>Amount</th>
		      <th>Value</th>
		      <th>Allocation</th>
		      <th></th>
		    </tr>
		  </thead>
		  <tbody class="darker">
			${tableRowsHtmlString}
		  </tbody>
		 </table>`;
}

function getPortfolioFooter() {
	return `
		<div class="row portfolio-footer darkest">
			<ul class="nav-list portfolio-footer-menu">
				<li class="u-pull-left li-space">
					<a class="portfolio-link js-add-portfolio-item">
						<i class="fas fa-plus"></i> Add
					</a>
				</li>
				<li class="u-pull-left">
					<a class="portfolio-link js-edit-portfolio">
						<i class="fas fa-edit"></i> Edit
					</a>
				</li>
			</ul>
		</div>`;
}

function handleSettingsDropdown() {
	$('main').on('click', '.js-drop-btn', function() {
		$('.dropdown-content').toggleClass('show');
	});

	$('body').click(function(event) {
		if (
			!$(event.target)
				.parent()
				.hasClass('js-drop-btn')
		) {
			const openDropdowns = $('.dropdown-content').length;
			if (openDropdowns > 0) {
				$('.dropdown-content').removeClass('show');
			}
		}
	});
}

function handleAddPortfolioItemClick() {
	$('main').on('click', '.js-add-portfolio-item', function() {
		const newItemForm = getNewItemForm();

		$('.portfolio-footer').remove();
		$('.portfolio-container').append(newItemForm);
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
				<a class="button cancel-addition-btn" role="button">Cancel</a>
			</div>
		</div>
	</form>`;
}

function handleCancelAdditionBtn() {
	$('main').on('click', '.cancel-addition-btn', function() {
		const portfolioFooter = getPortfolioFooter();

		$('.js-add-coin-form').remove();
		$('.portfolio-container').append(portfolioFooter);
	});
}

function handleEditPortfolioModal() {
	$('main').on('click', '.js-edit-portfolio', function() {
		const editPortfolioForm = getEditPortfolioForm();

		$('.modal').attr('hidden', false);
		$('.js-edit-form-container').html(editPortfolioForm);
	});

	$('.modal').on('click', '.cancel-edit-btn', function() {
		$('.modal').attr('hidden', true);
	});

	$('body').click(function(event) {
		if ($(event.target).hasClass('modal')) {
			$('.modal').attr('hidden', true);
		}
	});
}

function getEditPortfolioForm() {
	let holdingsHtmlString = '';
	PORTFOLIO.forEach(item => {
		holdingsHtmlString += `
		<div class="row">
			<div class="three columns">
				<label for="${item.symbol}">${item.name}</label>
			</div>
			<div class="nine columns">
				<input type="number" name="${item.symbol}" value=${
			item.amount
		} min="0" step="any" />
				<a class="button delete-holding" role="button" data-coin="${
					item.symbol
				}">Delete</a>
			</div>
		</div>`;
	});

	return `
		<form class="edit-portfolio-form">
		  ${holdingsHtmlString}
		  <div class="row">
			<button type="submit" class="button-primary">Update</button>
			<a class="button cancel-edit-btn" role="button">Cancel</a>
		</div>`;
}

function handleEditPortfolioSubmit() {
	$('.modal').on('submit', '.edit-portfolio-form', function(event) {
		event.preventDefault();
		const $inputs = $('.edit-portfolio-form input[type="number"]');
		const submittedValues = {};

		$inputs.each(function() {
			submittedValues[this.name] = $(this).val();
		});

		Object.keys(submittedValues).forEach(coin => {
			const indexOfItem = PORTFOLIO.findIndex(i => i.symbol === coin);
			PORTFOLIO[indexOfItem].amount = parseFloat(
				submittedValues[coin],
				10
			);
		});

		renderPortfolio();
		$('.modal').attr('hidden', true);
	});
}

function handleDeletePortfolioItem() {
	$('body').on('click', '.delete-holding', function(event) {
		const coinSymbol = $(this).data('coin');
		const indexOfItem = PORTFOLIO.findIndex(i => i.symbol === coinSymbol);
		PORTFOLIO.splice(indexOfItem, 1);
		renderPortfolio();
		$('.modal').attr('hidden', true);
	});
}

$(function() {
	populateSearchOptions();
	handleRegisterDropdown();
	handleNewCoinSubmit();
	handleSettingsDropdown();
	handleAddPortfolioItemClick();
	handleCancelAdditionBtn();
	handleEditPortfolioModal();
	handleEditPortfolioSubmit();
	handleDeletePortfolioItem();
});
