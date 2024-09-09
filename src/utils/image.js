const { response } = require('express')
const request = require('request')

const getWebcam = (lat, long, callback) => {
    const url = `https://api.windy.com/webcams/api/v3/webcams?nearby=${lat},${long},25`
    console.log(url)
    request({ headers: {"X-WINDY-API-KEY": process.env.WINDY_KEY},
        url: url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to webcam services')
        } else {
            if (body.webcams[0]) {
                console.log('retUrl ' + body.webcams[0].webcamId)
                console.log('title ' + body.webcams[0].title) 
                callback(undefined, {
                    id: body.webcams[0].webcamId,
                    title: body.webcams[0].title,
                })
            } else {
                callback('No webcams in the area, try a more populated area to see an image')
            }
        }
    })
}

const getImage = (id, callback) => {
    const url = `https://api.windy.com/webcams/api/v3/webcams/${id}?include=images`
    console.log(url)
    request({ headers: {"X-WINDY-API-KEY": 'XLLm2bLKmfx4UoxBF4bNVICnh9HGBFff'},
        url: url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to webcam services')
        } else {
            if (body.images) {
                console.log('retUrl ' + body.images.current.preview)
                console.log('title ' + body.title) 
                callback(undefined, {
                    retUrl: body.images.current.preview,
                    width: body.images.sizes.preview.width,
                    height: body.images.sizes.preview.height, 
                })
            } else {
                callback('No webcams in the area, try a more populated area to see an image')
            }
        }
    })
}

module.exports = {getWebcam, getImage}