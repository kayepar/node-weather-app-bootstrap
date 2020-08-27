const request = require('request-promise');

const ipaddress = async () => {
    const url = 'http://ip-api.com/json/';

    return request({ url, json: true })
        .then(body => {
            return Promise.resolve(body.city);
        })
        .catch(error => {
            console.log(error);
            return Promise.reject('Unable to connect to the IP API service.');
        });
};

module.exports = ipaddress;