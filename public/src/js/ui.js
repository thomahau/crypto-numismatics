'use strict';
App.UI = {
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
		this.handleKeyboardUse();
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
	handleKeyboardUse: function() {
		// user can close modal with esc key
		// user can open links with enter or space key
		$('body').keyup(function(event) {
			if (event.keyCode === 27) {
				$('.modal').attr('hidden', true);
			}
		});
		$('body').on('keyup', 'a[role="button"]', function(event) {
			if (event.keyCode === 13 || event.keyCode === 32) {
				$(this).click();
				$(this)
					.find('span')
					.click();
			}
		});
	},
	renderStartPage: function() {
		$(
			'.portfolio-container, .js-username, .js-logout, .js-register-success'
		).attr('hidden', true);
		$(
			'.welcome-container, .stats-wrapper, .js-login, .js-register, .register-form, .particles-js-canvas-el'
		).attr('hidden', false);
	},
	renderSignupHelpMsg: function(err) {
		const signupHelpMsg = this.getHelpMsg(err);

		$('.register-password, .register-password-confirm').val('');
		$('.register-help')
			.attr('hidden', false)
			.html(signupHelpMsg);
	},
	renderLoginHelpMsg: function(err) {
		const loginHelpMsg = this.getHelpMsg(err);

		$('.login-username, .login-password').val('');
		$('.login-help')
			.attr('hidden', false)
			.html(loginHelpMsg);
	},
	getHelpMsg: function(err) {
		return `
		<span class="loss">${err}</span>`;
	},
	renderLoggedInNav: function(username) {
		const navElements = this.getNavElements(username);

		$('.js-login, .js-register, .modal').attr('hidden', true);
		$('.js-logout, .js-username').remove();
		$('.header-right').append(navElements);
	},
	getNavElements: function(username) {
		return `
		<span class="js-username li-space">${username}</span>
		<a class="js-logout" role="button" tabindex="0" aria-label="Log out">
			<i class="fas fa-sign-out-alt"></i> Log out
		</a>`;
	},
	renderPortfolio: function() {
		let populatedHoldings;
		$(
			'.welcome-container, .search-help, .stats-wrapper, .particles-js-canvas-el'
		).attr('hidden', true);
		// get all of user's holdings; populate with current ticker data;
		// render portfolio overview: header + table + footer
		App.Holdings.get()
			.then(data => {
				return App.Holdings.populate(data.holdings);
			})
			.then(_populatedHoldings => {
				populatedHoldings = _populatedHoldings;
				const p1 = this.getPortfolioHeader(populatedHoldings);
				const p2 = this.getPortfolioTable(populatedHoldings);
				const p3 = this.getPortfolioFooter(populatedHoldings);

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
					App.Vendor.renderPieChart(populatedHoldings);
					$('.chart-container').attr('hidden', false);
				} else {
					$('.chart-container').attr('hidden', true);
				}

				this.handleNewCoinSubmit();
				this.handleAddPortfolioItemClick();
				this.handleCancelAdditionBtn(populatedHoldings);
				this.handleDeletePortfolioItem();
				this.handleEditCurrencyModal();
				this.handleTableViewSelection();
			});
	},
	getPortfolioHeader: function(populatedHoldings) {
		const symbol = App.Lib.getCurrencySymbol(
			localStorage.getItem('currency')
		);
		let helpOrPerformance = '<p>Your portfolio is currently empty.</p>';
		let portfolioData = {
			total: 0,
			totalBTC: 0
		};

		if (populatedHoldings.length) {
			portfolioData = App.Holdings.getTotals(populatedHoldings);
			populatedHoldings.map(
				holding =>
					(holding.allocation =
						100 / portfolioData.total * holding.value)
			);
			portfolioData.total = App.Lib.round(portfolioData.total);
			helpOrPerformance = this.getPortfolioPerformance(
				portfolioData,
				symbol
			);
		}

		return `
		<div class="row darkest">
			<div class="portfolio-header u-pull-right">
				<a class="portfolio-link js-edit-currency" role="button" tabindex="0">
					<i class="fas fa-cog"></i> Edit currency
				</a>
			</div>
		</div>
		<div class="row darker portfolio-overview">
			<div class="three columns text-left">
				<span class="portfolio-headline">PORTFOLIO VALUE</span>
				<p class="large-text">${symbol}${portfolioData.total} <small>(₿${
			portfolioData.totalBTC
		})</small></p>
			</div>
			<div class="five columns text-left">
				${helpOrPerformance}
			</div>
			<div class="three columns chart-container u-full-width">
				<canvas class="allocation-chart" hidden></canvas>
			</div>
		</div>`;
	},
	getPortfolioPerformance: function(data, symbol) {
		const gainOrLoss1Hr = data.change1HrPct > 0 ? 'gain' : 'loss';
		const gainOrLoss24Hrs = data.change24HrsPct > 0 ? 'gain' : 'loss';
		const gainOrLoss7Days = data.change7DaysPct > 0 ? 'gain' : 'loss';

		return `
		<span class="portfolio-headline">PERFORMANCE</span>
		<table class="performance-table">
			<tr>
				<td>1 hour</td>
				<td><span class="${gainOrLoss1Hr}">${symbol}${data.change1Hr}(${
			data.change1HrPct
		}%)</span></td>
			</tr>
			<tr>
				<td>24 hours</td>
				<td><span class="${gainOrLoss24Hrs}">${symbol}${data.change24Hrs} (${
			data.change24HrsPct
		}%)</span></td>
			</tr>
			<tr>
				<td>7 days</td>
				<td><span class="${gainOrLoss7Days}">${symbol}${data.change7Days} (${
			data.change7DaysPct
		}%)</span></td>
			</tr>
		</table>`;
	},
	getPortfolioTable: function(populatedHoldings) {
		const symbol = App.Lib.getCurrencySymbol(
			localStorage.getItem('currency')
		);
		let tableRowsHtmlString = '';
		// if user has holdings, each holding gets a table row
		if (populatedHoldings.length) {
			populatedHoldings.forEach(holding => {
				const gainOrLoss1Hr =
					holding.percent_change_1h > 0 ? 'gain' : 'loss';
				const gainOrLoss24Hrs =
					holding.percent_change_24h > 0 ? 'gain' : 'loss';
				const gainOrLoss7Days =
					holding.percent_change_7d > 0 ? 'gain' : 'loss';

				const price = App.Lib.round(holding.price);
				const value = App.Lib.round(holding.value);
				const allocation = App.Lib.round(holding.allocation);

				tableRowsHtmlString += `
				<tr>
					<td data-label="Coin">${holding.name}</td>
					<td data-label="Price">${symbol}${price}</td>
					<td class="${gainOrLoss1Hr} toggleable-view hidden" data-label="1 hr">${
					holding.percent_change_1h
				}%</td>
					<td class="${gainOrLoss24Hrs}" data-label="24 hrs">${
					holding.percent_change_24h
				}%</td>
					<td class="${gainOrLoss7Days} toggleable-view hidden" data-label="7 days">${
					holding.percent_change_7d
				}%</td>
					<td data-label="Amount" class="toggleable-view hidden">${holding.amount}</td>
					<td data-label="Value" class="toggleable-view hidden">${symbol}${value}</td>
					<td data-label="Allocation" class="toggleable-view hidden">${allocation}%</td>
					<td data-label="Delete ${holding.name}" class="toggleable-view hidden">
						<a class="portfolio-link delete-holding" role="button" tabindex="0" aria-label="delete ${
							holding.name
						}" data-coin="${
					holding.id
				}"><i class="fas fa-trash-alt"></i>
						</a>
					</td>
				</tr>`;
			});
		}
		// mobile-first table with toggle functionality between simple overview and all details.
		// table is sortable through clicking on table headers
		return `
		<div class="row darkest">
			<a class="button table-view-btn toggled" role="button" tabindex="0">simple view</a>
			<a class="button table-view-btn" role="button" tabindex="0">detailed view</a>
		</div>
		<table class="u-full-width portfolio-table">
		  <thead class="darkest">
		    <tr>
		      <th><a class="js-sortable-header" role="button" tabindex="0" data-sort="0">Name</a></th>
		      <th><a class="js-sortable-header" role="button" tabindex="0" data-sort="1">Price</a></th>
		      <th class="toggleable-view hidden"><a class="js-sortable-header" role="button" tabindex="0" data-sort="2">1 hr</a></th>
		      <th><a class="js-sortable-header" role="button" tabindex="0" data-sort="3">24 hrs</a></th>
		      <th class="toggleable-view hidden"><a class="js-sortable-header" role="button" tabindex="0" data-sort="4">7 days</a></th>
		      <th class="toggleable-view hidden"><a class="js-sortable-header" role="button" tabindex="0" data-sort="5">Amount</a></th>
		      <th class="toggleable-view hidden"><a class="js-sortable-header" role="button" tabindex="0" data-sort="6">Value</a></th>
		      <th class="toggleable-view hidden"><a class="js-sortable-header" role="button" tabindex="0" data-sort="7">Allocation</a></th>
		      <th class="toggleable-view hidden"></th>
		    </tr>
		  </thead>
		  <tbody class="darker">
			${tableRowsHtmlString}
		  </tbody>
		 </table>`;
	},
	getPortfolioFooter: function(holdings) {
		return !holdings.length ? this.firstAddHtml : this.subsequentAddHtml;
	},
	// user's portfolio is empty
	firstAddHtml: `
	<div class="row portfolio-footer darkest">
		<button class="button-primary u-pull-left js-add-portfolio-item start-btn">Add your first coin</button>
	</div>
	`,
	// user has holdings to display
	subsequentAddHtml: `
	<div class="row portfolio-footer darkest">
		<ul class="nav-list portfolio-footer-menu">
			<li class="u-pull-left li-space">
				<a class="portfolio-link js-add-portfolio-item" role="button" tabindex="0">
					<i class="fas fa-plus"></i> Add
				</a>
			</li>
			<li class="u-pull-left">
				<a class="portfolio-link js-edit-portfolio" role="button" tabindex="0">
					<i class="fas fa-edit"></i> Edit
				</a>
			</li>
		</ul>
	</div>
	`,
	handleAddPortfolioItemClick: function(populatedHoldings) {
		$('main').on('click', '.js-add-portfolio-item', function() {
			$('.portfolio-footer, .js-add-coin-form').remove();
			$('.portfolio-container').append(App.UI.newItemForm);
			App.UI.populateSearchOptions();
		});
	},
	newItemForm: `
	<form class="js-add-coin-form">
		<div class="row portfolio-footer text-left darkest">
			<div class="six columns">
				<input type="search" class="coin-search" placeholder="Search coins..." required autofocus>
				<input type="number" class="coin-amount" placeholder="Amount" min="0" step="any" required>
				<p class="search-help" aria-live="assertive" hidden></p>
			</div>
			<div class="four columns">
				<button type="submit" class="button-primary">Add coin</button>
				<a class="button cancel-addition-btn" role="button" tabindex="0">Cancel</a>
			</div>
		</div>
	</form>
	`,
	populateSearchOptions: function() {
		// search box suggestions from all coins available in coinmarketcap.com API call
		availableCoins = tickerData.map(tickerObj => {
			return `${tickerObj.name} (${tickerObj.symbol})`;
		});

		$('.coin-search').autocomplete({
			source: availableCoins
		});
	},
	handleCancelAdditionBtn: function(populatedHoldings) {
		$('main').on('click', '.cancel-addition-btn', function() {
			const portfolioFooter = App.UI.getPortfolioFooter(
				populatedHoldings
			);

			$('.js-add-coin-form, .portfolio-footer').remove();
			$('.portfolio-container').append(portfolioFooter);
		});
	},
	handleNewCoinSubmit: function() {
		$('main').on('submit', '.js-add-coin-form', function(event) {
			event.preventDefault();
			event.stopImmediatePropagation();
			const inputAmount = $('.coin-amount').val();
			const inputCoin = $('.coin-search').val();

			App.UI.validateInput(inputCoin)
				.then(function(isValid) {
					const coinElements = inputCoin.split('(');
					const newHolding = {
						symbol: coinElements[1].slice(0, -1),
						name: coinElements[0].slice(0, -1),
						amount: parseFloat(inputAmount, 10)
					};

					$('.coin-search, .coin-amount').val('');
					$('.search-help').attr('hidden', true);

					return App.Holdings.add(newHolding);
				})
				.then(() => {
					App.UI.renderPortfolio();
				})
				.catch(function(err) {
					App.UI.renderSearchHelpMsg(err);
				});
		});
	},
	validateInput: function(input) {
		return new Promise((resolve, reject) => {
			availableCoins.includes(input)
				? resolve()
				: reject('Invalid coin name');
		});
	},
	renderSearchHelpMsg: function(err) {
		$('.search-help')
			.attr('hidden', false)
			.html(err);
	},
	handleEditPortfolioModal: function() {
		$('main').on('click', '.js-edit-portfolio', function() {
			// get user's holdings and populate form in modal
			App.Holdings.get()
				.then(data => {
					return App.UI.getEditPortfolioForm(data.holdings);
				})
				.then(editPortfolioForm => {
					$('.edit-holdings-modal').attr('hidden', false);
					$('.js-edit-form-container').html(editPortfolioForm);
					App.UI.handleEditPortfolioSubmit();
				});
		});
	},
	getEditPortfolioForm: function(holdings) {
		let holdingsHtmlString = '';

		holdings.forEach(item => {
			holdingsHtmlString += `
			<div class="row">
				<div class="three columns">
					<label for="${item.name}">${item.name}</label>
				</div>
				<div class="nine columns">
					<input type="number" name="${item.id}" id="${item.name}" value=${
				item.amount
			} min="0" step="any" />
					<a class="button delete-holding" role="button" tabindex="0" data-coin="${
						item.id
					}">Delete</a>
				</div>
			</div>`;
		});

		return `
		<form class="edit-portfolio-form">
		  ${holdingsHtmlString}
		  <div class="row">
			<button type="submit" class="button-primary">Update</button>
			<a class="button cancel-edit-btn" role="button" tabindex="0">Cancel</a>
		</div>`;
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
			// update or delete user's holdings according to values submitted, then re-render portfolio
			const updates = submittedValues.map(item => {
				if (item.amount === 0) {
					return App.Holdings.delete(item.id);
				}
				return App.Holdings.update(item);
			});

			Promise.all(updates)
				.then(values => {
					App.UI.renderPortfolio();
					$('.modal').attr('hidden', true);
				})
				.catch(err => console.error(err));
		});
	},
	handleDeletePortfolioItem: function() {
		$('body').on('click', '.delete-holding', function(event) {
			const id = $(this).data('coin');

			if (window.confirm('Are you sure?')) {
				App.Holdings.delete(id)
					.then(() => {
						App.UI.renderPortfolio();
						$('.modal').attr('hidden', true);
					})
					.catch(err => console.error(err));
			} else {
				return false;
			}
		});
	},
	handleEditCurrencyModal: function() {
		$('main').on('click', '.js-edit-currency', function() {
			$('.currency-select').val(localStorage.getItem('currency'));
			$('.edit-currency-modal').attr('hidden', false);
			App.UI.handleEditCurrencySubmit();
		});
	},
	handleEditCurrencySubmit: function() {
		$('.edit-currency-form').submit(function(event) {
			event.preventDefault();
			const currency = $('.currency-select').val();
			localStorage.setItem('currency', currency);
			// make API call to get ticker data converted to new currency, then re-render portfolio
			App.getTickerData(currency)
				.then(data => {
					tickerData = data;
					App.UI.renderPortfolio();
					$('.modal').attr('hidden', true);
				})
				.catch(err => console.error(err));
		});
	},
	handleTableSorting: function() {
		$('main').on('click', '.js-sortable-header', function(event) {
			const $header = $(this);
			const sortParameter = $header.data('sort');

			App.UI.sortTable(sortParameter, $header);
		});
	},
	sortTable: function(param, $header) {
		// custom sorting based on which header user clicked
		const $table = $('.portfolio-table');
		let switching = true;
		let switchcount = 0;
		let dir = 'desc';
		let shouldSwitch;
		// loop will continue until no switching has been done
		while (switching) {
			let rows = $table.find('tr');
			let i;
			switching = false;
			// loop through all table rows except the first (table headers)
			for (i = 1; i < rows.length - 1; i++) {
				shouldSwitch = false;
				// get and format the two elements to compare, one from current row and one from the next
				let x = rows[i].getElementsByTagName('td')[param];
				let y = rows[i + 1].getElementsByTagName('td')[param];
				let xValue = App.Lib.formatForSort(
					x.firstElementChild
						? x.firstElementChild.textContent
						: x.textContent
				);
				let yValue = App.Lib.formatForSort(
					y.firstElementChild
						? y.firstElementChild.textContent
						: y.textContent
				);
				// check if the two rows should switch place, based on direction
				// if so, mark as a switch and break the loop
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
				// if a switch has been marked, make the switch and mark that a switch has been done
				// also, insert direction icon next to table header
				const directionIcon = this.getDirectionIcon(dir);

				$('.direction-icon').remove();
				$header.append(directionIcon);
				rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
				switching = true;
				switchcount++;
			} else {
				// if no switching has been done and direction is 'desc', switch direction and run while loop again
				if (switchcount === 0 && dir === 'desc') {
					dir = 'asc';
					switching = true;
				}
			}
		}
	},
	getDirectionIcon: function(direction) {
		const stub = direction === 'desc' ? 'down' : 'up';
		return `
		<span class="direction-icon">
			<i class="fas fa-caret-${stub}"></i>
		</span>`;
	},
	handleTableViewSelection: function() {
		$('main').on('click', '.table-view-btn', function(event) {
			if (!$(this).hasClass('toggled')) {
				const viewType = $(this)
					.html()
					.split(' ')[0];
				// update which parts of table are displayed, based on button clicked
				$('.table-view-btn').toggleClass('toggled');
				if (viewType === 'detailed') {
					$('.toggleable-view').removeClass('hidden');
					$('.portfolio-table')
						.find('thead')
						.addClass('hidden');
					$('.portfolio-table')
						.find('tr, td')
						.addClass('detailed');
				} else if (viewType === 'simple') {
					$('.toggleable-view').addClass('hidden');
					$('.portfolio-table')
						.find('thead')
						.removeClass('hidden');
					$('.portfolio-table')
						.find('tr, td')
						.removeClass('detailed');
				}
			}
		});
	}
};
