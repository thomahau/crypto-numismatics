'use strict';
const COINMARKETCAP_URI = 'https://api.coinmarketcap.com/v1/';
let availableCoins;
let tickerData;

const App = {
  checkIfLoggedIn: function() {
    if (localStorage.getItem('token') && localStorage.getItem('username')) {
      const username = localStorage.getItem('username');
      const currency = localStorage.getItem('currency');

      App.UI.renderLoggedInNav(username);

      App.getTickerData(currency)
        .then(data => {
          tickerData = data;
          App.UI.renderPortfolio();
          App.handleLogout();
        })
        .catch(err => console.error(err));
    } else {
      App.Vendor.renderParticles();
      App.UI.renderStartPage();
      App.handleSignup();
      App.handleLogin();
      App.handleDemo();
    }
  },
  handleSignup: function() {
    $('.register-form').submit(function(event) {
      event.preventDefault();
      const credentials = {
        username: $('.register-username').val(),
        password: $('.register-password').val(),
        passwordconfirm: $('.register-password-confirm').val()
      };

      App.register(credentials)
        .then(user => {
          $('.register-username, .register-password, .register-password-confirm').val('');
          $('.login-username').val(credentials.username);
          $('.login-password').val(credentials.password);
          $('.login-form').submit();
        })
        .catch(err => {
          App.UI.renderSignupHelpMsg(err);
        });
    });
  },
  register: function(credentials) {
    const init = this.getFetchInit(credentials);
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
  },
  handleLogin: function() {
    $('.login-form').submit(function(event) {
      event.preventDefault();
      const credentials = {
        username: $('.login-username').val(),
        password: $('.login-password').val()
      };

      App.login(credentials)
        .then(data => {
          localStorage.setItem('username', data.username);
          localStorage.setItem('token', data.authToken);
          if (!localStorage.getItem('currency')) {
            localStorage.setItem('currency', 'USD');
          }

          $('.login-username, .login-password').val('');
          App.checkIfLoggedIn();
        })
        .catch(err => {
          App.UI.renderLoginHelpMsg(err);
        });
    });
  },
  handleDemo: function() {
    $('.js-demo').click(function() {
      $('.login-username').val('demo');
      $('.login-password').val('password');
      $('.login-form').submit();
    });
  },
  login: function(credentials) {
    const init = this.getFetchInit(credentials);
    return fetch('auth/login', init).then(res => {
      if (res.ok) {
        return res.json();
      }
      throw 'ValidationError: Invalid username or password';
    });
  },
  getFetchInit: function(data) {
    return {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    };
  },
  handleLogout: function() {
    $('header').on('click', '.js-logout', function() {
      localStorage.removeItem('username');
      localStorage.removeItem('token');
      App.checkIfLoggedIn();
    });
  },
  getTickerData: function(currency) {
    // returns current ticker data for all the cryptocurrencies tracked by coinmarketcap.com
    const url = COINMARKETCAP_URI + `ticker/?limit=0&convert=${currency}`;

    return fetch(url).then(res => {
      if (res.ok) {
        return res.json();
      }
      throw new Error('Network response was not ok.');
    });
  }
};

$(function() {
  App.checkIfLoggedIn();
  App.UI.handleModals();
  App.UI.handleTableSorting();
});
