const request = require('request')

const forecast = (longitude,latitude, callback) => {

    // console.log(longitude)
    // console.log(latitude)

    const weatherStackUrl = 'http://api.weatherstack.com/current?access_key=9fab3cd2ef4b099caacf0f5fc3dbc18c&'+
    'query='+latitude+','+longitude+'&units=f'

    // We cannot use the short hand here since our variable name is different. If we had used url as the variable name the 
    // shorthand would be  request({url, json: true }, (error,response) =>{
    request({url: weatherStackUrl, json: true }, (error,response) =>{

        //console.log(response.body.current)
        if(error){
            callback('Unable to connect to Weather Stack service.',undefined)
        }else if(response.body.error){
            callback('Unable to find location. Please try again.',undefined)
        }else{

            callback(undefined,{
                weather_icon: response.body.current.weather_icons[0],
                weather_descriptions: response.body.current.weather_descriptions[0],
                temperature: response.body.current.temperature,
                feelslike: response.body.current.feelslike,
                humidity: response.body.current.humidity
            })
        }
    

        // We used the below statements to parse the request in JSON format. Since we set json=true we don't need to do that.
        // const data = JSON.parse(response.body)
        // console.log(data.current) 

    })

}

module.exports = forecast