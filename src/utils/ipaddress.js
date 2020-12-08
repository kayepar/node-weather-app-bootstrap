const fetch = require('node-fetch');

const ipaddress = async () => {
    const url = 'http://ip-api.com/json/';

    const response = await fetch(url);
    const data = await response.json();

    try {
        return Promise.resolve(data.city);
    } catch (error) {
        console.log(error);
        return Promise.reject('Unable to connect to the IP API service.');
    }
};

module.exports = ipaddress;
