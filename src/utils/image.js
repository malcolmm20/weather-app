const axios = require('axios');
require('dotenv').config()

const getWebcam = async (lat, long) => {
    const url = `https://api.windy.com/webcams/api/v3/webcams`;

    try {
        const response = await axios.get(url, {
            headers: { "X-WINDY-API-KEY": process.env.WINDY_KEY },
            params: { nearby: `${lat},${long},25` },
        });

        const body = response.data;

        if (body.webcams[0]) {
            return {
                id: body.webcams[0].webcamId,
                title: body.webcams[0].title,
            };
        } else {
            throw new Error('No webcams in the area, try a more populated area to see an image');
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Error in webcam service response');
        } else if (error.request) {
            throw new Error('Unable to connect to webcam services');
        } else {
            throw error;
        }
    }
};

const getImage = async (id) => {
    const url = `https://api.windy.com/webcams/api/v3/webcams/${id}`;

    try {
        const response = await axios.get(url, {
            headers: { "X-WINDY-API-KEY": process.env.WINDY_KEY },
            params: { include: 'images' },
        });

        const body = response.data;

        if (body.images) {
            return {
                retUrl: body.images.current.preview,
                width: body.images.sizes.preview.width,
                height: body.images.sizes.preview.height,
            };
        } else {
            throw new Error('No images available for this webcam');
        }
    } catch (error) {
        if (error.response) {
            throw new Error('Error in webcam service response');
        } else if (error.request) {
            throw new Error('Unable to connect to webcam services');
        } else {
            throw error;
        }
    }
};

module.exports = { getWebcam, getImage };