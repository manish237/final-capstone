const {BasicStrategy} = require('passport-http');
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const queryParser = bodyParser.urlencoded({ extended: true });


const request = require('request-promise')
const sc = require('spotcrime')
var Feed = require('rss-to-json');

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

router.get('/feeds', (req, res) => {
    // console.log(req.query.longitude)
    // console.log(req.query.latitude)
    // console.log(req.query.sort_by)
    // console.log(req.query.radius)
    console.log("feeds 01");

    options = {
        method: 'GET',
        uri: "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D'" + "http://thedistracteddentist.com/?feed=rss" + "'&format=json",
        json: true
    }
    request(options)
        .then(response => {
            console.log(response)
            console.log("feeds 03");

            res.json(response);
        })
        .catch((err) => {
            console.log("feeds 04");
            console.log(err)
            res.status(500).json({
                message: "Internal server error"})
        })
    

});
module.exports = router;