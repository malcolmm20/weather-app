const { getYear } = require('date-fns')

request = require('request')


const forecast = (lat, long, callback) => {
    weatherurl  = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/' + lat + '%2C%20' + long + '?unitGroup=metric&include=days&key=TRTM8DJKU5Q6QN9VR6NXQRLDK&contentType=json'
    //weatherurl2 = 'http://api.weatherstack.com/forecast?access_key=988432d4eecddc64bdeec46247955670&query=' + lat + ',' + long

    console.log(weatherurl)
    request({ url: weatherurl, json: true }, (error, {body} = {}) => {
        if (error) {
            callback('Unable to connect to weather services.')
        } else if (body.error) {
            callback(body.error.info)
        } else {
            year = String(new Date().getFullYear())
            currDate = Date(body['days'][0].datetime)
            currDate = currDate.substring(0, currDate.search(year) - 1)
            console.log(body['days'][0].description)
            callback(undefined, {
                date: currDate,
                temp: body['days'][0].temp,
                description: body['days'][0].description
            })
        }
        
    })
}

module.exports = forecast