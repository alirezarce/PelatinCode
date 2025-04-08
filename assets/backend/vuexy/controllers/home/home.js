$(window).on('load', function() {
});
// Chart.js setup
const ctx = document.getElementById('myChart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar', // Change to 'line', 'pie', etc. for different chart types
    data: {
        labels: ['کاربران', 'کاربران فعال', '   تعداد دورهای فروش رفته '],
        datasets: [{
            label: 'Sales',
            data: [countUsers,countActiveUsers, allOrder],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});


const ctx2 = document.getElementById('myChart2').getContext('2d');
const myChart2 = new Chart(ctx2, {
    type: 'pie', // Change to 'line', 'pie', etc. for different chart types
    data: {
        labels: [ 'کاربران ','کاربران فعال', 'کاربران خانم', 'کاربران آقا',],
        datasets: [{
            label: 'Sales',
            data: [ countUsers,countActiveUsers, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});

const ctx3 = document.getElementById('myChart3').getContext('2d');
const myChart3 = new Chart(ctx3, {
    type: 'line',
    data: {
      labels: ["فروش کل", "monday", "tuesday",
      "wednesday", "thursday", "friday", "saturday"],
      datasets: [{
        label: 'Last week',
        backgroundColor: 'rgba(161, 198, 247, 1)',
        borderColor: 'rgb(47, 128, 237)',
        data: [totalPirce, 4000, 2000, 5000, 8000, 9000, 2000],
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
          }
        }]
      }
    }
});