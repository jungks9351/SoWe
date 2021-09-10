//DOM

// current
const $weatherStatus = document.querySelector('#weatherStatus');
const $timezone = document.querySelector('#timezone');
const $currentDate = document.querySelector('#currentDate');
const $currentWeather = document.querySelector('#currentWeather');
const $currentTemp = document.querySelector('#currentTemp');
const $maxTemp = document.querySelector('#maxTemp');
const $minTemp = document.querySelector('#minTemp');

// daily
const $dailyList = document.querySelector('#dailyList');

//search

const $searchForm = document.querySelector('#searchForm');
const $searchCity = document.querySelector('#searchCity');

// unix week

const week = ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'];

// 현재 위치 정보 참조 함수

const getCurrentLocation = (pos) => {
  const lat = pos.coords.latitude;
  const lon = pos.coords.longitude;

  getWeather(lat, lon);
};

navigator.geolocation.getCurrentPosition(getCurrentLocation);

$searchForm.onsubmit = (e) => {
  e.preventDefault();
  const city = $searchCity.value;

  searchCity(city);
};
const searchCity = async (city) => {
  const res = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
  );
  const { lat, lon } = res.data.coord;
  toggleLoadingStatus();
  getWeather(lat, lon);
};

// refactoring

// 날씨 정보 API GET 요청 함수 정의

const getWeather = async (lat, lon) => {
  let $canvas = document.getElementById('hourlyTempChart');
  const $weatherIcon = document.querySelector('#weatherIcon');

  deleteWeatherInfo($canvas, $weatherIcon);

  const { data } = await axios.get(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&units=metric&exclude=minutely, alerts&appid=${API_KEY}`
  );
  // current
  createCurrentInfo(data);
  //hourly
  createHourlyInfo(data);
  //daily
  createDailyInfo(data);

  toggleLoadingStatus();
};

const deleteWeatherInfo = (canvas, weatherIcon) => {
  $dailyList.innerHTML = '';
  $weatherStatus.removeChild(canvas);
  $weatherStatus.removeChild(weatherIcon);
  $timezone.textContent = '';
  $currentDate.textContent = '';
  $currentWeather.textContent = '';
  $currentTemp.textContent = '';
  $maxTemp.textContent = '';
  $minTemp.textContent = '';
};

// 날씨 정보 HTMl 작성

// current HTML 작성 함수 정의

const createCurrentInfo = (data) => {
  const current = data.current;
  const [{ main: weather }] = current.weather;
  const weekly = data.daily;
  const todayTemp = weekly.shift().temp;
  const [{ icon: currentIcon }] = current.weather;

  const currentUnixTime = current.dt;
  const currentDate = convertUnixTime(currentUnixTime);
  let currentDay = week[currentDate.getDay()];

  let date = `${currentDate.getFullYear()}. ${
    currentDate.getMonth() + 1
  }. ${currentDate.getDate()}. ${currentDay}`;

  $weatherStatus.insertAdjacentHTML(
    'afterbegin',
    `<img id="weatherIcon" src="https://openweathermap.org/img/wn/${currentIcon}@4x.png" />`
  );
  $timezone.textContent = data.timezone;
  $currentDate.textContent = date;
  $currentWeather.textContent = weather;
  $currentTemp.textContent = `${parseInt(current.temp)}°`;
  $maxTemp.textContent = `Max ${parseInt(todayTemp.max)}°`;
  $minTemp.textContent = `Min ${parseInt(todayTemp.min)}°`;
};

// hourly HTML 작성

const createHourlyInfo = (data) => {
  const hourlyList = data.hourly.slice(0, 24);

  const labels = [];
  const temps = [];

  hourlyList.forEach((hourly, index) => {
    const hourlyUnixTime = hourly.dt;
    const hourlyDate = convertUnixTime(hourlyUnixTime);
    const hourlyTime = hourlyDate.getHours();
    const hourlyTemp = hourly.temp;

    if (index % 2) {
      labels.push(hourlyTime);
      temps.push(parseInt(hourlyTemp));
    }
  });

  $weatherStatus.insertAdjacentHTML(
    'beforeend',
    '<canvas id="hourlyTempChart" class="hourly_temp_chart"></canvas>'
  );

  $canvas = document.getElementById('hourlyTempChart').getContext('2d');
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
          borderColor: ['rgba(0, 110, 235, 1)'],
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
};

// daily HTML 작성 함수 정의

const createDailyInfo = (data) => {
  const daily = data.daily;

  daily.forEach((day) => {
    const dailyUnixTime = day.dt;
    const dailyDate = convertUnixTime(dailyUnixTime);
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
// unix 시간 변환 함수 정의

const convertUnixTime = (unixTime) => {
  const dateTime = new Date(unixTime * 1000);
  return dateTime;
};

const toggleLoadingStatus = () => {
  const $loadingImg = document.querySelector('.loading_img');
  $loadingImg.classList.toggle('a11y-hidden');
};
