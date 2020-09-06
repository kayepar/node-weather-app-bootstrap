/* eslint-disable no-undef */
$(document).ready(function() {
    let unit = '';
    const form = document.querySelector('#weather-form');
    
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // trim search text
        const address_text = document.querySelector('#address-text');
        address_text.value = address_text.value.trim();

        search();
    }, false);

    const toggleTempUnit = (unitSelected) => {
        localStorage.setItem('unit', unitSelected);
        unit = unitSelected;

        const elementToDeselect = document.querySelector('button[disabled][class~="todays-temp-unit-button"]'); // current unit selected
        const elementToSelect = document.querySelector('button:not([disabled])[class~="todays-temp-unit-button"]');
        elementToSelect.disabled = true;
        elementToDeselect.disabled = false;

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

    const createElement = (myElement) => {
        const newElement = document.createElement(myElement.type);

        if (myElement.attributes !== undefined) {
            myElement.attributes.forEach((attribute) => {
                const keys = Object.keys(attribute);
                keys.forEach((key) => {
                    newElement.setAttribute(key, attribute[key]);
                });
            });
        }

        if (myElement.value !== undefined) newElement.innerHTML = myElement.value;
        
        return newElement;
    };

    const buildDailyForecasts = (forecast) => {
        const daily_cards = document.querySelector('#daily_cards');

        forecast.data.forEach((day, index) => {
            if (index < 1) return; // skip current day

            const col_div = createElement({ type: 'div', attributes: [{ class: 'col-lg col-md-4 daily-col' }] });
            const card_div = createElement({ type: 'div', attributes: [{ class: 'card mb-3' }] });
            const card_header_div = createElement({ type: 'div', attributes: [{ class: 'card-header' }] });
            const day_p =  createElement({ type: 'p', value: moment.tz(day.date, forecast.timezone).format('ddd, MMM D') });
            const card_body_div = createElement({ type: 'div', attributes: [{ class: 'card-body pb-1' }] });

            // first row
            const temp_p = document.createElement('p');
            const weather_classification = getWeatherClassification(day.weather_code);
            const temp_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/${weather_classification}.png`, class: 'card-icons' }] });
            const temp_span = createElement({ type: 'span', value: day.temp, attributes: [{ id: `day-${index}-temp`, class: 'temp medium' }] });

            const unit_symbol_sup_b = createElement({ type: 'sup', attributes: [{ class: 'temp-unit-symbol medium' }] });
            const unit_symbol_sup = createElement({ type: 'sup', attributes: [{ class: 'temp-unit-symbol' }] });
            const feels_like_text = createElement({ type: 'span', value: ' feels like '});
            const feels_like_temp_span =  createElement({ type: 'span', value: day.feels_like, attributes: [{ id: `day-${index}-feels_like`, class: 'temp' }] });

            temp_p.appendChild(temp_icon);
            temp_p.appendChild(temp_span);
            temp_p.appendChild(unit_symbol_sup_b);
            temp_p.appendChild(feels_like_text);
            temp_p.appendChild(feels_like_temp_span);
            temp_p.appendChild(unit_symbol_sup);
            // end of first row

            // second row
            const chanceOfRain_p = document.createElement('p');
            const chanceOfRain_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/umbrella.png`, class: 'card-icons' }] });
            const chanceOfRain_span = createElement({ type: 'span', value: `${day.chance_of_rain} precipitation` });
            chanceOfRain_p.appendChild(chanceOfRain_icon);
            chanceOfRain_p.appendChild(chanceOfRain_span);
            // end of second row

            // third row
            const humidity_p = document.createElement('p');
            const humidity_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/humidity.png`, class: 'card-icons' }] });
            const humidity_span = createElement({ type: 'span', value: `${day.humidity} humidity` });
            humidity_p.appendChild(humidity_icon);
            humidity_p.appendChild(humidity_span);
            // end of third row

            card_header_div.appendChild(day_p);
            card_body_div.appendChild(temp_p);
            card_body_div.appendChild(chanceOfRain_p);
            card_body_div.appendChild(humidity_p);

            card_div.appendChild(card_header_div);
            card_div.appendChild(card_body_div);
            col_div.appendChild(card_div);
            daily_cards.appendChild(col_div);
        });
    };

    const buildTodaysForecast = (forecast) => {
        const todays_card = document.querySelector('#todays-card');
        const col_div = createElement({ type: 'div', attributes: [{ class: 'col-lg-6 col-md-6 todays-col' }] });
        const card_div = createElement({ type: 'div', attributes: [{ class: 'card' }] });
        const card_header_div = createElement({ type: 'div', attributes: [{ class: 'card-header py-3' }] });
        const header_row1_div = createElement({ type: 'div', attributes: [{ class: 'row' }] });
        
        // header
        const address_div = createElement({ type: 'div', attributes: [{ class: 'col-9 float-left' }] });
        const address_span = createElement({ type: 'span', value: forecast.location,  attributes: [{ class: 'todays-highlight' }] });
        address_div.appendChild(address_span);

        const temp_div = createElement({ type: 'div', attributes: [{ class: 'col-3 float-right text-right pl-0' }] });
        const temp_span = createElement({ type: 'span', value: forecast.data[0].temp, attributes: [{ class: 'todays-highlight nowrap temp mr-1' }] });
        const celsius_button = createElement( { type: 'button', value: '°C', attributes: [{ class: 'todays-temp-unit-button celsius-button text-right', id: 'celsius-button' }] });
        celsius_button.addEventListener('click', () => toggleTempUnit('celsius'));

        const separator_sup = createElement({ type: 'sup', value: ' | ', attributes: [{ class: 'todays-highlight-unit-separator noconversion' }] });
        const fahrenheight_button = createElement( { type: 'button', value: '°F', attributes: [{ class: 'todays-temp-unit-button fahrenheight-button text-left', id: 'fahrenheight-button' }] });
        fahrenheight_button.addEventListener('click', () => toggleTempUnit('fahrenheight'));

        const selected_unit = (unit === 'celsius') ? celsius_button : fahrenheight_button;
        selected_unit.disabled = true;
        
        temp_div.appendChild(temp_span);
        temp_div.appendChild(celsius_button);
        temp_div.appendChild(separator_sup);
        temp_div.appendChild(fahrenheight_button);

        const header_row2_div = createElement({ type: 'div', attributes: [{ class: 'row' }] });
        const date_div = createElement({ type: 'div', attributes: [{ class: 'col-7 float-left second-row' }] });
        const date_span = createElement({ type: 'span', value: moment().tz(forecast.timezone).format('ddd, MMM D, h:mm a')});
        date_div.appendChild(date_span);

        const feels_like_div = createElement({ type: 'div', attributes: [{ class: 'col-5 float-right text-right pl-0 second-row' }] });
        const feels_like_text_span = createElement({ type: 'span', value:`Feels like ` });
        const feels_like_temp_span = createElement({ type: 'span', value: forecast.data[0].feels_like, attributes: [{ class: 'temp' }] });
        const feels_like_sup = createElement({ type: 'sup', attributes: [{ class: 'todays-temp-unit-symbol' }] });
        feels_like_div.appendChild(feels_like_text_span);
        feels_like_div.appendChild(feels_like_temp_span);
        feels_like_div.appendChild(feels_like_sup);
        // end of header
       
        const card_body_div = createElement({ type: 'div', attributes: [{ class: 'card-body' }] });
        const card_body_row_div = createElement({ type: 'div', attributes: [{ class: 'row justify-content-sm-center' }] });
        
        // first column
        const card_body_col1_div = createElement({ type: 'div', attributes: [{ class: 'col-lg-6' }] });
        const col1_card_div = createElement({ type: 'div', attributes: [{ class: 'card border-0' }] });
        const col1_card_body_div = createElement({ type: 'div', attributes: [{ class: 'card-body pt-0 pl-0 right-border' }] });

        const description_p = createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const description_span = createElement({ type: 'span', value: forecast.data[0].weather_description });
        const weather_classification = getWeatherClassification(forecast.data[0].weather_code);
        const description_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/${weather_classification}.png`, class: 'card-icons' }] });
        description_p.appendChild(description_icon);
        description_p.appendChild(description_span);

        const chanceOfRain_p = createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const chanceOfRain_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/umbrella.png`, class: 'card-icons' }] });
        const chanceOfRain_span = createElement({ type: 'span', value: `${forecast.data[0].chance_of_rain} precipitation` });
        chanceOfRain_p.appendChild(chanceOfRain_icon);
        chanceOfRain_p.appendChild(chanceOfRain_span);

        const humidity_p =  createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const humidity_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/humidity.png`, class: 'card-icons' }] });
        const humidity_span = createElement({ type: 'span', value: `${forecast.data[0].humidity} humidity` });
        humidity_p.appendChild(humidity_icon);
        humidity_p.appendChild(humidity_span);

        const wind_speed_p =  createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const wind_speed_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/wind.png`, class: 'card-icons' }] });
        const wind_speed_span = createElement({ type: 'span', value: `${forecast.data[0].wind_speed}`, attributes: [{ id: 'wind-speed' }] });
        const wind_speed_unit_span = createElement({ type: 'span', attributes: [{ id: 'wind-speed-unit' }] });
        const wind_direction_span = createElement({ type: 'span', value: `, ${forecast.data[0].wind_direction}` });
        wind_speed_p.appendChild(wind_speed_icon);
        wind_speed_p.appendChild(wind_speed_span);
        wind_speed_p.appendChild(wind_speed_unit_span);
        wind_speed_p.appendChild(wind_direction_span);

        col1_card_body_div.appendChild(description_p);
        col1_card_body_div.appendChild(chanceOfRain_p);
        col1_card_body_div.appendChild(humidity_p);
        col1_card_body_div.appendChild(wind_speed_p);

        col1_card_div.appendChild(col1_card_body_div);
        card_body_col1_div.appendChild(col1_card_div);
        // end of first column

        // second column
        const card_body_col2_div = createElement({ type: 'div', attributes: [{ class: 'col-lg-6' }] });
        const col2_card_div = createElement({ type: 'div', attributes: [{ class: 'card border-0' }] });
        const col2_card_body_div = createElement({ type: 'div', attributes: [{ class: 'card-body pt-0 pl-0 pb-0' }] });

        const temp_high_p =  createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const temp_high_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/temp-high.png`, class: 'card-icons' }] });
        const temp_high_span = createElement({ type: 'span', value: forecast.data[0].temp_high, attributes: [{ class: 'temp' }] });
        const temp_high_unit_symbol_sup = createElement({ type: 'sup', attributes: [{ class: 'todays-temp-unit-symbol' }] });
        const temp_high_text_span = createElement({ type: 'span', value: ' high' });
        temp_high_p.appendChild(temp_high_icon);
        temp_high_p.appendChild(temp_high_span);
        temp_high_p.appendChild(temp_high_unit_symbol_sup);
        temp_high_p.appendChild(temp_high_text_span);

        const temp_low_p =  createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const temp_low_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/temp-low.png`, class: 'card-icons' }] });
        const temp_low_span = createElement({ type: 'span', value: forecast.data[0].temp_low, attributes: [{ class: 'temp' }] });
        const temp_low_unit_symbol_sup = createElement({ type: 'sup', attributes: [{ class: 'todays-temp-unit-symbol' }] });
        const temp_low_text_span = createElement({ type: 'span', value: ' low' });
        
        temp_low_p.appendChild(temp_low_icon);
        temp_low_p.appendChild(temp_low_span);
        temp_low_p.appendChild(temp_low_unit_symbol_sup);
        temp_low_p.appendChild(temp_low_text_span);

        const sunrise_p =  createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const sunrise_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/sunrise.png`, class: 'card-icons' }] });
        const sunrise_span = createElement({ type: 'span', value: forecast.data[0].sunrise });
        sunrise_p.appendChild(sunrise_icon);
        sunrise_p.appendChild(sunrise_span);

        const sunset_p =  createElement({ type: 'p', attributes: [{ class: 'card-text' }] });
        const sunset_icon = createElement({ type: 'img', attributes: [{ src: `../img/icons/sunset.png`, class: 'card-icons' }] });
        const sunset_span = createElement({ type: 'span', value: forecast.data[0].sunset });
        sunset_p.appendChild(sunset_icon);
        sunset_p.appendChild(sunset_span);

        col2_card_body_div.appendChild(temp_high_p);
        col2_card_body_div.appendChild(temp_low_p);
        col2_card_body_div.appendChild(sunrise_p);
        col2_card_body_div.appendChild(sunset_p);

        col2_card_div.appendChild(col2_card_body_div);
        card_body_col2_div.appendChild(col2_card_div);
        // end of second column
        
        card_body_row_div.appendChild(card_body_col1_div);
        card_body_row_div.appendChild(card_body_col2_div);
        card_body_div.appendChild(card_body_row_div);
        
        header_row1_div.appendChild(address_div);
        header_row1_div.appendChild(temp_div);
        header_row2_div.appendChild(date_div);
        header_row2_div.appendChild(feels_like_div);

        card_header_div.appendChild(header_row1_div);
        card_header_div.appendChild(header_row2_div);
        card_div.appendChild(card_header_div);
        card_div.appendChild(card_body_div);
        col_div.appendChild(card_div);
        todays_card.appendChild(col_div);
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