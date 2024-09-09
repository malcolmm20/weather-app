const request = require('request')

const geocode = (address, callback) => {
    const url = `http://api.positionstack.com/v1/forward?access_key=${process.env.POSITION_STACK_KEY}&query='` + encodeURIComponent(address)
    console.log(url)
    request({ url: url, json: true}, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to weather services')
        } else if (body.error) {
            callback(body.error.info)
        } else if (body.data.length == 0) {
            callback('Invalid request')
        } else {
            latitude = body.data[0].latitude
            longitude = body.data[0].longitude
            location = body.data[0].label
                
            callback(undefined, {
                latitude,
                longitude,
                location
            })
        }
    })
}

module.exports = geocode