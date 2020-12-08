const fetch = require('node-fetch');

const moment = require('moment');
const momentTz = require('moment-timezone');
const isDay = require('./partofday');

const forecast = async (latitude, longitude, location, unit) => {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&days=6&units=${unit}&key=${process.env.WEATHERBIT_API_KEY}`;

    try {
        const response = await fetch(url);
        const forecast = await response.json();

        if (forecast.error) throw new Error('No result');

        const timezone = forecast.timezone;
        const sunrise = forecast.data[0].sunrise_ts;
        const sunset = forecast.data[0].sunset_ts;

        // add more properties to forecast object
        forecast.isDay = isDay(timezone, sunrise, sunset);
        forecast.location = location;
        let new_data = [];

        // loop through each forecast (represented on a per day basis)
        forecast.data.forEach((day_forecast) => {
            // filter only needed info
            let day = {
                date: day_forecast.valid_date,
                temp: Math.round(parseFloat(day_forecast.temp)),
                temp_high: Math.round(parseFloat(day_forecast.max_temp)),
                temp_low: Math.round(parseFloat(day_forecast.min_temp)),
                weather_code: day_forecast.weather.code,
                weather_description: day_forecast.weather.description,
                feels_like: Math.round(parseFloat(day_forecast.app_max_temp)),
                chance_of_rain: `${day_forecast.pop}%`,
                humidity: `${day_forecast.rh}%`,
                sunset: momentTz.tz(moment(sunset) * 1000, timezone).format('h:mm a'),
                sunrise: momentTz.tz(moment(sunrise) * 1000, timezone).format('h:mm a'),
                wind_speed: Math.round(parseFloat(day_forecast.wind_spd)),
                wind_direction: day_forecast.wind_cdir_full,
            };

            // keep collected info in an array
            new_data.push(day);
        });
        // update data property with the filtered day information
        forecast.data = new_data;

        return Promise.resolve(forecast);
    } catch (error) {
        console.log(error);
        let message = error.message.includes('No result')
            ? 'Unable to find location. Try another address.'
            : 'Unable to connect to weather service.';
        return Promise.reject(message);
    }
};

module.exports = forecast;
