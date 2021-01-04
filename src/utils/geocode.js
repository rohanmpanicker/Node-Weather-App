const request = require('request')

const geocode = (place, callback) =>{

    console.log('Place : ' + place)

    const mapboxURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/'+ encodeURIComponent(place) +'.json?access_token='+
    'pk.eyJ1Ijoicm9oYW5tcGFuaWNrZXIiLCJhIjoiY2tqN2w5b2JlMHBrMjM1cWlrNzF0aTh4dyJ9.C8LvgqmJrq91omcrkpsSUA'+
    '&limit=1';

    // We've destructured the response object here into { body } since we only use that part. I've kept the code same in
    // forecast to since how we orginally called and used response 
    request({url: mapboxURL, json: true}, (error,{ body }) => {

        if( error ){
            callback("Unable to connect to Mapbox service", undefined)
        }else if( body.features.length === 0 ){
            callback("Unable to find location. Please try again.",undefined)
        }else{
            const longitude = body.features[0].center[0];
            const latitude = body.features[0].center[1];
        
            console.log("Longitude : " + longitude)
            console.log("Latitude : " + latitude)

            callback(undefined,{
                longitude: longitude,
                latitude: latitude,
                location: body.features[0].place_name
            })
        }
    
        
    
    })

}

module.exports = geocode