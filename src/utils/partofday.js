const moment = require('moment-timezone');

const isDay = (timezone, sunrise, sunset) => {
    const currentDate = moment().tz(timezone);
    const sunriseTime = moment.tz(new Date(sunrise * 1000), timezone);
    const sunsetTime = moment.tz(new Date(sunset * 1000), timezone);

    const isDay = (currentDate.isSameOrAfter(sunriseTime, 'hour minute second')  && currentDate.isSameOrBefore(sunsetTime, 'hour minute second'));
    
    return isDay;
};

module.exports = isDay;
