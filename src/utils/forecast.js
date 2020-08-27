const request = require('request-promise');
const moment = require('moment');
const momentTz = require('moment-timezone');
const isDay = require('./partofday');

const forecast = async (latitude, longitude, location, unit) => {
    const url = `https://api.weatherbit.io/v2.0/forecast/daily?lat=${latitude}&lon=${longitude}&days=6&units=${unit}&key=${process.env.WEATHERBIT_API_KEY}`;

    return request({
        url,
        json: true,
        resolveWithFullResponse: true
    })
        .then(response => {
            if (response.body.error) throw new Error('No result');

            let forecast = response.body;
            const timezone = forecast.timezone;
            const sunrise = forecast.data[0].sunrise_ts;
            const sunset = forecast.data[0].sunset_ts;

            forecast.isDay = isDay(timezone, sunrise, sunset);
            forecast.location = location;
            let new_data = [];

            forecast.data.forEach(forecast => {
                let day = {
                    date: forecast.valid_date,
                    temp: Math.round(parseFloat(forecast.temp)),
                    temp_high: Math.round(parseFloat(forecast.max_temp)),
                    temp_low: Math.round(parseFloat(forecast.min_temp)),
                    weather_code: forecast.weather.code,
                    weather_description: forecast.weather.description,
                    feels_like: Math.round(parseFloat(forecast.app_max_temp)),
                    chance_of_rain: `${forecast.pop}%`,
                    humidity: `${forecast.rh}%`,
                    sunset: momentTz.tz(moment(sunset) * 1000, timezone).format('h:mm a'),
                    sunrise: momentTz.tz(moment(sunrise) * 1000, timezone).format('h:mm a'),
                    wind_speed: Math.round(parseFloat(forecast.wind_spd)),
                    wind_direction: forecast.wind_cdir_full
                };

                new_data.push(day);
            });
            forecast.data = new_data;

            return Promise.resolve(
                forecast
            );
        })
        .catch(error => {
            console.log(error);
            let message = (error.message.includes('No result')) ? 'Unable to find location. Try another address.' : 'Unable to connect to weather service.';
            return Promise.reject(message);
        });
};

module.exports = forecast;