const {BasicStrategy} = require('passport-http');
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const queryParser = bodyParser.urlencoded({ extended: true });


const request = require('request-promise')
const sc = require('spotcrime')

router.get('/nutritionix', (req, res) => {
    // console.log(req.query.longitude)
    // console.log(req.query.latitude)
    // console.log(req.query.sort_by)
    // console.log(req.query.radius)
    console.log("nutritionix 01");
    console.log(req.query.query);
    console.log(req.query);
    let options;
    //console.log(req.query)
    if(req.query.query !== undefined)
    {
        options = {
            method: 'GET',
            uri: 'https://trackapi.nutritionix.com//v2/search/instant',
            headers: {
                'x-app-id': '01aac769',
                'x-app-key':'329ea91065d99038bd3804db41ad36c9'
            },
            qs: {
                query: req.query.query
            },
            json: true
        }
    }
    console.log("nutritionix 02");

    request(options)
        .then(response => {
            console.log("nutritionix 03");

            res.json(response);
        })
        .catch((err) => {
            console.log("nutritionix 04");
            console.log(err)
            res.status(500).json({
                message: "Internal server error"})
        })
});

router.get('/vr', (req, res) => {
    // console.log(req.query.centerPointLatitude)
    // console.log(req.query.centerPointLongitude)
    // console.log(req.query.distanceInKm)
    // console.log(req.query.sort)
    const options = {
        method: 'GET',
        uri: 'https://ws.homeaway.com/public/search',
        headers: {
            'Authorization': 'Bearer YTE5MWFhMmUtMzc5Mi00ZTNkLTlkMTYtOWVjNmExMjgwOTcw'
        },
        qs: {
            centerPointLatitude: req.query.centerPointLatitude !== undefined ? req.query.centerPointLatitude : 40.8445867,
            centerPointLongitude: req.query.centerPointLongitude!== undefined ? req.query.centerPointLongitude : -73.9452655,
            distanceInKm:req.query.distanceInKm!== undefined ? req.query.distanceInKm :16.1,
            sort:req.query.sort!== undefined ? req.query.sort : "averageRating:desc",
            availabilityStart:req.query.startDate!== undefined ? req.query.startDate :undefined,
            availabilityEnd:req.query.endDate!== undefined ? req.query.endDate :undefined,
            minNightlyPrice:req.query.minPrice!==undefined?req.query.minPrice:0,
            maxNightlyPrice:req.query.maxPrice!==undefined?req.query.maxPrice:1000,
            imageSize:"LARGE"
        },
        json: true

    }
    request(options)
        .then(response => {
            res.json(response)
        })
        .catch((err) => {
            res.status(500).json({
                message: "Internal server error"})
        })
});

router.get('/crime', (req, res) => {
    // console.log(req.query.longitude)
    // console.log(req.query.latitude)
    // console.log(req.query.radius)
    const loc = {
        lat: req.query.lat !== undefined ? req.query.latitude : 40.8445867,
        lon: req.query.lon !== undefined ? req.query.longitude : -73.9452655
        // lat: req.query.latitude !== undefined ? req.query.latitude : 40.8445867,
        // lon: req.query.longitude !== undefined ? req.query.longitude : -73.9452655,
    };
    const radius = req.query.radius !== undefined ? req.query.radius : 1;

    sc.getCrimes(loc, radius, function(err, crimes){
        if(err){
            console.log("errior")
            res.status(500).json({message: "Internal server error"})
        }
        else {
            console.log(crimes)
            res.json(crimes)
        }
    });
});



module.exports = router;