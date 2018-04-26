'use strict';
const COINMARKETCAP_URI = 'https://api.coinmarketcap.com/v1/';
let availableCoins;
let tickerData;

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
	const init = getFetchInit(credentials);
	let res;

	return fetch('users', init)
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
	const init = getFetchInit(credentials);
	return fetch('auth/login', init).then(res => {
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

function getFetchInit(data) {
	return {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	};
}

function getTickerData(currency) {
	// returns current ticker data for all cryptocurrencies tracked by coinmarketcap.com
	const url = COINMARKETCAP_URI + `ticker/?limit=0&convert=${currency}`;

	return fetch(url).then(res => {
		if (res.ok) {
			return res.json();
		}
		throw new Error('Network response was not ok.');
	});
}

$(function() {
	checkIfLoggedIn();
	UI.handleModals();
	handleSignup();
	handleLogin();
	handleLogout();
	UI.handleSettingsDropdown();
});
