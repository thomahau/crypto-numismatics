'use strict';
const UI = {
	handleModals: function() {
		$('body').click(function(event) {
			if ($(event.target).hasClass('modal')) {
				$('.modal').attr('hidden', true);
			}
		});

		$('.modal').on('click', '.close, .cancel-edit-btn', function() {
			$('.modal').attr('hidden', true);
		});

		this.handleRegisterModal();
		this.handleLoginModal();
		this.handleEditPortfolioModal();
	},
	handleRegisterModal: function() {
		$('.js-register').click(function() {
			$('.js-register-modal').attr('hidden', false);
		});
	},
	handleLoginModal: function() {
		$('.js-login').click(function() {
			$('.js-login-modal').attr('hidden', false);
		});
	},
	renderSignupSuccessMsg: function(username) {
		const signupSuccessMsg = _getSignupSuccessMsg(username);
		$('.register-modal-body').html(signupSuccessMsg);
	},
	renderSignupHelpMsg: function(err) {
		const signupHelpMsg = _getHelpMsg(err);
		$('#register-password, #register-password-confirm').val('');
		$('.register-help')
			.attr('hidden', false)
			.html(signupHelpMsg);
	},
	renderLoginHelpMsg: function(err) {
		const loginHelpMsg = _getHelpMsg(err);
		$('#login-username, #login-password').val('');
		$('.login-help')
			.attr('hidden', false)
			.html(loginHelpMsg);
	},
	renderLoggedInNav: function(username) {
		const navElements = _getNavElements(username);
		$('.js-login, .js-register').remove();
		$('.header-container').append(navElements);
	},
	renderSearchHelpMsg: function(err) {
		$('.search-help')
			.attr('hidden', false)
			.html(err);
	},
	handleSettingsDropdown: function() {
		$('main').on('click', '.js-drop-btn', function() {
			$('.dropdown-content').toggleClass('show');
		});

		$('body').click(function(event) {
			if (
				!$(event.target)
					.parent()
					.hasClass('js-drop-btn')
			) {
				$('.dropdown-content').removeClass('show');
			}
		});
	},
	renderPortfolio: function() {
		let populatedHoldings;
		$('.welcome-container, .search-help, .stats-wrapper').attr(
			'hidden',
			true
		);

		Holdings.get()
			.then(data => {
				return Holdings.populate(data.holdings);
			})
			.then(_populatedHoldings => {
				populatedHoldings = _populatedHoldings;
				const p1 = _getPortfolioHeader(populatedHoldings);
				const p2 = _getPortfolioTable(populatedHoldings);
				const p3 = _getPortfolioFooter(populatedHoldings);

				return Promise.all([p1, p2, p3]);
			})
			.then(values => {
				const [header, table, footer] = values;

				$('.portfolio-container')
					.attr('hidden', false)
					.empty()
					.append(header)
					.append(table)
					.append(footer);

				if (populatedHoldings.length) {
					PieChart.render(populatedHoldings);
					$('#chart-container').attr('hidden', false);
				} else {
					$('#chart-container').attr('hidden', true);
				}

				this.handleNewCoinSubmit();
				this.handleAddPortfolioItemClick();
				this.handleCancelAdditionBtn(populatedHoldings);
				this.handleDeletePortfolioItem();
				this.handleEditCurrency();
				this.handleTableSorting();
			});
	},
	handleAddPortfolioItemClick: function(populatedHoldings) {
		$('main').on('click', '.js-add-portfolio-item', function() {
			const newItemForm = _getNewItemForm();

			$('.portfolio-footer').remove();
			$('.portfolio-container').append(newItemForm);
			UI.populateSearchOptions();
		});
	},
	populateSearchOptions: function() {
		availableCoins = tickerData.map(tickerObj => {
			return `${tickerObj.name} (${tickerObj.symbol})`;
		});

		$('.coin-search').autocomplete({
			source: availableCoins
		});
	},
	handleCancelAdditionBtn: function(populatedHoldings) {
		$('main').on('click', '.cancel-addition-btn', function() {
			const portfolioFooter = _getPortfolioFooter(populatedHoldings);

			$('.js-add-coin-form, .portfolio-footer').remove();
			$('.portfolio-container').append(portfolioFooter);
		});
	},
	handleNewCoinSubmit: function() {
		$('main').on('submit', '.js-add-coin-form', function(event) {
			event.preventDefault();
			const inputAmount = $('.coin-amount').val();
			const inputCoin = $('.coin-search').val();

			_validateInput(inputCoin)
				.then(isValid => {
					const coinElements = inputCoin.split('(');
					const newHolding = {
						symbol: coinElements[1].slice(0, -1),
						name: coinElements[0].slice(0, -1),
						amount: parseFloat(inputAmount, 10)
					};

					return Holdings.add(newHolding);
				})
				.then(holding => {
					UI.renderPortfolio();
				})
				.catch(err => {
					UI.renderSearchHelpMsg(err);
				});
		});
	},
	handleEditPortfolioModal: function() {
		$('main').on('click', '.js-edit-portfolio', function() {
			Holdings.get()
				.then(data => {
					return _getEditPortfolioForm(data.holdings);
				})
				.then(editPortfolioForm => {
					$('.edit-holdings-modal').attr('hidden', false);
					$('.js-edit-form-container').html(editPortfolioForm);
					UI.handleEditPortfolioSubmit();
				});
		});
	},
	handleEditPortfolioSubmit: function() {
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
					return Holdings.delete(item.id);
				}
				return Holdings.update(item);
			});

			Promise.all(updates)
				.then(values => {
					UI.renderPortfolio();
					$('.modal').attr('hidden', true);
				})
				.catch(err => console.error(err));
		});
	},
	handleDeletePortfolioItem: function() {
		$('body').on('click', '.delete-holding', function(event) {
			const id = $(this).data('coin');

			Holdings.delete(id)
				.then(() => {
					UI.renderPortfolio();
					$('.modal').attr('hidden', true);
				})
				.catch(err => console.error(err));
		});
	},
	handleEditCurrency: function() {
		$('main').on('click', '.js-edit-currency', function() {
			$('.currency-select').val(localStorage.getItem('currency'));
			$('.edit-currency-modal').attr('hidden', false);
			UI.handleEditCurrencySubmit();
		});
	},
	handleEditCurrencySubmit: function() {
		$('.edit-currency-form').submit(function(event) {
			event.preventDefault();
			const currency = $('.currency-select').val();
			localStorage.setItem('currency', currency);

			getTickerData(currency)
				.then(data => {
					tickerData = data;

					UI.renderPortfolio();
					$('.modal').attr('hidden', true);
				})
				.catch(err => console.error(err));
		});
	},
	handleTableSorting: function() {
		$('main').on('click', '.sortable-header', function(event) {
			const $header = $(this);
			const sortParameter = $header.data('sort');

			UI.sortTable(sortParameter, $header);
		});
	},
	sortTable: function(param, $header) {
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
				let xValue = Lib.formatForSort(
					x.firstElementChild
						? x.firstElementChild.textContent
						: x.textContent
				);
				let yValue = Lib.formatForSort(
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
				const directionIcon = _getDirectionIcon(dir);

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
};

function _getSignupSuccessMsg(username) {
	return `
	<p>Welcome aboard, ${username}! You may now log in.</p>
	<button class="button-primary first-login">Log in</button>`;
}

function _getHelpMsg(err) {
	return `
	<span class="loss">${err}</span>`;
}

function _getNavElements(username) {
	return `
	<a class="js-logout u-pull-right">
		<i class="fas fa-sign-out-alt"></i><span class="nav-text"> Log out</span>
	</a>
	<p class="u-pull-right li-space">
		${username}
	</p>`;
}

function _getNewItemForm() {
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

function _getPortfolioHeader(populatedHoldings) {
	const symbol = Lib.getCurrencySymbol(localStorage.getItem('currency'));
	let helpOrPerformance = '<p>Your portfolio is currently empty.</p>';
	let portfolioData = {
		total: 0,
		totalBTC: 0
	};

	if (populatedHoldings.length) {
		portfolioData = Holdings.getTotals(populatedHoldings);
		populatedHoldings.map(
			holding =>
				(holding.allocation = 100 / portfolioData.total * holding.value)
		);
		portfolioData.total = Lib.round(portfolioData.total);
		helpOrPerformance = _getPortfolioPerformance(portfolioData, symbol);
	}

	return `
		<div class="row darkest">
			<ul class="nav-list portfolio-header">
				<li class="u-pull-right">
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
				<p class="large-text">${symbol}${portfolioData.total} <small>(₿${
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

function _getPortfolioPerformance(data, symbol) {
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

function _getPortfolioTable(populatedHoldings) {
	const symbol = Lib.getCurrencySymbol(localStorage.getItem('currency'));
	let tableRowsHtmlString = '';

	if (populatedHoldings.length) {
		populatedHoldings.forEach(holding => {
			const gainOrLoss24Hrs =
				holding.percent_change_24h > 0 ? 'gain' : 'loss';
			const gainOrLoss7Days =
				holding.percent_change_7d > 0 ? 'gain' : 'loss';

			const price = Lib.round(holding.price);
			const value = Lib.round(holding.value);
			const allocation = Lib.round(holding.allocation);

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

function _getPortfolioFooter(populatedHoldings) {
	if (!populatedHoldings.length) {
		return `
		<div class="row portfolio-footer darkest">
			<button class="button-primary u-pull-left js-add-portfolio-item start-btn">Add your first coin</button>
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

function _getEditPortfolioForm(holdings) {
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

function _validateInput(input) {
	return new Promise((resolve, reject) => {
		let validInput = false;
		for (let i = 0; i < availableCoins.length && !validInput; i++) {
			if (input === availableCoins[i]) {
				validInput = true;
				$('.search-help').attr('hidden', true);
				$('.coin-amount, .coin-search').val('');
				return resolve(validInput);
			}
		}
		setTimeout(() => reject('Invalid input'), 200);
	});
}

function _getDirectionIcon(direction) {
	const stub = direction === 'desc' ? 'down' : 'up';
	return `
	<span class="direction-icon">
		<i class="fas fa-caret-${stub}"></i>
	</span>`;
}
