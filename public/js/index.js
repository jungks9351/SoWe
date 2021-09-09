//DOM

// current
const $weatherStatus = document.querySelector('#weatherStatus');
const $timezone = document.querySelector('#timezone');
const $currentDate = document.querySelector('#currentDate');
const $currentWeather = document.querySelector('#currentWeather');
const $currentTemp = document.querySelector('#currentTemp');
const $maxTemp = document.querySelector('#maxTemp');
const $minTemp = document.querySelector('#minTemp');

//hourly chart
const $canvas = document.getElementById('hourlyTempChart').getContext('2d');

// daily
const $dailyList = document.querySelector('#dailyList');

//search

const $searchForm = document.querySelector('#searchForm');
const $searchCity = document.querySelector('#searchCity');

// 현재 위치 함수 정의
// 날씨 상태

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
  const [{ icon: currentIcon }] = current.weather;

  // 유닉스 시간 변한 함수 정의
  //current yeay, month , day 변환

  const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];
  const currentDate = new Date(currentTime * 1000);
  let currentDay = week[currentDate.getDay()];

  let date = `${currentDate.getFullYear()}. ${
    currentDate.getMonth() + 1
  }. ${currentDate.getDate()}. ${currentDay}`;

  // current html 작성

  $weatherStatus.insertAdjacentHTML(
    'afterbegin',
    `<img src="https://openweathermap.org/img/wn/${currentIcon}@4x.png" />`
  );
  $timezone.textContent = data.timezone;
  $currentDate.textContent = date;
  $currentWeather.textContent = weather;
  $currentTemp.textContent = `${parseInt(current.temp)}°`;
  $maxTemp.textContent = `Max ${parseInt(todayTemp.max)}°`;
  $minTemp.textContent = `Min ${parseInt(todayTemp.min)}°`;

  //hourly

  const hourlyList = data.hourly.slice(0, 24);

  const labels = [];
  const temps = [];

  hourlyList.forEach((hourly, index) => {
    //unix 시간 변환 함수
    const hourlyDate = new Date(hourly.dt * 1000);

    const hourlyTime = hourlyDate.getHours();
    const hourlyTemp = hourly.temp;

    if (index % 2) {
      labels.push(hourlyTime);
      temps.push(parseInt(hourlyTemp));
    }
  });

  let myChart = new Chart($canvas, {
    type: 'line',
    data: {
      labels,
      datasets: [
        {
          label: 'hourly temp',
          data: temps,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
          ],
          borderColor: [
            // 'rgba(255, 99, 132, 1)',
            'rgba(0, 110, 235, 1)',
            // 'rgba(255, 206, 86, 1)',
            // 'rgba(75, 192, 192, 1)',
            // 'rgba(153, 102, 255, 1)',
            // 'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 3,
          tickColor: '#fff',
          tension: 0.2,
        },
      ],
    },
    options: {
      scales: {
        y: {
          suggestedMin: Math.min(...temps),
          suggestedMax: Math.max(...temps),
          ticks: {
            color: '#fff',
          },
        },
        x: {
          ticks: {
            color: '#fff',
          },
        },
      },
      color: '#fff',
      responsive: false,
    },
  });

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
    //daily html 작성

    let dailyItem = `<li id="dailyItem" class="daily"><p>${dailyDay}</p><img src="https://openweathermap.org/img/wn/${dailyIcon}@2x.png" /><p>${parseInt(
      dailyMaxTemp
    )}° / ${parseInt(dailyMinTemp)}°</p></li>`;
    $dailyList.innerHTML += dailyItem;
  });
};
navigator.geolocation.getCurrentPosition(getCurrentLocation);

$searchForm.onsubmit = (e) => {
  e.preventDefault();
  const city = $searchCity.value;

  searchCity(city);
};
const searchCity = async (city) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=32875f331c7600fa76b17fac410e3b0a`
  );
  const cityData = res.data.coord;
  console.log(cityData);
  localStorage.setItem('cityData', JSON.stringify(cityData));

  location.href = 'http://localhost:5000/location.html';
};
