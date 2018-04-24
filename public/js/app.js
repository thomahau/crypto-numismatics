'use strict';
const COINMARKETCAP_ENDPOINT = 'https://api.coinmarketcap.com/v1/';
let tickerData;
let availableCoins;
let globalPortfolioValue = 0;

function populateSearchOptions() {
	availableCoins = tickerData.map(tickerObj => {
		return `${tickerObj.name} (${tickerObj.symbol})`;
	});

	$('.coin-search').autocomplete({
		source: availableCoins
	});
}

function checkIfLoggedIn() {
	if (localStorage.getItem('token') && localStorage.getItem('username')) {
		const username = localStorage.getItem('username');
		const currency = localStorage.getItem('currency');

		UI.renderLoggedInNav(username);

		getTickerData(currency)
			.then(data => {
				tickerData = data;
				UI.renderPortfolio();
			})
			.catch(err => console.error(err));
	} else {
		$('.welcome-container, .stats-wrapper').attr('hidden', false);
	}
}

function getTickerData(currency) {
	// returns current ticker data for all cryptocurrencies tracked by coinmarketcap.com
	const url = COINMARKETCAP_ENDPOINT + `ticker/?limit=0&convert=${currency}`;

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
				UI.renderSignupSuccessMsg(user.username);
				handleFirstLogin(credentials);
			})
			.catch(err => {
				UI.renderSignupHelpMsg(err);
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
			throw `${data.reason}: ${data.location} ${data.message}`;
		});
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

				$('.modal').attr('hidden', true);
				checkIfLoggedIn();
			})
			.catch(err => {
				UI.renderLoginHelpMsg(err);
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

function handleLogout() {
	$('header').on('click', '.js-logout', function() {
		localStorage.removeItem('username');
		localStorage.removeItem('token');
		location.reload();
	});
}

function round(value, decimals = 2) {
	//TODO: lib ?
	return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals)
		.toFixed(decimals)
		.toString()
		.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function handleTableSorting() {
	$('main').on('click', '.sortable-header', function(event) {
		const $header = $(this);
		const sortParameter = $header.data('sort');

		sortTable(sortParameter, $header);
	});
}

function sortTable(param, $header) {
	const $table = $('table');
	let switching = true,
		switchcount = 0,
		dir = 'desc',
		shouldSwitch;

	while (switching) {
		let rows = $table.find('tr');
		let i;
		switching = false;

		for (i = 1; i < rows.length - 1; i++) {
			shouldSwitch = false;
			let x = rows[i].getElementsByTagName('td')[param];
			let y = rows[i + 1].getElementsByTagName('td')[param];
			let xValue = formatForSort(
				x.firstElementChild
					? x.firstElementChild.textContent
					: x.textContent
			);
			let yValue = formatForSort(
				y.firstElementChild
					? y.firstElementChild.textContent
					: y.textContent
			);

			if (dir === 'desc') {
				if (xValue < yValue) {
					shouldSwitch = true;
					break;
				}
			} else if (dir === 'asc') {
				if (xValue > yValue) {
					shouldSwitch = true;
					break;
				}
			}
		}

		if (shouldSwitch) {
			const directionIcon = getDirectionIcon(dir);

			$('.direction-icon').remove();
			$header.append(directionIcon);
			rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
			switching = true;
			switchcount++;
		} else {
			if (switchcount === 0 && dir === 'desc') {
				dir = 'asc';
				switching = true;
			}
		}
	}
}

function formatForSort(s) {
	// make sure we have clean values to compare in sort function
	if (/^-?\$?\d*,?\d*\.?\d+%?$/.test(s)) {
		return parseFloat(s.replace(/[\$€£,]/g, ''), 10);
	}
	return s.toLowerCase();
}

function getDirectionIcon(direction) {
	const stub = direction === 'desc' ? 'down' : 'up';
	return `
	<span class="direction-icon">
		<i class="fas fa-caret-${stub}"></i>
	</span>`;
}

$(function() {
	checkIfLoggedIn();
	UI.handleModals();
	handleSignup();
	handleLogin();
	handleLogout();
	UI.handleSettingsDropdown();
});
