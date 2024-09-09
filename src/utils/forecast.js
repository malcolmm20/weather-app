const axios = require('axios');
require('dotenv').config()

const forecast = async (lat, long) => {
    const weatherUrl = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}`

    try {
        const response = await axios.get(weatherUrl, 
            {
                params: {
                    key: process.env.VISUAL_CROSSING_KEY,
                    unitGroup: 'metric',
                    include: 'days',
                    contentType: 'json',
                }
            });
        const body = response.data;

        const year = new Date().getFullYear();
        const currDate = new Date(body.days[0].datetime).toDateString().replace(` ${year}`, '');

        return {
            date: currDate,
            temp: body.days[0].temp,
            description: body.days[0].description
        };
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error?.info || 'Error in weather service response');
        } else if (error.request) {
            throw new Error('Unable to connect to weather services');
        } else {
            throw error;
        }
    }
};

module.exports = forecast;