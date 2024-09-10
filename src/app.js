const path = require('path')
const express = require('express')
const hbs = require('hbs')
const axios = require('axios')
require('dotenv').config({path: "../.env"})

const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const windy = require('./utils/image')

const app = express()
const port = process.env.PORT || 3000


// define paths for express config
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// setup handlebars engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)


// setup static directory to serve
app.use(express.static(publicDirectoryPath))

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather Viewer',
        name: 'Malcolm Mackenzie',
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Malcolm Mackenzie'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        helpMessage: 'Here are some tips on how to use the website',
        name: 'Malcolm Mackenzie'
    })
})


async function getWeatherData(latitude, longitude) {
    const [forecastData, webcamData] = await Promise.all([
      forecast(latitude, longitude),
      windy.getWebcam(latitude, longitude),
    ]);
  
    const imageData = await windy.getImage(webcamData.id);
  
    return {
      ...forecastData,
      ...webcamData,
      ...imageData,
    };
}
  
app.get('/weather', async (req, res) => {
    if (!req.query.address) {
      return res.status(400).send({ error: 'Must provide an address' });
    }
  
    try {
        const { latitude, longitude, location } = await geocode(req.query.address);
        if (!latitude || !longitude) {
            return res.status(400).send({ error: 'Invalid input' });
        }
        const weatherData = await getWeatherData(latitude, longitude);
    
        res.send({
            location,
            ...weatherData,
        });
    } catch (error) {
        console.error('Error in /weather endpoint:', error);
        res.status(500).send({ error: error.message || 'An error occurred while processing your request' });
    }
});

app.get('/locationSuggestions', async (req, res) => {
    if (!req.query.location) {
        return res.status(400).send({error: 'Invalid Input'})
    }
    const url = `https://api.geoapify.com/v1/geocode/autocomplete`
    try {
        const suggestions = await axios.get(url, {
            params: {
                text: req.query.location,
                apiKey: process.env.GEOAPIFY_KEY,
            }
        })
        res.json(suggestions.data.features.map(suggestion => suggestion.properties.formatted).sort((location, other) => location.startsWith(req.query.location)))
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch suggestions' })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: 'Error 404 Page Not Found',
        errorMessage: 'Help article not found',
        name: 'Malcolm Mackenzie'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: 'Error 404 Page Not Found',
        errorMessage: 'Please navigate to a valid page',
        name: 'Malcolm Mackenzie'
    })
})

app.listen(port, () => {
    console.log('Server is up on port' + port)
})