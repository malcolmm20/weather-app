request = require('request')


const forecast = (lat, long, callback) => {
    weatherurl  = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${lat},${long}
    ?unitGroup=metric&include=days&key=${process.env.VISUAL_CROSSING_KEY}&contentType=json`

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