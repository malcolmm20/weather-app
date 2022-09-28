request = require('request')


const forecast = (lat, long, callback) => {
    weatherurl = 'http://api.weatherstack.com/forecast?access_key=988432d4eecddc64bdeec46247955670&query=' + lat + ',' + long

    request({ url: weatherurl, json: true }, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to weather services.')
        } else if (body.error) {
            callback(body.error.info)
        } else {
            date = body.location.localtime.substring(0, 8)
            day = parseInt(body.location.localtime.substring(8, 10))
            day = day - 1
            if (day < 10) {
                day = '0'.concat(day)
            }
            date = date + day
            callback(undefined, {
                date,
                mintemp: body["forecast"][date].mintemp,
                maxtemp: body["forecast"][date].maxtemp
            })
        }
        
    })
}


module.exports = forecast