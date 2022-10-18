const { response } = require('express')
const request = require('request')

const image = (lat, long, callback) => {
    const url = 'https://api.windy.com/api/webcams/v2/list/nearby=' + lat + ',' + long + ',25?key=XAMGltsXqzEcnp9q6aXIGW4xzSEbcx7F&show=webcams:image,category&category=forest'
    request({ url: url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to webcam services')
        } else if (body.status != 'OK') {
            console.log('hello')
            if (body.status == 'INVALID_REQUEST') {
                callback('Invalid request')
            } else if (body.status == 'INVALID_RESPONSE') {
                callback('Invalid response')
            }
        } else {
            if (body.result.webcams[0]) {
                console.log('retUrl ' + body.result.webcams[0].image.current.preview)
                console.log('title ' + body.result.webcams[0].title)
                console.log('category' + JSON.stringify(body.result.webcams[0])) 
                callback(undefined, {
                    retUrl: body.result.webcams[0].image.current.preview,
                    title: body.result.webcams[0].title,
                    width: body.result.webcams[0].image.sizes.preview.width,
                    height: body.result.webcams[0].image.sizes.preview.height
                })
            } else {
                callback('No webcams in the area, try a more populated area to see an image')
            }
        }
    })
}


module.exports = image