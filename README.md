# Weather App

Displays weather forecast based on an address provided. Data comes from [ip-api](https://ip-api.com/), [mapbox](https://www.mapbox.com/) and [Weatherbit.io](https://www.weatherbit.io/) APIs.

**URL:** https://par-weather-app.herokuapp.com/

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. 

### Prerequisites

[Node.js](https://nodejs.org/en/) - get and install the latest version.

### Installing

Follow below steps to get the project up and running on your local machine. 

1. Clone the project
2. Run `$npm install` to get all project dependencies
3. Create `config/dev.env` file
   * Get API keys from both **[mapbox](https://www.mapbox.com/)** and **[Weatherbit.io](https://www.weatherbit.io/)**
   * Save the API keys in the dev.env file
  
    **Example:**
    ```
    MAPBOX_API_KEY=some_value
    WEATHERBIT_API_KEY=some_value
    ```
    
4. Run `$npm run dev` to start the server. You should see below message if successful.
   ```
   [nodemon] 2.0.4
   [nodemon] to restart at any time, enter `rs`
   [nodemon] watching path(s): *.*
   [nodemon] watching extensions: js
   [nodemon] starting `node src/index.js hbs`
   Server running on port 80
   ```

   * Access `http://localhost` to view the app
   * Should you wish to change the default port, open `src/index.js` and modify the port variable assignment.
    ```
    const port = process.env.PORT || 80;
    ```

## Running the tests

Run `$npm test` to start automated tests

**Example result:**
```
 PASS  tests/app.test.js
  √ Should get main page (129 ms)
  √ Should get help page (34 ms)
  √ Should get about page (28 ms)
  √ Should get 404 for help subpages (28 ms)
  √ Should get 404 for any non existing page (33 ms)
  √ Should not get weather for empty address (32 ms)
  √ Should not get weather for invalid address (122 ms)
  √ Should get weather for valid address (620 ms)

Test Suites: 1 passed, 1 total
Tests:       8 passed, 8 total
Snapshots:   0 total
Time:        6.199 s
Ran all test suites.
```

## Built With

* [Node.js](https://nodejs.org/en/) - Server side runtime
* [npm](https://www.npmjs.com/) - Package management
* [Express.js](https://expressjs.com/) - Web application framework
* [express-hbs](https://www.npmjs.com/package/express-hbs) - Template engine
* [Jest](https://jestjs.io/) - Testing framework
* [Bootstrap](https://getbootstrap.com/) - Front-end framework

