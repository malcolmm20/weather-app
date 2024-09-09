const axios = require('axios');
require('dotenv').config()


const geocode = async (address) => {
    const url = `http://api.positionstack.com/v1/forward`;
    try {
        const response = await axios.get(url, {
            params: {
                access_key: process.env.POSITION_STACK_KEY,
                query: address,
            }
        });
        const body = response.data;
        if (body.error) {
            throw new Error(body.error.info);
        }

        if (body.data.length === 0) {
            throw new Error('Invalid request');
        }
        const { latitude, longitude, label: location } = body.data[0];
        
        return { latitude, longitude, location };
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error?.info || 'Error in geocoding service response');
        } else if (error.request) {
            throw new Error('Unable to connect to geocoding services');
        } else {
            throw error;
        }
    }
};

module.exports = geocode;