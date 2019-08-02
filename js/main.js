const capitalizeWords = str => str.split(' ')
								.map((word) => word.charAt(0).toUpperCase() + word.substring(1))
								.join(' ');

function timeMessage() {
	// A possible welcome message that says "Good morning/afternoon/night" depending on time. Used in generateWelcome().
	let currTime = new Date().getHours();

	if (currTime > 0 && currTime < 5) {
		return "Good Night";
	} else if (currTime >= 5 && currTime < 12) {
		return "Good Morning";
	} else if (currTime >= 12 && currTime < 17) {
		return "Good Afternoon";
	} else if (currTime >= 17 && currTime < 20) {
		return "Good Evening";
	} else {
		return "Good Night";
	}

	return currTime;
}

function generateWelcome() {
	// Generates dynamic welcome messages
	let welcomeElement = document.getElementById('welcome-text');
	let possibleWelcomes = ["Welcome", "Hello There", timeMessage()];

	let chosenWelcome = possibleWelcomes[Math.floor(Math.random() * possibleWelcomes.length)];

	welcomeElement.innerHTML = chosenWelcome;
}

async function getLocation() {
	// Get the users location for displaying and getting weather
	const locationAPI = 'https://www.geoip-db.com/json/';

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

	let weatherAPI = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},${country}&units=imperial&appid=e5b292ae2f9dae5f29e11499c2d82ece`;

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
	setTimeout(setWeather, 600000, city, zip, country);
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
	generateWelcome();
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
