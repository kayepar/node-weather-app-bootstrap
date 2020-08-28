const path = require('path');
const express = require('express');
const hbs = require('express-hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');
const ipaddress = require('./utils/ipaddress');

const app = express();

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));
app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, '../templates/partials'),
    layoutsDir: path.join(__dirname, '../templates/layouts'),
    defaultLayout: path.join(__dirname, '../templates/layouts/main')
}));

// setup static directory to serve
app.use(express.static(path.join(__dirname, '../public')));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name: 'Kaye Par'
    });
});

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        name: 'Kaye Par',
        message: ''
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Kaye Par',
        layout: 'main'
    });
});

app.get('/location', async (req, res) => {
    try {
        const city = await (ipaddress());
        
        res.send({
            city
        });
    } catch (error) {
        res.status(400).send({error: error});
    }
});

app.get('/weather', async (req, res) => {
    try {
        const unit = req.query.units;
        const { latitude, longitude, location } = await geocode(req.query.address);
        const forecastData = await forecast(latitude, longitude, location, unit);
        console.log(forecastData);
        
        res.send({
            forecast: forecastData
        });

        // use block of code below to use canned forecast from weatherbit
        // const fs = require('fs');
        // const forecast = JSON.parse(fs.readFileSync(`sample-data-${unit}.json`));
        // console.log(forecast);
        // res.send({
        //     forecast
        // });
    } catch (error) {
        console.log(`/weather error: ${error}`);
        res.status(400).send({ error });
    }
});

app.get('/help/*', (req, res) => {
    res.status(404);
    res.render('404', {
        title: '404',
        name: 'Kaye Par',
        message: 'Help article not found'
    });
});

app.get('*', (req, res) => {
    res.status(404);
    res.render('404', {
        title: '404',
        name: 'Kaye Par',
        message: 'Page not found'
    });
});

module.exports = app;