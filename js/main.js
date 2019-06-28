// Put divs and stuff here for global use (bad, but who cares)
let capitalizeWords = str => str.split(' ')
								.map((word) => word.charAt(0).toUpperCase() + word.substring(1))
								.join(' ');

async function getLocation() {
	// Get the users location for displaying and getting weather
	let locationAPI = 'https://www.geoip-db.com/json/';

	let response = await fetch(locationAPI);
	let json = await response.json();

	return [json['city'], json['postal'], json['country_code']];
}

function getWeatherIcon(weatherID) {
	return weatherIcons[weatherID].icon;
}

async function setWeather(city, zip, country) {
	let tempAndLocation = document.getElementById("temp-location");
	let weatherIcon = document.getElementById("weather-icon");
	let weather = document.getElementById("weather");

	let weatherAPI = `http://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&units=imperial&appid=e5b292ae2f9dae5f29e11499c2d82ece`;

	let response = await(fetch(weatherAPI));
	let json = await(response.json());
	let temp = Math.round(json.main.temp);
	let weatherID = json.weather[0].id;
	let weatherDescription = capitalizeWords(json.weather[0].description);

	let icon = getWeatherIcon(weatherID);
	let iconClass = `wi wi-${icon}`;

	tempAndLocation.innerHTML = `It's ${temp}°F in ${city}`;
	weatherIcon.className += iconClass;
	weather.innerHTML = `${weatherDescription}`;

	// Update every 10 minutes
	setTimeout(setWeather, 600000, city, country);
}

function formatTime(time) {
	// If element < 10: prints "0x:" instead of just "x:"
	return time < 10 ? `0${time}` : `${time}`;
}

function getDayOfWeek(date) {
	let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

	return days[date.getDay()];
}

function setDateTime() {
	let date = new Date();
	let sec = formatTime(date.getSeconds());
	let min = formatTime(date.getMinutes());
	let hour = formatTime(date.getHours());
	let dayOfWeek = getDayOfWeek(date);
	let dateTimeElement = document.getElementById("datetime");

	dateTimeElement.innerHTML = `${dayOfWeek}, ${date.toLocaleDateString()} - ${hour}:${min}:${sec}`;

	setTimeout(setDateTime, 1000);
}

async function main() {
	setDateTime();

	try {
		let [city, zip, country] = await getLocation();
		await setWeather(city, zip, country);
	} catch (e) {
		// Error with weather section.. just empty it.
		console.log(e);
		document.getElementById("weather-text").innerHTML = "";
	}
}

main();
