'use strict';

function getSearchOptions(callback) {
	callback(coins);
}

function populateSearchOptions(searchOptions) {
	$('#coin').autocomplete({
		source: coins
	});
}

function getAndPopulateSearchOptions() {
	getSearchOptions(populateSearchOptions);
}

$(function() {
	getAndPopulateSearchOptions();
});
