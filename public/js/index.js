//DOM

const $maxTemp = document.querySelector('.max');
const $minTemp = document.querySelector('.min');

const getCurrentLocation = async (pos) => {
  const lat = await pos.coords.latitude;
  const lon = await pos.coords.longitude;
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&appid=32875f331c7600fa76b17fac410e3b0a`
  );
  const weekly = data.daily;
  const todayTemp = weekly.shift().temp;
  console.log(todayTemp);
  $maxTemp.textContent = todayTemp.max;
  $minTemp.textContent = todayTemp.min;
};

navigator.geolocation.getCurrentPosition(getCurrentLocation);

// let ctx = document.getElementById('myChart').getContext('2d');
// let myChart = new Chart(ctx, {
//   type: 'line',
//   data: {
//     labels: ['Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         label: '평균온도',
//         data: [12, 19, 3, 5, 2, 3, 7],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(255, 206, 86, 0.2)',
//           'rgba(75, 192, 192, 0.2)',
//           'rgba(153, 102, 255, 0.2)',
//           'rgba(255, 159, 64, 0.2)',
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)',
//         ],
//         borderWidth: 3,
//       },
//     ],
//   },
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// });
