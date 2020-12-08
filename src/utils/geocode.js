const fetch = require('node-fetch');

const geocode = async (address) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${
        process.env.MAPBOX_API_KEY
    }&limit=1`;

    if (address.trim() === '') {
        // purposely for automated tests
        return Promise.reject('Please provide an address.');
    }

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error || data.features.length === 0) throw new Error('No result');

        return Promise.resolve({
            latitude: data.features[0].center[1],
            longitude: data.features[0].center[0],
            location: data.features[0].place_name,
        });
    } catch (error) {
        console.log(`geocode error: ${error}`);
        let message = error.message.includes('No result')
            ? 'Unable to find location. Try another address.'
            : 'Unable to connect to location service.';
        return Promise.reject(message);
    }
};

module.exports = geocode;
