const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// define path to templates
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')
const app = express()
const publicDir = path.join(__dirname, '../public')
// setup static file
app.use(express.static(publicDir))

// set up handles bar engine and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)



app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather App',
        name : 'Yahli'
    })
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About me',
        name: 'Yahli'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
      message: 'you need help my friend' ,
      title: 'Help',
      name: 'Yahli' 
    })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
        return res.send({
            error: 'Address is required!'
        })
    }

    geocode(req.query.address, (error, {latitude, longtitude, location} = {}) => {
        if(error) {
            return res.send({ error })
        }

        forecast(latitude, longtitude, (error, forecastData) => {
            if (error) {
                return res.send( { error })
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })
        })
    })
})

/*    res.send({
        forecast: 'it is snowing',
        location: 'Tel Aviv',
        address: req.query.address
    })
})*/

app.get('/products' , (req, res) => {
    if(!req.query.search) {
        return res.send({
            error: 'You must provide a search term'
        })
    }
    else {
        console.log(req.query)
        res.send({
            products: []
        })
    }
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Yahli',
        errorMessage: 'Help Article not found'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Yahli',
        errorMessage: 'Page not found'
    })
})

app.listen(3000, () => {
    console.log('server is up on port 3000.')
})