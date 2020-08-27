const request = require('request-promise');

const geocode = async (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${process.env.MAPBOX_API_KEY}&limit=1`;

    if (address.trim() === '') { // purposely for automated tests
        return Promise.reject('Please provide an address.');
    }

    return request({ url, json: true, resolveWithFullResponse: true })
        .then(response => {
            console.log(response.body);
            if ((response.body.error) || (response.body.features.length === 0)) throw new Error('No result');

            return Promise.resolve(
                {
                    latitude: response.body.features[0].center[1],
                    longitude : response.body.features[0].center[0],
                    location: response.body.features[0].place_name
                }
            );
        })
        .catch(error => {
            console.log(`geocode error: ${error}`);
            let message = (error.message.includes('No result')) ? 'Unable to find location. Try another address.' : 'Unable to connect to location service.';
            return Promise.reject(message);
        });
};

module.exports = geocode;