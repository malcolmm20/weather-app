const request = require('request')

const geocode = (address, callback) => {
    const url = 'http://api.positionstack.com/v1/forward?access_key=f01c3b42e1e4ed489fe697f8f23d3649&query=' + encodeURIComponent(address)
    request({ url: url, json: true}, (error, {body} = {}) => {
        if (body.error) {
            callback('Unable to connect to weather services')
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