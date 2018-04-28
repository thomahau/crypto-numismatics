'use strict';
App.Vendor = {
	renderPieChart: function(holdings) {
		const sortedHoldings = holdings.sort((a, b) => {
			return b.allocation - a.allocation;
		});
		const ctx = document.getElementById('allocation-chart');
		const chart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: this.getChartLabels(sortedHoldings),
				datasets: [
					{
						label: 'Holdings',
						data: this.getChartData(sortedHoldings),
						backgroundColor: this.colors,
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
								App.Lib.round(
									data.datasets[tooltipItem.datasetIndex]
										.data[tooltipItem.index]
								) +
								'%'
							);
						}
					}
				}
			}
		});
	},
	getChartLabels: function(sortedHoldings) {
		return sortedHoldings.map(holding => holding.name);
	},
	getChartData: function(sortedHoldings) {
		return sortedHoldings.map(holding => holding.allocation);
	},
	colors: [
		'#4D4D4D',
		'#FAA43A',
		'#5DA5DA',
		'#F17CB0',
		'#60BD68',
		'#B2912F',
		'#B276B2',
		'#DECF3F',
		'#F15854',
		'#072A49',
		'#108A9F',
		'#431833'
	]
};