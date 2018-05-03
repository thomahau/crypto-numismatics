'use strict';
App.Vendor = {
	renderParticles: function() {
		particlesJS('particles-js', {
			particles: {
				number: {
					value: 80,
					density: {
						enable: true,
						value_area: 800
					}
				},
				color: {
					value: '#ffffff'
				},
				shape: {
					type: 'circle',
					stroke: {
						width: 0,
						color: '#000000'
					},
					polygon: {
						nb_sides: 5
					},
					image: {
						src: 'img/github.svg',
						width: 100,
						height: 100
					}
				},
				opacity: {
					value: 0.5,
					random: false,
					anim: {
						enable: false,
						speed: 1,
						opacity_min: 0.1,
						sync: false
					}
				},
				size: {
					value: 5,
					random: true,
					anim: {
						enable: false,
						speed: 40,
						size_min: 0.1,
						sync: false
					}
				},
				line_linked: {
					enable: true,
					distance: 150,
					color: '#ffffff',
					opacity: 0.4,
					width: 1
				},
				move: {
					enable: true,
					speed: 6,
					direction: 'none',
					random: false,
					straight: false,
					out_mode: 'out',
					attract: {
						enable: false,
						rotateX: 600,
						rotateY: 1200
					}
				}
			},
			interactivity: {
				detect_on: 'canvas',
				events: {
					onhover: {
						enable: true,
						mode: 'repulse'
					},
					onclick: {
						enable: true,
						mode: 'push'
					},
					resize: true
				},
				modes: {
					grab: {
						distance: 400,
						line_linked: {
							opacity: 1
						}
					},
					bubble: {
						distance: 400,
						size: 40,
						duration: 2,
						opacity: 8,
						speed: 3
					},
					repulse: {
						distance: 200
					},
					push: {
						particles_nb: 4
					},
					remove: {
						particles_nb: 2
					}
				}
			},
			retina_detect: true,
			config_demo: {
				hide_card: false,
				background_color: '#b61924',
				background_image: '',
				background_position: '50% 50%',
				background_repeat: 'no-repeat',
				background_size: 'cover'
			}
		});
	},
	renderPieChart: function(holdings) {
		// Configuration for pie chart of portfolio breakdown
		const sortedHoldings = holdings.sort((a, b) => {
			return b.allocation - a.allocation;
		});
		const ctx = document.getElementsByClassName('allocation-chart')[0];
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
						borderWidth: 0.4
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
		'#5DA5DA',
		'#FAA43A',
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
