/* eslint-disable no-undef */
$(document).ready(function() {
    let unit = '';
    let timezone = '';
    let location = '';
    const form = document.querySelector('#weather-form');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // trim search text
        const address_text = document.querySelector('#address-text');
        address_text.value = address_text.value.trim();

        search();
    }, false);

    const setHandlebarsHelpers = () => {
        
        Handlebars.registerHelper("format-date-short", function(options) {
            return moment.tz(options.fn(this), timezone).format('ddd, MMM D');
        });

        Handlebars.registerHelper("format-date-long", function(options) {
            return moment.tz(options.fn(this), timezone).format('ddd, MMM D, h:mm a');
        });

        Handlebars.registerHelper("get-forecast-image", function(options) {
            const weather_classification = getWeatherClassification(parseInt(options.fn(this)));

            return `../img/icons/${weather_classification}.png`;
        });

        Handlebars.registerHelper("get-location", function() {
            return location;
        });
    };

    const toggleTempUnit = (unitSelected) => {
        localStorage.setItem('unit', unitSelected);
        unit = unitSelected;

        const elementToDeselect = document.querySelector('button[disabled][class~="todays-temp-unit-button"]'); // current unit selected
        const elementToSelect = document.querySelector('button:not([disabled])[class~="todays-temp-unit-button"]');
        elementToSelect.setAttribute('disabled', 'disabled');
        elementToDeselect.removeAttribute('disabled');

        convertTemp();
        convertWindSpeed();
        setTempUnitSymbols();
        setSpeedUnit();
    };

    const convertTemp = () => {
        document.querySelectorAll(".temp").forEach((temp) => {
            const convertedTemp = (unit === 'celsius') ? (parseFloat(temp.innerHTML) - 32) * 5 / 9 : parseFloat(temp.innerHTML) * 9 / 5 + 32;
            temp.innerHTML =  Math.round(convertedTemp);
        });
    };

    const setTempUnitSymbols = () => {
        const unit_symbol = (unit === 'celsius') ? ' °C' : ' °F';
        document.querySelectorAll('sup:not([class~="noconversion"])').forEach((symbol) => {
            symbol.innerHTML = unit_symbol;
        });
    };

    const setSpeedUnit = () => {
        const speed_unit = (unit === 'celsius') ? ' m/s' : ' mph';
        document.querySelector('#wind-speed-unit').innerHTML = speed_unit;

    };

    const convertWindSpeed = () => {
        const wind_speed = document.querySelector('#wind-speed');
        const convertedSpeed = (unit === 'celsius') ? parseFloat(wind_speed.innerHTML) * 0.44704 : parseFloat(wind_speed.innerHTML) / 0.44704;
        wind_speed.innerHTML = Math.round(parseFloat(convertedSpeed));
    };

    const clearResults = () => {
        document.querySelectorAll(".result").forEach((div) => {
            div.innerHTML = '';
        });

        if (document.querySelector(".todays-col") !== null) document.querySelector(".todays-col").remove();

        document.querySelectorAll(".daily-col").forEach((div) => {
            div.remove();
        });
    };

    const getWeatherClassification = (code) => {
        let classification = '';

        if ( (code >= 200) && (code <= 233) ) {
            classification = 'thunderstorm';
        } else if ( (code >= 300) && (code <= 302) ) {
            classification = 'lightrain';
        } else if ( (code >= 500) && (code <= 522) ) {
            classification = 'rain';
        } else if ( (code >= 600) && (code <= 602) ) {
            classification = 'snow';
        } else if ( (code >= 610) && (code <= 612) ) {
            classification = 'sleet';
        } else if ( (code >= 621) && (code <= 623) ) {
            classification = 'snowshower';
        } else if ( (code >= 700) && (code <= 751) ) {
            classification = 'fog';
        } else if (code === 800) {
            classification = 'clear';
        }  else if ( (code === 801) || (code === 802) ) {
            classification = 'cloudy';
        } else if ( (code === 803) || (code === 804) ) {
            classification = 'overcast';
        }

        return classification;
    };

    const setBackground = (code, isDay) => {
        const background = getWeatherClassification(code);
        const postfix = (isDay) ? '-1' : '-2';

        document.querySelector('#main').style.backgroundImage = `url(../img/backgrounds/${background}${postfix}.jpg)`;
    };

    const buildDailyForecasts = (forecast) => {
        const daily_cards = document.querySelector('#daily_cards');

        const daily_card_template = document.querySelector('#daily-card-template').innerHTML;
        const compiled_daily_card_template = Handlebars.compile(daily_card_template);
        const html = compiled_daily_card_template(forecast);
    
        daily_cards.insertAdjacentHTML('afterbegin', html);
    };

    const buildTodaysForecast = (forecast) => {
        const todays_card = document.querySelector('#todays-card');

        const todays_card_template = document.querySelector('#todays-card-template').innerHTML;
        const compiled_todays_card_template = Handlebars.compile(todays_card_template);
        const html = compiled_todays_card_template(forecast.data[0]);
    
        todays_card.insertAdjacentHTML('afterbegin', html);

        const celsius_button = document.querySelector('#celsius-button');
        celsius_button.addEventListener('click', () => toggleTempUnit('celsius'));

        const fahrenheight_button = document.querySelector('#fahrenheight-button');
        fahrenheight_button.addEventListener('click', () => toggleTempUnit('fahrenheight'));

        const selected_unit = (unit === 'celsius') ? celsius_button : fahrenheight_button;
        selected_unit.setAttribute('disabled', 'disabled');
    };

    const toggleSearchButton = (state) => {
        const search_button = document.querySelector('#search-button');

        if (state == 'on') {
            search_button.innerHTML = 'Search';
            search_button.classList.remove('disabled');
            search_button.removeAttribute('disabled');
        } else {
            search_button.innerHTML = 'Loading...';
            search_button.classList.add('disabled');
            search_button.setAttribute('disabled', 'disabled');
        }
    };

    const search = async () => {
        clearResults();

        if (form.checkValidity() === false) {
            document.querySelector('#address-text').classList.add('is-invalid');
            document.querySelector('#address-feedback').innerHTML = 'Please enter a valid address.';
        } else {
            toggleSearchButton('off');

            const address = document.querySelector('#address-text').value;
            const unitAbbrev = (unit === 'celsius') ? 'm' : 'i';
            const weather = await fetch(`/weather?address=${address}&units=${unitAbbrev}`);
            const {error, forecast} = await weather.json();
            
            toggleSearchButton('on');

            if (error) {
                document.querySelector('#address-text').classList.add('is-invalid');
                document.querySelector('#address-feedback').innerHTML = error;
            } else {
                document.querySelector('#address-feedback').innerHTML = '';
                timezome = forecast.timezone;
                location = forecast.location;

                setHandlebarsHelpers();
                setBackground(forecast.data[0].weather_code, forecast.isDay);
                buildTodaysForecast(forecast);
                buildDailyForecasts(forecast);
                setTempUnitSymbols();
                setSpeedUnit();
            }
        }
    };

    const getLocation = async() => {
        try {
            const response = await fetch(`/location`);
            const { city } = await response.json();

            return city;
        } catch (error) {
            console.log(error);
        }
    };

    const init = async() => {
        if (localStorage.getItem("unit") !== null) {
            unit = localStorage.getItem("unit");
        } else {
            localStorage.setItem('unit', 'celsius');
            unit = 'celsius';
        }

        const address_text = document.querySelector('#address-text');
        if (address_text.value === '') {
            const location = await getLocation();
            address_text.value = location;
            search();
        }
    };

    init();
});