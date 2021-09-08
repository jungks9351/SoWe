//DOM
// current
const $timezone = document.querySelector('#timezone');
const $currentDate = document.querySelector('#currentDate');
const $currentWeather = document.querySelector('#currentWeather');
const $currentTemp = document.querySelector('#currentTemp');
const $maxTemp = document.querySelector('#maxTemp');
const $minTemp = document.querySelector('#minTemp');
// daily
const $dailyList = document.querySelector('#dailyList');

// 현재 위치 함수 정의

const getCurrentLocation = async (pos) => {
  const lat = await pos.coords.latitude;
  const lon = await pos.coords.longitude;
  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely, alerts&appid=32875f331c7600fa76b17fac410e3b0a`
  );

  const current = data.current;
  const currentTime = current.dt;
  const [{ main: weather }] = current.weather;
  const weekly = data.daily;
  const todayTemp = weekly.shift().temp;

  // 유닉스 시간 변한 함수 정의
  //current yeay, month , day 변환

  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
  const currentDate = new Date(currentTime * 1000);
  let currentDay = week[currentDate.getDay()];

  let date = `${currentDate.getFullYear()}. ${
    currentDate.getMonth() + 1
  }. ${currentDate.getDate()}. ${currentDay}`;

  // current html 작성
  $timezone.textContent = data.timezone;
  $currentDate.textContent = date;
  $currentWeather.textContent = weather;
  $currentTemp.textContent = `${parseInt(current.temp)}°`;
  $maxTemp.textContent = `Max ${parseInt(todayTemp.max)}°`;
  $minTemp.textContent = `Min ${parseInt(todayTemp.min)}°`;

  //daily

  const daily = data.daily;
  daily.forEach((day) => {
    // unix 시간 변환 함수 정의
    // daily day 변환

    const dailyDate = new Date(day.dt * 1000);
    let dailyDay = week[dailyDate.getDay()];

    // daily icon
    let [{ icon: dailyIcon }] = day.weather;

    // daily Max Min Temp
    let { max: dailyMaxTemp, min: dailyMinTemp } = day.temp;
    console.log(dailyMaxTemp);
    console.log(dailyMinTemp);
    //daily html 작성

    let dailyItem = `<li id="dailyItem" class="daily"><p>${dailyDay}</p><img src="https://openweathermap.org/img/wn/${dailyIcon}@2x.png" /><p>${parseInt(
      dailyMaxTemp
    )}° / ${parseInt(dailyMinTemp)}°</p></li>`;
    $dailyList.innerHTML += dailyItem;
  });
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

// const $li = document.createElement('li');
// const $p = document.createElement('p');
// const $img = document.createElement('img');
// const $div = document.createElement('div');

// $li.id = 'dailyItem';
// $li.classList.add('daily');
// $p.textContent = `${dailyDay}`;
// $li.appendChild($p);

// $img.id = 'dailyIcon';
// $img.setAttribute(
//   'src',
//   `https://openweathermap.org/img/wn/${dailyIcon}@2x.png`
// );
// $li.appendChild($img);

// $div.classList.add('daily_temp');
// $div.textContent = `${dailyMaxTemp} / ${dailyMinTemp}`;
// $li.appendChild($p);

// $dailyList.appendChild($li);
