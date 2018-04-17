'use strict';
// const COINMARKETCAP_ENDPOINT = 'https://api.coinmarketcap.com/v1/';
const CRYPTOCOMPARE_ENDPOINT = 'https://min-api.cryptocompare.com/data/';
const APP_NAME = 'crypto_numismatics';

let PORTFOLIO = {
	holdings: []
};
let globalPortfolioValue = 0;

function getAuthHeaders() {
	const token = localStorage.getItem('token');

	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};
}

function populateSearchOptions() {
	$('.coin-search').autocomplete({
		source: COINS
	});
}

// function getPortfolio() {
// 	if (isLoggedIn()) {
// 		getPortfolioHoldings();
// 	}
// }

// function isLoggedIn() {
// 	return localStorage.getItem('token');
// }

// function setPortfolioHoldings(res) {
// 	PORTFOLIO.holdings = res.holdings;
// }

function handleModals() {
	$('body').click(function(event) {
		if ($(event.target).hasClass('modal')) {
			$('.modal').attr('hidden', true);
		}
	});

	$('.modal').on('click', '.close', function() {
		$('.modal').attr('hidden', true);
	});

	handleRegisterModal();
	handleLoginModal();
	handleEditPortfolioModal();
}

function handleRegisterModal() {
	$('.js-register').click(function() {
		$('.js-register-modal').attr('hidden', false);
	});
}

function handleLoginModal() {
	$('.js-login').click(function() {
		$('.js-login-modal').attr('hidden', false);
	});
}

function getHoldings() {
	return fetch('holdings', {
		headers: getAuthHeaders()
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
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
			const newHolding = {
				symbol: coinElements[1].slice(0, -1),
				name: coinElements[0].slice(0, -1),
				amount: parseFloat(inputAmount, 10)
			};

			addHolding(newHolding)
				.then(holding => {
					renderPortfolio();
				})
				.catch(err => console.error(err));
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

function addHolding(data) {
	return fetch('holdings', {
		method: 'POST',
		headers: getAuthHeaders(),
		body: JSON.stringify(data)
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
	});
}

// function addToPortfolio(item) {
// 	// CLEAN UP HERE
// 	let portfolioItem = mockData.filter(coin => coin.symbol === item.symbol)[0];
// 	// Look for coin already in PORTFOLIO
// 	portfolioItem.name = item.coin;
// 	addPastPrices(portfolioItem);

// 	if (alreadyInPortfolio(portfolioItem)) {
// 		const existingPortfolioItem = PORTFOLIO.holdings.filter(
// 			el => el.symbol === portfolioItem.symbol
// 		)[0];

// 		portfolioItem.amount = existingPortfolioItem.amount + item.amount;
// 	} else {
// 		portfolioItem.amount = item.amount;
// 	}

// 	PORTFOLIO.holdings.push(portfolioItem);
// 	PORTFOLIO.holdings = [...new Set(PORTFOLIO.holdings)];
// 	renderPortfolio();
// }

function alreadyInPortfolio(newItem) {
	let existsInPortfolio = false;

	PORTFOLIO.holdings.forEach(item => {
		if (newItem.symbol === item.symbol) {
			existsInPortfolio = true;
			return existsInPortfolio;
		}
	});
	return existsInPortfolio;
}

// function addPastPrices(item) {
// 	const divider = (100 + item.percent_change_24h) / 100;
// 	item.price_usd_24_hrs_ago = item.price_usd / divider;
// 	// item.price_usd_7_days_ago = item.price_usd / ((100 + item.percent_change_7d) / 100);
// 	return item;
// }

function getPortfolioData(holdings) {
	let amendedHoldings = holdings;
	const symbols = holdings.map(item => item.symbol).join();
	// TODO: Alternative currency
	const url =
		CRYPTOCOMPARE_ENDPOINT +
		`pricemultifull?fsyms=${symbols}&tsyms=USD&extraParams=${APP_NAME}`;

	return fetch(url)
		.then(res => {
			if (res.ok) {
				return res.json();
			}
			throw new Error('Network response was not ok.');
		})
		.then(data => {
			Object.keys(data.RAW).forEach(item => {
				amendedHoldings.forEach(holding => {
					if (item === holding.symbol) {
						holding.price = data.RAW[item].USD.PRICE;
						holding.change_24_hr = data.RAW[item].USD.CHANGE24HOUR;
						holding.change_pct_24_hr =
							data.RAW[item].USD.CHANGEPCT24HOUR;
						holding.price_24_hrs_ago =
							holding.price - holding.change_24_hr;
						holding.value = holding.price * holding.amount;
						holding.value_24_hrs_ago =
							holding.price_24_hrs_ago * holding.amount;
					}
				});
			});
			return amendedHoldings;
		})
		.catch(err =>
			console.log('There was a problem getting your data: ', err.message)
		);
}

function renderPortfolio() {
	getHoldings()
		.then(data => {
			return getPortfolioData(data.holdings);
		})
		.then(portfolioData => {
			const p1 = getPortfolioHeader(portfolioData);
			const p2 = getPortfolioTable(portfolioData);
			const p3 = getPortfolioFooter(portfolioData);

			return Promise.all([p1, p2, p3]);
		})
		.then(values => {
			const [portfolioHeader, portfolioTable, portfolioFooter] = values;

			$('.welcome-container').remove();
			$('.portfolio-container')
				.attr('hidden', false)
				.empty()
				.append(portfolioHeader)
				.append(portfolioTable)
				.append(portfolioFooter);
		});
	// const portfolioHeader = getPortfolioHeader();
	// const portfolioTable = getPortfolioTable();
	// const portfolioFooter = getPortfolioFooter();

	// $('.welcome-container').remove();
	// $('.portfolio-container')
	// 	.attr('hidden', false)
	// 	.empty()
	// 	.append(portfolioHeader)
	// 	.append(portfolioTable)
	// 	.append(portfolioFooter);
}

function getPortfolioHeader(amendedHoldings) {
	let portfolioValue = 0;
	let portfolioValue24HrsAgo = 0;

	amendedHoldings.forEach(item => {
		portfolioValue += item.value;
		portfolioValue24HrsAgo += item.value_24_hrs_ago;
	});
	portfolioValue = +portfolioValue.toFixed(2);

	const portfolio24HrChange = +(
		portfolioValue - portfolioValue24HrsAgo
	).toFixed(2);
	const portfolio24HrPercentChange = +(
		(portfolioValue - portfolioValue24HrsAgo) /
		portfolioValue24HrsAgo *
		100
	).toFixed(2);
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
}

// TODO: Add other time periods?
// <div class="three columns text-left">
// 	<strong>7 DAYS</strong>
// 	<p>$X <small>X%</small></p>
// </div>

// let portfolioValue7DaysAgo = 0;
// item.value_7_days_ago = item.amount * item.price_usd_7_days_ago;
// portfolioValue7DaysAgo += item.value_7_days_ago;
// const portfolio7DayChange = portfolioValue - portfolioValue7DaysAgo;
// const portfolio7DayPercentChange = portfolio7DayChange / 100;

function getPortfolioTable() {
	let tableRowsHtmlString = '';
	PORTFOLIO.holdings.forEach(item => {
		const gainOrLoss = item.percent_change_24h > 0 ? 'gain' : 'loss';
		const allocationPct = +(
			item.value /
			globalPortfolioValue *
			100
		).toFixed(2);
		tableRowsHtmlString += `
		<tr>
		<td data-label="&nbsp;&nbsp;&nbsp;&nbsp;Coin"><span class="leftmost-cell">${
			item.name
		}</span></td>
		<td data-label="Price">$${item.price_usd}</td>
		<td class="${gainOrLoss}" data-label="24 hr change">${
			item.percent_change_24h
		}%</td>
		<td data-label="Amount">${item.amount}</td>
		<td data-label="Value">$${item.value}</td>
		<td data-label="Allocation">${allocationPct}%</td>
		<td data-label="Delete"><a class="portfolio-link delete-holding rightmost-cell" data-coin="${
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

		$('.edit-holdings-modal').attr('hidden', false);
		$('.js-edit-form-container').html(editPortfolioForm);
	});

	$('.edit-holdings-modal').on('click', '.cancel-edit-btn', function() {
		$('.edit-holdings-modal').attr('hidden', true);
	});
}

function getEditPortfolioForm() {
	let holdingsHtmlString = '';
	PORTFOLIO.holdings.forEach(item => {
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
			const indexOfItem = PORTFOLIO.holdings.findIndex(
				i => i.symbol === coin
			);
			PORTFOLIO.holdings[indexOfItem].amount = parseFloat(
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
		const indexOfItem = PORTFOLIO.holdings.findIndex(
			i => i.symbol === coinSymbol
		);
		PORTFOLIO.holdings.splice(indexOfItem, 1);
		renderPortfolio();
		$('.modal').attr('hidden', true);
	});
}

function handleLogin() {
	$('.login-form').submit(function(event) {
		event.preventDefault();
		const credentials = {
			username: $('#login-username').val(),
			password: $('#login-password').val()
		};

		login(credentials)
			.then(data => {
				const userHtml = getUserHtml(data.username);

				localStorage.setItem('token', data.authToken);
				$('.modal').attr('hidden', true);
				$('.js-login, .js-register').remove();
				$('nav').append(userHtml);
				renderPortfolio();
			})
			.catch(err => {
				const loginHelpMsg = getLoginHelpMsg(err);

				$('#login-username, #login-password').val('');
				$('.login-help')
					.attr('hidden', false)
					.html(loginHelpMsg);
			});
	});
}

function login(data) {
	return fetch('auth/login', {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
		throw new Error('Invalid username or password');
	});
}

function getUserHtml(username) {
	return `
	<a class="js-logout u-pull-right">
		<i class="fas fa-sign-out-alt"></i><span class="nav-text"> Log out</span>
	</a>
	<p class="u-pull-right li-space">
		${username}
	</p>`;
}

function getLoginHelpMsg(err) {
	return `
	<span class="loss">${err}</span>`;
}

function handleLogout() {
	$('header').on('click', '.js-logout', function() {
		localStorage.removeItem('token');
		location.reload();
	});
}

$(function() {
	populateSearchOptions();
	handleModals();
	handleLogin();
	handleLogout();
	handleNewCoinSubmit();
	handleSettingsDropdown();
	handleAddPortfolioItemClick();
	handleCancelAdditionBtn();
	handleEditPortfolioSubmit();
	handleDeletePortfolioItem();
});
