'use strict';
// const COINMARKETCAP_ENDPOINT = 'https://api.coinmarketcap.com/v1/';
const CRYPTOCOMPARE_ENDPOINT = 'https://min-api.cryptocompare.com/data/';
const APP_NAME = 'crypto_numismatics';

let globalPortfolioValue = 0;

function populateSearchOptions() {
	$('.coin-search').autocomplete({
		source: COINS
	});
}

function checkIfLoggedIn() {
	if (localStorage.getItem('token') && localStorage.getItem('username')) {
		const username = localStorage.getItem('username');
		const userHtml = getUserHtml(username);

		$('.js-login, .js-register').remove();
		$('nav').append(userHtml);
		renderPortfolio();
	} else {
		const welcomeMessage = getWelcomeMessage();

		$('.welcome-container')
			.attr('hidden', false)
			.html(welcomeMessage);
	}
}

function getWelcomeMessage() {
	return `
	<div class="row">
		<h1>Cryptocurrency portfolio tracker</h1>
		<p>Crypto Numismatics provides a simple, user-friendly overview of your digital currency holdings. Signing up is free and anonymous.</p>
	</div>`;
}

function handleSignup() {
	$('.register-form').submit(function(event) {
		event.preventDefault();
		const credentials = {
			username: $('#register-username').val(),
			password: $('#register-password').val(),
			passwordconfirm: $('#register-password-confirm').val()
		};

		register(credentials)
			.then(user => {
				const signupSuccessMsg = getSignupSuccessMsg(user.username);

				localStorage.setItem('currency', 'USD');
				$('.register-modal-body').html(signupSuccessMsg);
				handleFirstLogin(credentials);
			})
			.catch(err => {
				const signupHelpMsg = getSignupHelpMsg(err);

				$('#register-password, #register-password-confirm').val('');
				$('.register-help')
					.attr('hidden', false)
					.html(signupHelpMsg);
			});
	});
}

function register(credentials) {
	let res;

	return fetch('users', {
		method: 'POST',
		body: JSON.stringify(credentials),
		headers: {
			'Content-Type': 'application/json'
		}
	})
		.then(_res => {
			res = _res;
			return res.json();
		})
		.then(data => {
			if (res.ok) {
				return data;
			}
			throw `${data.reason}: ${data.message}`;
		});
}

function getSignupSuccessMsg(username) {
	return `
	<p>Welcome aboard, ${username}! You may now log in.</p>
	<button class="button-primary first-login">Log in</button>`;
}

function getSignupHelpMsg(err) {
	return `
	<span class="loss">${err}</span>`;
}

function handleFirstLogin(data) {
	const credentials = {
		username: data.username,
		password: data.password
	};

	$('.modal').on('click', '.first-login', function() {
		login(credentials).then(data => {
			localStorage.setItem('username', data.username);
			localStorage.setItem('token', data.authToken);

			$('.modal').attr('hidden', true);
			checkIfLoggedIn();
		});
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
				localStorage.setItem('username', data.username);
				localStorage.setItem('token', data.authToken);

				$('.modal').attr('hidden', true);
				checkIfLoggedIn();
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

function login(credentials) {
	return fetch('auth/login', {
		method: 'POST',
		body: JSON.stringify(credentials),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
		throw 'ValidationError: Invalid username or password';
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
		localStorage.removeItem('username');
		localStorage.removeItem('token');
		location.reload();
	});
}

function getAuthHeaders() {
	const token = localStorage.getItem('token');
	return {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${token}`
	};
}

function handleModals() {
	$('body').click(function(event) {
		if ($(event.target).hasClass('modal')) {
			$('.modal').attr('hidden', true);
		}
	});

	$('.modal').on('click', '.close', function() {
		$('.modal').attr('hidden', true);
	});

	$('.modal').on('click', '.cancel-edit-btn', function() {
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
			$('.search-help')
				.attr('hidden', false)
				.html('Invalid input');
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

function getHoldings() {
	return fetch('holdings', {
		headers: getAuthHeaders()
	}).then(res => {
		if (res.ok) {
			return res.json();
		}
	});
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

function getPortfolioData(holdings) {
	let amendedHoldings = holdings;
	const currency = localStorage.getItem('currency');
	const symbols = holdings.map(item => item.symbol).join();
	const url =
		CRYPTOCOMPARE_ENDPOINT +
		`pricemultifull?fsyms=${symbols}&tsyms=${currency}&extraParams=${APP_NAME}`;

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
						holding.price = data.RAW[item][currency].PRICE;
						holding.change_24_hr = round(
							data.RAW[item][currency].CHANGE24HOUR
						);
						holding.change_pct_24_hr = round(
							data.RAW[item][currency].CHANGEPCT24HOUR
						);
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
		.catch(err => console.error('No holdings to show'));
}

function round(value, decimals = 2) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
		.toFixed(decimals)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function renderPortfolio() {
	getHoldings()
		.then(data => {
			return getPortfolioData(data.holdings);
		})
		.then(portfolioData => {
			const p1 = getPortfolioHeader(portfolioData);
			const p2 = getPortfolioTable(portfolioData);
			const p3 = getPortfolioFooter(globalPortfolioValue);

			return Promise.all([p1, p2, p3]);
		})
		.then(values => {
			const [portfolioHeader, portfolioTable, portfolioFooter] = values;

			$('.welcome-container')
				.attr('hidden', true)
				.empty();
			$('.portfolio-container')
				.attr('hidden', false)
				.empty()
				.append(portfolioHeader)
				.append(portfolioTable)
				.append(portfolioFooter);

			handleNewCoinSubmit();
			handleAddPortfolioItemClick();
			handleCancelAdditionBtn();
			handleDeletePortfolioItem();
			handleSettingsDropdown();
			handleEditCurrency();
		});
}

function getPortfolioHeader(amendedHoldings) {
	const symbol = getCurrencySymbol();
	let portfolioValue = 0;
	let portfolioValue24HrsAgo = 0;

	if (typeof amendedHoldings !== 'undefined') {
		amendedHoldings.forEach(item => {
			portfolioValue += item.value;
			portfolioValue24HrsAgo += item.value_24_hrs_ago;
		});
	}

	const portfolio24HrChange = round(portfolioValue - portfolioValue24HrsAgo);
	const portfolio24HrPercentChange = round(
		(portfolioValue - portfolioValue24HrsAgo) / portfolioValue24HrsAgo * 100
	);
	const gainOrLoss24Hrs = portfolio24HrPercentChange > 0 ? 'gain' : 'loss';
	const portfolio24HrPerformanceHtml = `
	<strong>24 HOUR CHANGE</strong>
	<p class="${gainOrLoss24Hrs} large-text">${symbol}${portfolio24HrChange} <small>(${portfolio24HrPercentChange}%)</small></p>`;
	const helpText = '<p>Your portfolio is currently empty.</p>';
	const helpOrPerformance =
		typeof amendedHoldings === 'undefined'
			? helpText
			: portfolio24HrPerformanceHtml;

	globalPortfolioValue = portfolioValue;
	portfolioValue = round(portfolioValue);

	return `
		<div class="row darkest">
			<ul class="nav-list portfolio-header">
				<li class="u-pull-right">
					<a class="portfolio-link share-portfolio disabled">
						<i class="fas fa-share-square"></i><span> Share</span>
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
							<a class="js-edit-currency">Edit currency</a>
						</div>
					</div>
				</li>
			</ul>
		</div>
		<div class="row darker portfolio-overview">
			<div class="three columns text-left">
				<strong>PORTFOLIO VALUE</strong>
				<p class="large-text">${symbol}${portfolioValue}</p>
			</div>
			<div class="six columns text-left">
				${helpOrPerformance}
			</div>
		</div>`;
}

// <div class="six columns">
// 	<button class="button-primary u-pull-right">Save Portfolio</button>
// </div>

function getPortfolioTable(amendedHoldings) {
	const symbol = getCurrencySymbol();
	let tableRowsHtmlString = '';

	if (typeof amendedHoldings !== 'undefined') {
		amendedHoldings.forEach(item => {
			const gainOrLoss = item.change_pct_24_hr > 0 ? 'gain' : 'loss';
			const allocationPct = round(
				item.value / globalPortfolioValue * 100
			);

			item.price = round(item.price);
			item.value = round(item.value);
			tableRowsHtmlString += `
		<tr>
		<td data-label="&nbsp;&nbsp;&nbsp;&nbsp;Coin"><span class="leftmost-cell">${
			item.name
		}</span></td>
		<td data-label="Price">${symbol}${item.price}</td>
		<td class="${gainOrLoss}" data-label="24 hr change">${
				item.change_pct_24_hr
			}%</td>
		<td data-label="Amount">${item.amount}</td>
		<td data-label="Value">${symbol}${item.value}</td>
		<td data-label="Allocation">${allocationPct}%</td>
		<td data-label="Delete"><a class="portfolio-link delete-holding rightmost-cell" data-coin="${
			item.id
		}">x</a></td>
		</tr>`;
		});
	}

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

function getCurrencySymbol() {
	const currency = localStorage.getItem('currency');

	if (currency === 'USD') {
		return '$';
	} else if (currency === 'EUR') {
		return '€';
	} else if (currency === 'GBP') {
		return '£';
	}
}

function getPortfolioFooter(globalPortfolioValue) {
	if (!globalPortfolioValue) {
		return `
		<div class="row portfolio-footer darkest">
			<button class="button-primary u-pull-left js-add-portfolio-item start-btn">Get started</button>
		</div>`;
	}

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
				<p class="search-help" aria-live="assertive" hidden></p>
			</div>
			<div class="four columns">
				<button type="submit" class="button-primary">Add coin</button>
				<a class="button cancel-addition-btn" role="button">Cancel</a>
			</div>
		</div>
	</form>`;
}

function handleCancelAdditionBtn() {
	$('main').on('click', '.cancel-addition-btn', function() {
		const portfolioFooter = getPortfolioFooter(globalPortfolioValue);

		$('.js-add-coin-form').remove();
		$('.portfolio-container').append(portfolioFooter);
	});
}

function handleEditPortfolioModal() {
	$('main').on('click', '.js-edit-portfolio', function() {
		getHoldings()
			.then(data => {
				return getEditPortfolioForm(data.holdings);
			})
			.then(editPortfolioForm => {
				$('.edit-holdings-modal').attr('hidden', false);
				$('.js-edit-form-container').html(editPortfolioForm);
				handleEditPortfolioSubmit();
			});
	});
}

function getEditPortfolioForm(holdings) {
	let holdingsHtmlString = '';

	holdings.forEach(item => {
		holdingsHtmlString += `
		<div class="row">
			<div class="three columns">
				<label for="${item.id}">${item.name}</label>
			</div>
			<div class="nine columns">
				<input type="number" name="${item.id}" value=${
			item.amount
		} min="0" step="any" />
				<a class="button delete-holding" role="button" data-coin="${item.id}">Delete</a>
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
		const submittedValues = [];

		$inputs.each(function() {
			submittedValues.push({
				id: this.name,
				amount: parseFloat($(this).val(), 10)
			});
		});

		const updates = submittedValues.map(item => {
			if (item.amount === 0) {
				return deleteHolding(item.id);
			}
			return updateHolding(item);
		});

		Promise.all(updates).then(values => {
			renderPortfolio();
			$('.modal').attr('hidden', true);
		});
	});
}

function updateHolding(data) {
	return fetch(`holdings/${data.id}`, {
		method: 'PUT',
		headers: getAuthHeaders(),
		body: JSON.stringify(data)
	})
		.then(res => {
			if (res.ok) {
				return;
			}
		})
		.catch(err => console.error(err));
}

function handleDeletePortfolioItem() {
	$('body').on('click', '.delete-holding', function(event) {
		const id = $(this).data('coin');

		deleteHolding(id)
			.then(() => {
				renderPortfolio();
				$('.modal').attr('hidden', true);
			})
			.catch(err => console.error(err));
	});
}

function deleteHolding(id) {
	return fetch(`holdings/${id}`, {
		method: 'DELETE',
		headers: getAuthHeaders()
	}).then(res => {
		if (res.ok) {
			return;
		}
	});
}

function handleEditCurrency() {
	$('main').on('click', '.js-edit-currency', function() {
		$('.currency-select').val(localStorage.getItem('currency'));
		$('.edit-currency-modal').attr('hidden', false);
		handleEditCurrencySubmit();
	});
}

function handleEditCurrencySubmit() {
	$('.edit-currency-form').submit(function(event) {
		event.preventDefault();
		const currency = $(this)
			.find('.currency-select')
			.val();

		localStorage.setItem('currency', currency);
		renderPortfolio();
		$('.modal').attr('hidden', true);
	});
}

$(function() {
	checkIfLoggedIn();
	handleModals();
	handleSignup();
	handleLogin();
	handleLogout();
});
