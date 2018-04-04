'use strict';

function populateSearchOptions() {
	$('#coin').autocomplete({
		source: COINS
	});

	$('.coin-search').autocomplete({
		source: COINS
	});
}

function handleAddPortfolio() {
	$('.add-coin-form').submit(function(event) {
		event.preventDefault();
		const inputAmount = $(this)
			.find('#amount')
			.val();
		const inputCoin = $(this)
			.find('#coin')
			.val();

		if (isValidInput(inputCoin)) {
			const coinElements = inputCoin.split('(');

			// TODO: remove help text if visible
			const portfolioItem = {
				coin: coinElements[0],
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
	// console.log(item);  CLEAN UP HERE
	let portfolioItem = mockData.filter(coin => coin.symbol === item.symbol)[0];
	portfolioItem.name = item.coin;
	portfolioItem.amount = item.amount;
	portfolioItem.value = item.amount * portfolioItem.price_usd;
	$('.js-welcome-container').remove(); // or empty?
	renderPortfolio(portfolioItem);
}

function renderPortfolio(item) {
	// TODO: Add colors for gain/loss | Add allocation formula | format decimals
	// Different colors for thead + totals etc? | functioning delete cross in last cell

	const portfolioHeader = getPortfolioHeader(item);
	const portfolioItem = getPortfolioItem(item);
	const portfolioFooter = getPortfolioFooter();

	$('.js-portfolio-container')
		.attr('hidden', false)
		.append(portfolioHeader)
		.append(portfolioItem)
		.append(portfolioFooter);
}

function getPortfolioHeader(item) {
	const portfolioValue = item.value; // sum of all items
	// const portfolio_percent_change_24h = ;

	const portfolioHeader = `
		<div class="row">
			<ul class="portfolio-menu">
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
		<div class="row">
			<div class="three columns text-left">
				<strong>PORTFOLIO VALUE</strong>
				<p>$${portfolioValue}</p>
			</div>
			<div class="three columns text-left">
				<strong>24 HOURS</strong>
				<p>$X <small>X%</small></p>
			</div>
			<div class="three columns text-left">
				<strong>7 DAYS</strong>
				<p>$X <small>X%</small></p>
			</div>
			<div class="three columns">
				<button class="button-primary">Save Portfolio</button>
			</div>
		</div>`;

	return portfolioHeader;
}

function getPortfolioItem(item) {
	const portfolioItem = `
		<table class="u-full-width">
		  <thead>
		    <tr>
		      <th>Coin</th>
		      <th>Price</th>
		      <th>24h % chg</th>
		      <th>Amount</th>
		      <th>Value</th>
		      <th>Allocation</th>
		      <th></th>
		    </tr>
		  </thead>
		  <tbody>
		    <tr>
		      <td>${item.name} (${item.symbol})</td>
		      <td>$${item.price_usd}</td>
		      <td>${item.percent_change_24h}%</td>
		      <td>${item.amount}</td>
		      <td>$${item.value}</td>
		      <td>100%</td>
		      <td>X</td>
		    </tr>
		  </tbody>
		</table>`;

	return portfolioItem;
}

function getPortfolioFooter() {
	return `
		<div class="row portfolio-footer">
			<ul class="portfolio-menu">
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

function handleAddPortfolioItem() {
	$('main').on('click', '.add-portfolio-item', function() {
		const newItemForm = getNewItemForm();

		$('.portfolio-footer').remove();
		$('.js-portfolio-container').append(newItemForm);
		populateSearchOptions();
	});
}

function getNewItemForm() {
	return `
	<form>
		<div class="row text-left">
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
	handleAddPortfolio();
	handleAddPortfolioItem();
});
