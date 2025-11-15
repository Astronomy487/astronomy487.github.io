function flag_emoji_from_iso(iso) {
  let code_points = iso
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt());
  return String.fromCodePoint(...code_points);
}

function temperature_adjective(temperature) {
	if (temperature > 82) return "very hot";
	if (temperature > 74) return "hot";
	if (temperature > 63) return "nice";
	if (temperature > 49) return "cool";
	if (temperature > 38) return "chilly";
	if (temperature > 15) return "cold";
	return "very cold";
}

let months = "Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" ");
let weekdays = "Sun Mon Tue Wed Thu Fri Sat".split(" ");
let hournames = "12 AM/1 AM/2 AM/3 AM/4 AM/5 AM/6 AM/7 AM/8 AM/9 AM/10 AM/11 AM/12 PM/1 PM/2 PM/3 PM/4 PM/5 PM/6 PM/7 PM/8 PM/9 PM/10 PM/11 PM".split("/");
for (let i = 0; i < 24; i++) hournames[i] = hournames[i].replaceAll(" ", "&nbsp;");

navigator.geolocation.getCurrentPosition((position) => {
	let latitude = position.coords.latitude;
	let longitude = position.coords.longitude;
	//let city_choice = Math.floor(Math.random()*cities.length); latitude = cities[city_choice].lat; longitude = cities[city_choice].lng;
	let min_distance = 9999999;
	let min_name = "";
	for (c of cities) {
		let dy = c.lat - latitude;
		let dx = c.lng - longitude;
		let dist = dy*dy + dx*dx;
		if (dist < min_distance) {
			min_distance = dist;
			min_name = flag_emoji_from_iso(c.iso2) + " " + c.city + ", " + c.country;
		}
	}
	//make header
	{
		let html = "";
		html += '<h2>' + min_name + '</h2>';
		let current_time = new Date();
		let current_time_text = current_time.getHours() % 12;
		if (current_time_text == 0) current_time_text = 12;
		current_time_text += ":" + (current_time.getMinutes()<10?"0":"") + current_time.getMinutes();
		current_time_text += current_time.getHours() >= 12 ? " PM" : " AM";
		current_time_text = months[current_time.getMonth()] + " " + current_time.getDate() + " " + current_time_text;
		html += '<h3>' + current_time_text + '</h3>';
		document.querySelector("#header").innerHTML = html;
	}
	//do the actual weather
	run(latitude, longitude);
});

let weather_codes = [];
wc(0, "Clear sky", "clear-day");
wc(1, "Mainly clear", "clear-day");
wc(2, "Partly cloudy", "partly-cloudy-day");
wc(3, "Overcast", "overcast-day");
wc(45, "Fog", "fog-day");
wc(48, "Frozen fog", "extreme-day-fog");
wc(51, "Light drizzle", "partly-cloudy-day-drizzle");
wc(53, "Moderate drizzle", "overcast-day-drizzle");
wc(55, "Heavy drizzle", "extreme-day-drizzle");
wc(56, "Light freezing drizzle", "partly-cloudy-day-drizzle");
wc(57, "Heavy freezing drizzle", "extreme-day-drizzle");
wc(61, "Light rain", "partly-cloudy-day-rain");
wc(63, "Moderate rain", "overcast-day-rain");
wc(65, "Heavy rain", "extreme-day-rain");
wc(66, "Light freezing rain", "partly-cloudy-day-rain");
wc(67, "Heavy freezing rain", "extreme-day-rain");
wc(71, "Light snowfall", "partly-cloudy-day-snow");
wc(73, "Moderate snowfall", "overcast-day-snow");
wc(75, "Heavy snowfall", "extreme-day-snow");
wc(77, "Snow grains", "overcast-day-hail");
wc(80, "Light showers", "partly-cloudy-day-rain");
wc(81, "Moderate showers", "overcast-day-rain");
wc(82, "Heavy showers", "extreme-day-rain");
wc(85, "Light snow showers", "partly-cloudy-day-snow");
wc(86, "Heavy snow showers", "extreme-day-snow");
wc(95, "Thunderstorm", "thunderstorms-day");
wc(96, "Hailing thunderstorm", "thunderstorms-day-snow");
wc(99, "Hailing thunderstorm", "thunderstorms-day-snow");
function wc(i, label, img_day = "clear-day") {
	weather_codes[i] = {
		label: label,
		img_day: img_day
	};
}

function imgurl(token) {return 'https://raw.githubusercontent.com/basmilius/weather-icons/dev/production/line/svg/'+token+'.svg'}

async function run(latitude, longitude) {
	let url = 'https://api.open-meteo.com/v1/forecast?latitude='+latitude+'&longitude='+longitude+'&hourly=temperature_2m,precipitation,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=auto';
	let response = await fetch(url);
	let data = await response.json();
	//console.log(data);
	console.log(data);
	//do current conditions
	{
		let html = '';
		html += '<img src="'+imgurl(weather_codes[data.hourly.weathercode[new Date().getHours()]].img_day)+'">';
		html += '<div>';
		html += '<h2>'+weather_codes[data.hourly.weathercode[new Date().getHours()]].label+'</h2>';
		html += '<h3>'+Math.floor(data.hourly.temperature_2m[new Date().getHours()])+'°F</h3>';
		html += '<p>'+make_paragraph(data.hourly.temperature_2m, data.hourly.precipitation)+'</p>';
		html += '</div>';
		document.querySelector("#current").innerHTML = html;
	}
	//do the next 24 hours
	{
		let html = '';
		let since_report = 9999;
		let last_wc = -1;
		for (let i = new Date().getHours(); i < new Date().getHours()+24; i++) {
			let wc = data.hourly.weathercode[i];
			if (since_report < 4 && wc == last_wc) {since_report++; continue;}
			html += '<div>';
			html += '<img src="'+imgurl(weather_codes[data.hourly.weathercode[i]].img_day)+'">';
			html += '<h2>' + weather_codes[data.hourly.weathercode[i]].label + ', '+Math.round(data.hourly.temperature_2m[i])+'°F</h2>';
			html += '<h3>' + hournames[new Date(data.hourly.time[i]*1000).getHours()] + '</h3>';
			html += '</div>';
			last_wc = wc;
			since_report = 0;
		}
		document.querySelector("#today").innerHTML = html;
	}
	//do the week ahead
	{
		let html = '';
		for (let i = 1; i < data.daily.time.length; i++) {
			html += '<div>';
			let time = new Date(data.daily.time[i] * 1000);
			let max_temperature = data.daily.temperature_2m_max[i];
			let min_temperature = data.daily.temperature_2m_min[i];
			let weather_code = data.daily.weathercode[i];
			html += '<h2>'+weekdays[time.getDay()]+'</h2>';
			html += '<img src="'+imgurl(weather_codes[weather_code].img_day)+'">';
			//html += '<h3>'+weather_codes[weather_code].label+'</h3>';
			html += '<p>'+make_paragraph(data.hourly.temperature_2m, data.hourly.precipitation, i, 0)+'</p>'
			html += '</div>';
		}
		document.querySelector("#week").innerHTML = html;
	}
	document.querySelector("article").remove();
	document.body.innerHTML = document.body.innerHTML;
}





function make_paragraph(temperature_2m, precipitation, day_skip = 0, perspective_hour = new Date().getHours()) {
	let paragraph = "";
	temperature_2m = JSON.parse(JSON.stringify(temperature_2m));
	precipitation = JSON.parse(JSON.stringify(precipitation));
	//shift the temperatures and precipitations backwards according to day skip
	for (let i = 0; i < temperature_2m.length - day_skip * 24; i++) {
		temperature_2m[i] = temperature_2m[i + day_skip * 24];
		precipitation[i] = precipitation[i + day_skip * 24];
	}
	let morning_temp = 0; for (let i = 6; i < 15; i++) morning_temp += temperature_2m[i]; morning_temp = morning_temp/9;
	let evening_temp = 0; for (let i = 15; i < 24; i++) evening_temp += temperature_2m[i]; evening_temp = evening_temp/9;
	//TEMPERATURE COMMENTARY
	if (perspective_hour >= 15) { //say evening
		paragraph += "It will be a "+temperature_adjective(evening_temp)+" "+Math.round(evening_temp)+"°F this evening";
	} else { //say both parts
		if (Math.abs(evening_temp - morning_temp) > 10) {
			morning_temp = Math.round(morning_temp);
			evening_temp = Math.round(evening_temp);
			paragraph += "This morning will be " + morning_temp + "°F but " + (evening_temp>morning_temp?"rise":"fall") + " to " + evening_temp + "°F";
			//paragraph += morning_temp + " to " + evening_temp;
		} else {
			paragraph += "It will average a " + temperature_adjective((morning_temp+evening_temp)/2) + " " + Math.round((morning_temp+evening_temp)/2) +"°F";
		}
	}
	if (precipitation[perspective_hour]) { //if raining
		let stop_rain_hour = perspective_hour;
		while (precipitation[stop_rain_hour] && stop_rain_hour < 48) stop_rain_hour++;
		if (stop_rain_hour >= 24) {
			paragraph += ", with rain ";
			if (stop_rain_hour < 48) {
				paragraph += "until "+hournames[stop_rain_hour-24]+(stop_rain_hour >= 30 || !perspective_hour ? " tomorrow.":".");
			} else {
				paragraph += "through tomorrow.";
			}
		} else {
			paragraph += ", with rain until "+hournames[stop_rain_hour]+".";
		}
	} else {
		let start_rain_hour = perspective_hour;
		while (!precipitation[start_rain_hour] && start_rain_hour < 24) start_rain_hour++;
		if (start_rain_hour == 24) {
			paragraph += ".";
		} else {
			//check when it will end
			let end_rain_hour = 24;
			while (!precipitation[end_rain_hour] && end_rain_hour >= start_rain_hour) end_rain_hour--;
			if (end_rain_hour == 24) {
				paragraph += ", with rain at "+hournames[start_rain_hour]+".";
			} else if (end_rain_hour == start_rain_hour) {
				paragraph += ", with a little rain at "+hournames[start_rain_hour]+".";
			} else {
				paragraph += ", with rain from "+hournames[start_rain_hour]+" to "+hournames[end_rain_hour]+".";
			}
		}
	}
	return paragraph;
}