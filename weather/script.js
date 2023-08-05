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
	//let data = {"latitude":43.117786,"longitude":-87.9122,"generationtime_ms":2.5500059127807617,"utc_offset_seconds":-21600,"timezone":"America/Chicago","timezone_abbreviation":"CST","elevation":199,"hourly_units":{"time":"unixtime","temperature_2m":"°F","precipitation":"inch","weathercode":"wmo code"},"hourly":{"time":[1676008800,1676012400,1676016000,1676019600,1676023200,1676026800,1676030400,1676034000,1676037600,1676041200,1676044800,1676048400,1676052000,1676055600,1676059200,1676062800,1676066400,1676070000,1676073600,1676077200,1676080800,1676084400,1676088000,1676091600,1676095200,1676098800,1676102400,1676106000,1676109600,1676113200,1676116800,1676120400,1676124000,1676127600,1676131200,1676134800,1676138400,1676142000,1676145600,1676149200,1676152800,1676156400,1676160000,1676163600,1676167200,1676170800,1676174400,1676178000,1676181600,1676185200,1676188800,1676192400,1676196000,1676199600,1676203200,1676206800,1676210400,1676214000,1676217600,1676221200,1676224800,1676228400,1676232000,1676235600,1676239200,1676242800,1676246400,1676250000,1676253600,1676257200,1676260800,1676264400,1676268000,1676271600,1676275200,1676278800,1676282400,1676286000,1676289600,1676293200,1676296800,1676300400,1676304000,1676307600,1676311200,1676314800,1676318400,1676322000,1676325600,1676329200,1676332800,1676336400,1676340000,1676343600,1676347200,1676350800,1676354400,1676358000,1676361600,1676365200,1676368800,1676372400,1676376000,1676379600,1676383200,1676386800,1676390400,1676394000,1676397600,1676401200,1676404800,1676408400,1676412000,1676415600,1676419200,1676422800,1676426400,1676430000,1676433600,1676437200,1676440800,1676444400,1676448000,1676451600,1676455200,1676458800,1676462400,1676466000,1676469600,1676473200,1676476800,1676480400,1676484000,1676487600,1676491200,1676494800,1676498400,1676502000,1676505600,1676509200,1676512800,1676516400,1676520000,1676523600,1676527200,1676530800,1676534400,1676538000,1676541600,1676545200,1676548800,1676552400,1676556000,1676559600,1676563200,1676566800,1676570400,1676574000,1676577600,1676581200,1676584800,1676588400,1676592000,1676595600,1676599200,1676602800,1676606400,1676610000],"temperature_2m":[35.7,34.6,33.3,33.3,32.4,31.7,31.3,29.2,28.1,27.2,26.9,27.6,29.4,29.6,30.6,30,29.9,29.7,29.6,29.6,29.6,29.5,28.2,26.4,26,25.4,24.6,23.6,23.1,23.2,23.4,23.8,27,30.6,34.4,38.1,37.8,39.1,40.4,40.5,38.6,35.6,33.3,32.3,32.4,32.5,32.5,32.5,32.2,31.6,31.4,31.1,31,30.6,29.8,29.1,31.1,34.2,37.8,40.5,42.2,37.4,37.9,37.5,36.2,34.4,33.5,33.1,33.4,33.4,33.6,33.4,33.4,33.4,32.9,33,32.9,32.8,32.2,31.4,32.3,33.8,35.4,36.5,37.4,38,38.7,39,38.3,36.7,35.4,34.5,33.8,33.2,33,33,33,33.2,33.1,33,33,33.4,33.6,33.8,34.6,35.8,36.9,37.4,37.8,37.9,38.1,39.3,39.1,38.7,38.5,38.7,39.3,39.8,40.5,41.7,42.3,41.8,42.5,43.3,43.5,43.8,42.4,42.1,42.6,42.7,43.1,44.1,43.7,43.5,43.1,42.4,41.6,40.7,39.3,38.3,37.3,36.1,35.5,35,34.6,34.3,34.2,34.2,34.4,34.7,35.1,35,34.9,35.4,37.1,39.3,41.3,40.8,39.2,37.4,37.4,37.6,37.9,38,37.9,36.6,33.8,30.2],"precipitation":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.004,0.02,0.055,0.031,0.075,0.051,0.008,0.004,0.004,0.012,0.024,0.004,0.004,0.004,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0.047,0.047,0.047,0.094,0.094,0.094,0.028,0.028,0.028,0.008,0.008,0.008,0.004,0.004,0.004,0,0],"weathercode":[3,3,3,3,3,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,2,1,0,0,0,0,1,1,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3]},"daily_units":{"time":"unixtime","weathercode":"wmo code","temperature_2m_max":"°F","temperature_2m_min":"°F"},"daily":{"time":[1676008800,1676095200,1676181600,1676268000,1676354400,1676440800,1676527200],"weathercode":[3,0,3,3,3,3,3],"temperature_2m_max":[35.7,40.5,42.2,39,41.7,44.1,41.3],"temperature_2m_min":[26.4,23.1,29.1,31.4,33,35,30.2]}};
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