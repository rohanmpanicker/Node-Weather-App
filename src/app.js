const path = require('path')
const express = require('express')
const hbs = require('hbs')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

// console.log(__dirname)
// console.log(__filename)

console.log(path.join(__dirname,'../public'))

const app = express()

//Heroku provides this. We use the default value of 3000 to run on local.
const port = process.env.PORT || 3000

// Define path for Express config
const publicDirectory = path.join(__dirname,'../public')
const viewDirectory = path.join(__dirname, "../templates/views")
const partialsDirectory = path.join(__dirname, '../templates/partials') 

// This is used to set the hbs module with express
// We also create a views folder in the root directory of the project i.e. web-server to set-up our views.
// This is where hbs expects all the views as this is how it needs to be set up.
// Handlebars engine setup here
app.set('view engine','hbs')

// By default it is the <project name>/views. In this case web-server/views
// We do not need to set this property if the above mentioned folder is created.
// Handlebars views directory setup here
app.set('views', viewDirectory)

// Directory for partials
hbs.registerPartials(partialsDirectory)

// This serves as the index.html path when no path is provided
// Express picks up the index.html page pressent in the public directory by default
// This path is used to render the CSS, images and JS files
// Setup static directory for express
app.use(express.static(publicDirectory))

// Renders the index.hbs by taking it from path set in app.set('views', viewDirectory) command
app.get('',(req,res)=>{

    res.render('index', {
        title: "Weather Application",
        name: "Rohan Panicker"
    })

})

// Renders the about.hbs by taking it from path set in app.set('views', viewDirectory) command
app.get('/about', (req,res) => {

    res.render('about',{
        title: 'About Us',
        name: "Rohan Panicker",
        aboutText: "We created the Weather Application by using the services of weatherstack and mapbox."   
    })

})

// Renders the help.hbs by taking it from path set in app.set('views', viewDirectory) command
app.get('/help', (req,res) => {

    res.render('help',{
        title: 'Help',
        name: "Rohan Panicker",
        helpText: "Please contact us from this page"
    })

})

app.get('/weather', (req,res)=>{

    if(!req.query.address){
        res.send({
            errorMessage: "Please enter an address."
        })
    }
    else{

        //Geocoding : Address -> Longitude and Latitude -> Weather
        //Here we will destructure the data object
        // geocode(address, (error,data)=>{
        geocode(req.query.address, (error,{ latitude, longitude, location } = {} )=>{

            if(error){
               console.log('Error : ',error)

               // When you use return you don't need to use the else statement as the program execution stops here
               return res.send({
                   errorMessage: "Error in fetching location.",
                   error
               })
            }
            else{

                //console.log('Data : ',data)
                //Weather Stack API call
                forecast(longitude, latitude, (error, forecastData) => {
    
                    if(error){
                        console.log('Error', error)
                        return res.send({
                            errorMessage: "Error in fetching weather data.",
                            error
                        })
                    }
                    else{
                        console.log('Place : ', location)
                        console.log('Weather : ', forecastData.weather_descriptions)
                        console.log('Temperature : ', forecastData.temperature)
                        console.log('Feels Like : ', forecastData.feelslike)
                        console.log('Humidity : ', forecastData.humidity)
                        // console.log('Image Icon src : ',forecastData.weather_icon)
                        return res.send({
                            place: location,
                            weather: forecastData.weather_descriptions,
                            temperature: forecastData.temperature,
                            feelsLike: forecastData.feelslike,
                            humidity: forecastData.humidity
                            // weather_icon: forecastData.weather_icon
                        })
                    }
                })

            } 
        })        
    }

})

app.get('/products', (req,res)=>{

    if(!req.query.search){
        return res.send({
            errorMessage: "Please enter a search term."
        })
    }
    
    console.log(req.query)

    res.send({
        products: []
    })
})

app.get('/help/*', (req,res) => {

    res.render('404',{
        title:"404 Page not found",
        name: "Rohan Panicker",
        errorMessage: "Help article not found."
    })

})

// This render a page when there is no match - 404 request
app.get('*',(req,res)=>{

    res.render('404',{
        title: "404 Page not found",
        name: "Rohan Panicker",
        errorMessage: "Page doesn't exist."
    })

})


app.listen(port, () => {
    console.log('Server is running on port ' + port)
})

// Commented code
// Here we send html in response to a request
// app.get('', (req,res)=>{
//     res.send('<h1> Express </h1>')
// })

// Here we send back an array of elements in response to the help identifier
// app.get('/help', (req,res)=>{
//     res.send([{
//         name:'Rohan',
//         age:29
//     },
//     {
//         name: 'Andrew',
//         age: 27
//     }
//     ])
// })

//  Here we send html in response to a request for identifier about
// app.get('/about', (req,res)=>{
//     res.send('<h1>About Page</h1>')
// })
// Commneted code ends