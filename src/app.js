const path = require('path')
const express = require('express')
const hbs = require('hbs')

const forecast = require('./utils/forecast')
const geocode = require('./utils/geocode')
const image = require('./utils/image')


const app = express()
const port = process.env.PORT || 3000


// define oaths for express config
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
        name: 'Malcolm Mackenzie'
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

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Must provide an address'
        })
    }
    
    geocode(req.query.address, (error, {latitude, longitude, location} = {}) => {
        if (error) {
            return res.send({
                error: 'Error encountered'
            })
        } else if (!latitude) {
            return res.send({
                error: 'Invalid input'
            })
        } else {
            forecast(latitude, longitude, (error, {date, temp, description} = {}) => {
                if (error) {
                    return res.send({
                        error: 'Invalid forecast request'
                    })
                } else {
                    image(latitude, longitude, (error, {retUrl, title, width, height} = {}) => {
                        console.log('sent ' + retUrl)
                        res.send({
                            location,
                            date,
                            temp,
                            description,
                            retUrl, 
                            title,
                            width,
                            height
                        })
                    })
                }
            })
        }
    })
})

app.get('/help/*', (resq, res) => {
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