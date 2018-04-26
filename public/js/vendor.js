'use strict';
const COLORS = [
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

const PieChart = {
	render: function(holdings) {
		const sortedHoldings = holdings.sort((a, b) => {
			return b.allocation - a.allocation;
		});
		const ctx = document.getElementById('allocation-chart');
		const chart = new Chart(ctx, {
			type: 'pie',
			data: {
				labels: _getChartLabels(sortedHoldings),
				datasets: [
					{
						label: 'Holdings',
						data: _getChartData(sortedHoldings),
						backgroundColor: COLORS,
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
								Lib.round(
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
	}
};

function _getChartLabels(sortedHoldings) {
	return sortedHoldings.map(holding => holding.name);
}

function _getChartData(sortedHoldings) {
	return sortedHoldings.map(holding => holding.allocation);
}
