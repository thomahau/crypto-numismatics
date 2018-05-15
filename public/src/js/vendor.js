'use strict';
App.Vendor = {
  renderParticles: function() {
    // configuration for welcome screen particles
    particlesJS('particles-js', {
      particles: {
        number: {
          value: 70,
          density: {
            enable: true,
            value_area: 1000
          }
        },
        color: {
          value: '#33c3f0'
        },
        shape: {
          type: 'circle',
          stroke: {
            width: 2,
            color: '#000000'
          }
        },
        opacity: {
          value: 0.25,
          random: false
        },
        size: {
          value: 5,
          random: true
        },
        line_linked: {
          enable: true,
          distance: 150,
          color: '#ffffff',
          opacity: 0.3,
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
            enable: true,
            rotateX: 600,
            rotateY: 1200
          }
        }
      },
      interactivity: {
        detect_on: 'canvas',
        events: {
          onhover: {
            enable: false
          },
          onclick: {
            enable: true,
            mode: 'push'
          },
          resize: true
        },
        modes: {
          push: {
            particles_nb: 4
          }
        }
      },
      retina_detect: true
    });
  },
  renderPieChart: function(holdings) {
    // configuration for pie chart of portfolio breakdown
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
                App.Lib.round(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]) +
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
