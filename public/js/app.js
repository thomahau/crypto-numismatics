'use strict';
const COINMARKETCAP_ENDPOINT = 'https://api.coinmarketcap.com/v1/';
const CRYPTOCOMPARE_ENDPOINT = 'https://min-api.cryptocompare.com/data/';
const APP_NAME = 'crypto_numismatics';
let tickerData;
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

function getTickerData(currency) {
	const url =
		COINMARKETCAP_ENDPOINT + `ticker/?limit=500&convert=${currency}`;

	return fetch(url).then(res => {
		if (res.ok) {
			return res.json();
		}
		throw new Error('Network response was not ok.');
	});
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
		login(credentials)
			.then(data => {
				localStorage.setItem('username', data.username);
				localStorage.setItem('token', data.authToken);
				localStorage.setItem('currency', 'USD');

				return getTickerData('USD');
			})
			.then(data => {
				tickerData = data;
				console.log(tickerData.length);

				$('.modal').attr('hidden', true);
				checkIfLoggedIn();
			})
			.catch(err => console.error(err));
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
				const currency = localStorage.getItem('currency');
				localStorage.setItem('username', data.username);
				localStorage.setItem('token', data.authToken);

				getTickerData(currency)
					.then(data => {
						tickerData = data;

						$('.modal').attr('hidden', true);
						checkIfLoggedIn();
					})
					.catch(err => console.error(err));
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
		$('.search-help').attr('hidden', true);
		event.preventDefault();
		const inputAmount = $('.coin-amount').val();
		const inputCoin = $('.coin-search').val();

		if (isValidInput(inputCoin)) {
			const coinElements = inputCoin.split('(');
			const newHolding = {
				symbol: coinElements[1].slice(0, -1),
				name: coinElements[0].slice(0, -1),
				amount: parseFloat(inputAmount, 10)
			};
			$('.coin-amount, .coin-search').val('');

			addHolding(newHolding)
				.then(holding => {
					console.log(holding);
					renderPortfolio();
				})
				.catch(err => console.error(err));
		} else {
			$('.search-help').attr('hidden', false);
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

function round(value, decimals = 2) {
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
		.toFixed(decimals)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function populateHoldings(holdings) {
	const currency = localStorage.getItem('currency').toLowerCase();
	let populatedHoldings = [];

	holdings.forEach(holding => {
		const tickerObj = tickerData.filter(
			element => element.symbol === holding.symbol
		)[0];
		const populatedHolding = {
			id: holding.id,
			symbol: holding.symbol,
			name: holding.name, // coin.name
			amount: holding.amount,
			price: parseFloat(tickerObj[`price_${currency}`]),
			value: holding.amount * parseFloat(tickerObj[`price_${currency}`]),
			percent_change_24h: parseFloat(tickerObj.percent_change_24h),
			percent_change_7d: parseFloat(tickerObj.percent_change_7d)
		};
		populatedHoldings.push(populatedHolding);
	});
	return populatedHoldings;
}

function renderPortfolio() {
	let populatedHoldings;

	getHoldings()
		.then(data => {
			return populateHoldings(data.holdings);
		})
		.then(_populatedHoldings => {
			populatedHoldings = _populatedHoldings;
			const p1 = getPortfolioHeader(populatedHoldings);
			const p2 = getPortfolioTable(populatedHoldings);
			const p3 = getPortfolioFooter(populatedHoldings);

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

			if (populatedHoldings.length) {
				renderChart(populatedHoldings);
			} else {
				$('#chart-container').attr('hidden', true);
			}

			handleNewCoinSubmit();
			handleAddPortfolioItemClick();
			handleCancelAdditionBtn(populatedHoldings);
			handleDeletePortfolioItem();
			handleEditCurrency();
			handleTableSorting();
		});
}

function getPortfolioHeader(populatedHoldings) {
	const symbol = getCurrencySymbol();
	let helpOrPerformance = '<p>Your portfolio is currently empty.</p>';
	let portfolioData = {
		total: 0,
		totalBTC: 0
	};

	if (populatedHoldings.length) {
		portfolioData = getPortfolioData(populatedHoldings);
		populatedHoldings.map(
			holding =>
				(holding.allocation = 100 / portfolioData.total * holding.value)
		);
		portfolioData.total = round(portfolioData.total);
		helpOrPerformance = getPortfolioPerformance(portfolioData, symbol);
	}

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
				<p class="large-text">${symbol}${portfolioData.total}  <small>(₿${
		portfolioData.totalBTC
	})</small></p>
			</div>
			<div class="five columns text-left">
				${helpOrPerformance}
			</div>
			<div class="three columns chart-container u-full-width">
				<canvas id="allocation-chart" hidden></canvas>
			</div>
		</div>`;
}

function getPortfolioData(populatedHoldings) {
	const total = populatedHoldings.reduce((sum, holding) => {
		return sum + holding.value;
	}, 0);
	const total24HrsAgo = populatedHoldings.reduce((sum, holding) => {
		return sum + getPastValue(holding.value, holding.percent_change_24h);
	}, 0);
	const change24Hrs = total - total24HrsAgo;
	const change24HrsPct = 100 * (total / total24HrsAgo - 1);
	const total7DaysAgo = populatedHoldings.reduce((sum, holding) => {
		return sum + getPastValue(holding.value, holding.percent_change_7d);
	}, 0);
	const change7Days = total - total7DaysAgo;
	const change7DaysPct = 100 * (total / total7DaysAgo - 1);
	const totalBTC = getBTCValue(total);

	globalPortfolioValue = total;
	return {
		total: total,
		totalBTC: round(totalBTC, 3),
		change24Hrs: round(change24Hrs),
		change24HrsPct: round(change24HrsPct),
		change7Days: round(change7Days),
		change7DaysPct: round(change7DaysPct)
	};
}

function getPastValue(value, pctChange) {
	return value / (1 + pctChange / 100);
}

function getBTCValue(value) {
	const currency = localStorage.getItem('currency').toLowerCase();
	const btcObj = tickerData.find(element => element.symbol === 'BTC');

	return value / btcObj[`price_${currency}`];
}

function getPortfolioPerformance(data, symbol) {
	const gainOrLoss24Hrs = data.change24HrsPct > 0 ? 'gain' : 'loss';
	const gainOrLoss7Days = data.change7DaysPct > 0 ? 'gain' : 'loss';

	return `
	<strong>24 HOURS</strong>
	<p class="${gainOrLoss24Hrs} large-text">${symbol}${data.change24Hrs} <small>(${
		data.change24HrsPct
	}%)</small></p>
	<strong>7 DAYS</strong>
	<p class="${gainOrLoss7Days} large-text">${symbol}${data.change7Days} <small>(${
		data.change7DaysPct
	}%)</small></p>`;
}

function renderChart(populatedHoldings) {
	$('#chart-container').attr('hidden', false);
	const sortedHoldings = populatedHoldings.sort((a, b) => {
		return b.allocation - a.allocation;
	});
	const ctx = document.getElementById('allocation-chart').getContext('2d');
	const chart = new Chart(ctx, {
		type: 'pie',
		data: {
			labels: getChartLabels(sortedHoldings),
			datasets: [
				{
					label: 'Holdings',
					data: getChartData(sortedHoldings),
					backgroundColor: getChartColors(),
					borderColor: '#fff',
					borderWidth: 1
				}
			]
		},
		options: {
			legend: {
				display: false
			},
			animation: {
				duration: 0
			},
			tooltips: {
				callbacks: {
					label: function(tooltipItem, data) {
						return (
							data.labels[tooltipItem.index] +
							': ' +
							round(
								data.datasets[tooltipItem.datasetIndex].data[
									tooltipItem.index
								]
							) +
							'%'
						);
					}
				}
			}
		}
	});
}

function getChartLabels(sortedHoldings) {
	return sortedHoldings.map(holding => holding.name);
}

function getChartData(sortedHoldings) {
	return sortedHoldings.map(holding => holding.allocation);
}

function getChartColors() {
	return [
		'#4D4D4D',
		'#5DA5DA',
		'#FAA43A',
		'#60BD68',
		'#F17CB0',
		'#B2912F',
		'#B276B2',
		'#DECF3F',
		'#F15854',
		'#072A49',
		'#108A9F',
		'#431833'
	];
}

function getPortfolioTable(populatedHoldings) {
	const symbol = getCurrencySymbol();
	let tableRowsHtmlString = '';

	if (populatedHoldings.length) {
		populatedHoldings.forEach(holding => {
			const gainOrLoss24Hrs =
				holding.percent_change_24h > 0 ? 'gain' : 'loss';
			const gainOrLoss7Days =
				holding.percent_change_7d > 0 ? 'gain' : 'loss';

			const price = round(holding.price);
			const value = round(holding.value);
			const allocation = round(holding.allocation);

			tableRowsHtmlString += `
		<tr>
		<td data-label="&nbsp;&nbsp;&nbsp;&nbsp;Coin"><span class="leftmost-cell">${
			holding.name
		}</span></td>
		<td data-label="Price">${symbol}${price}</td>
		<td class="${gainOrLoss24Hrs}" data-label="24 hrs">${
				holding.percent_change_24h
			}%</td>
		<td class="${gainOrLoss7Days}" data-label="7 days">${
				holding.percent_change_7d
			}%</td>
		<td data-label="Amount">${holding.amount}</td>
		<td data-label="Value">${symbol}${value}</td>
		<td data-label="Allocation">${allocation}%</td>
		<td data-label="Delete"><a class="portfolio-link delete-holding rightmost-cell" data-coin="${
			holding.id
		}">x</a></td>
		</tr>`;
		});
	}

	return `
		<table class="u-full-width">
		  <thead class="darkest">
		    <tr>
		      <th>
		      	<a class="sortable-header leftmost-cell" data-sort="0">Name</a>
		      </th>
		      <th>
		      	<a class="sortable-header" data-sort="1">Price</a>
		      </th>
		      <th>
		      	<a class="sortable-header" data-sort="2">24 hrs</a>
		      </th>
		      <th>
		      	<a class="sortable-header" data-sort="3">7 days</a>
		      </th>
		      <th>
		      	<a class="sortable-header" data-sort="4">Amount</a>
		      </th>
		      <th>
		      	<a class="sortable-header" data-sort="5">Value</a>
		      </th>
		      <th>
		      	<a class="sortable-header" data-sort="6">Allocation</a>
		      </th>
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

function getPortfolioFooter(populatedHoldings) {
	if (!populatedHoldings.length) {
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
				<p class="search-help" aria-live="assertive" hidden>Invalid input</p>
			</div>
			<div class="four columns">
				<button type="submit" class="button-primary">Add coin</button>
				<a class="button cancel-addition-btn" role="button">Cancel</a>
			</div>
		</div>
	</form>`;
}

function handleCancelAdditionBtn(populatedHoldings) {
	$('main').on('click', '.cancel-addition-btn', function() {
		const portfolioFooter = getPortfolioFooter(populatedHoldings);

		$('.js-add-coin-form, .portfolio-footer').remove();
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

function handleTableSorting() {
	$('main').on('click', '.sortable-header', function(event) {
		const sortParameter = $(this).data('sort');
		const sortDirection = $(this).find('span').length ? 'asc' : 'desc';
		const directionIcon = getDirectionIcon(sortDirection);

		$('.direction-icon').remove();
		$(this).append(directionIcon);
		sortTable(sortParameter, sortDirection);
		// sortTable(sortParameter);
	});
}

function getDirectionIcon(direction) {
	const stub = direction === 'asc' ? 'up' : 'down';
	return `
	<span class="direction-icon">
		<i class="fas fa-caret-${stub}"></i>
	</span>`;
}

function sortTable(param, dir) {
	const $table = $('table');
	let switching = true,
		switchcount = 0,
		shouldSwitch;

	while (switching) {
		let rows = $table.find('tr');
		let i;
		switching = false;

		for (i = 1; i < rows.length - 1; i++) {
			shouldSwitch = false;
			let x = rows[i].getElementsByTagName('td')[param];
			let y = rows[i + 1].getElementsByTagName('td')[param];
			let xValue = checkIfNumerical(
				x.firstElementChild
					? x.firstElementChild.textContent
					: x.textContent
			);
			let yValue = checkIfNumerical(
				y.firstElementChild
					? y.firstElementChild.textContent
					: y.textContent
			);

			if (dir === 'asc') {
				if (xValue > yValue) {
					shouldSwitch = true;
					break;
				}
			} else if (dir === 'desc') {
				if (xValue < yValue) {
					shouldSwitch = true;
					break;
				}
			}
		}

		if (shouldSwitch) {
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount++;
		} else {
			if (switchcount === 0 && dir === 'asc') {
				dir = 'desc';
				switching = true;
			}
		}
	}
}

function checkIfNumerical(s) {
	if (/^\d*\.?\d+%?$/.test(s)) {
		return parseFloat(s, 10);
	}
	return s;
}

$(function() {
	checkIfLoggedIn();
	handleModals();
	handleSignup();
	handleLogin();
	handleLogout();
	handleSettingsDropdown();
});
