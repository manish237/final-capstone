'use strict'

const express = require('express');
const router = express.Router();
const config = require('../../config')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {AuthData} = require('../models/authModel');
const {LocationSchema,LanguageSchema} = require('../models/metaModel');

router.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/loc', jsonParser, (req, res) => {
    console.log("meta loc data post 01")
    const requiredFields = ['country','state','city'];
    let input = {};
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            //console.error(message);
            return res.status(400).send(message);
        }
    }

    let {country, state, city} = req.body;

    if (typeof country !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: country'});
    }
    country = country.trim();

    if (country === '') {
        return res.status(422).json({message: 'Incorrect field length: country'});
    }

    if (typeof state !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: state'});
    }
    state = state.trim();

    if (state === '') {
        return res.status(422).json({message: 'Incorrect field length: state'});
    }

    if (typeof city !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: city'});
    }
    city = city.trim();

    if (city === '') {
        return res.status(422).json({message: 'Incorrect field length: country'});
    }

    console.log("meta loc data post 02")

    return LocationSchema
        .create({
            country : country,
            state:state,
            city:city
        })
        .then((preferenceData) => {
            console.log("meta loc data post 03")
            res.status(201).json(preferenceData.apiRepr());
        })
        .catch(err => {
            console.log("meta loc data post 04")
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});


router.get('/loc', (req, res) => {
    console.log("meta loc data get 01")

    let filter={};


    if(req.query.qs!==undefined && req.query.qs.length!==0)
    {
        console.log("meta loc data get 02")

        var nameRegex = new RegExp('^' + req.query.qs + '$', 'i');


        return LocationSchema
            .find(
                {"$or":[
                            {country: nameRegex},
                            {state: nameRegex},
                            {city: nameRegex}
                        ]}
            )
            .sort({country:1, state:1, city:1})
            .then(data => {
                console.log("meta loc data get 02")
                console.log(data)
                //console.log(addressHistData)
                res.status(200).json(data)
            })
            .catch(
                err => {
                    console.log("meta loc data get 03")
                    //console.error(err);
                    res.status(500).json({message: 'Internal server error'});
                });
    }
    else{
        console.log("meta loc data get 03")

        if(req.query.country!==undefined && req.query.country.length!==0)
        {
            filter.country=req.query.country;
        }
        if(req.query.state!==undefined && req.query.state.length!==0)
        {
            filter.state=req.query.state;
        }
        if(req.query.city!==undefined && req.query.city.length!==0)
        {
            filter.city=req.query.city;
        }
        console.log(req.query)
        console.log(filter)
        return LocationSchema
            .find(filter).sort({country:1, state:1, city:1})
            .then(data => {
                console.log("meta loc data get 02")
                console.log(data)
                //console.log(addressHistData)
                res.status(200).json(data)
            })
            .catch(
                err => {
                    console.log("meta loc data get 03")
                    //console.error(err);
                    res.status(500).json({message: 'Internal server error'});
                });
    }



});


router.post('/lang', jsonParser, (req, res) => {
    console.log("meta lang data post 01")
    const requiredFields = ['code','name','nativeName'];
    let input = {};
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            //console.error(message);
            return res.status(400).send(message);
        }
    }

    let {code, name, nativeName} = req.body;

    if (typeof code !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: code'});
    }
    code = code.trim();

    if (code === '') {
        return res.status(422).json({message: 'Incorrect field length: code'});
    }

    if (typeof name !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: name'});
    }
    name = name.trim();

    if (name === '') {
        return res.status(422).json({message: 'Incorrect field length: state'});
    }

    if (typeof nativeName !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: nativeName'});
    }
    nativeName = nativeName.trim();

    if (nativeName === '') {
        return res.status(422).json({message: 'Incorrect field length: country'});
    }

    console.log("meta lang data post 02")

    return LanguageSchema
        .create({
            code : code,
            name:name,
            nativeName:nativeName
        })
        .then((preferenceData) => {
            console.log("meta lang data post 03")
            res.status(201).json(preferenceData.apiRepr());
        })
        .catch(err => {
            console.log("meta lang data post 04")
            console.error(err);
            res.status(500).json({message: 'Internal server error'});
        });
});


router.get('/lang', (req, res) => {
    console.log("meta lang data get 01")
    return LanguageSchema
        .find({}).sort({code:1})
        .then(data => {
            console.log("meta lang data get 02")
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(
            err => {
                console.log("meta lang data get 03")
                //console.error(err);
                res.status(500).json({message: 'Internal server error'});
            });
});


module.exports = router;

//CommonProfileData - PUT update the fields

//CommonProfileData - POST create record (May not be used)

//CommonProfileData - GET get the profile data
//CommonProfileData - GET chat handles

//ConsumerProfileData - PUT update the fields

//ConsumerProfileData - POST create record

//ConsumerProfileData - GET get the profile data

//ProviderProfileData - PUT update the fields

//ProviderProfileData - POST create record

//ProviderProfileData - GET get the profile data

//


