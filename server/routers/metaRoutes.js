'use strict'

const express = require('express');
const router = express.Router();
const config = require('../../config')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {AuthData} = require('../models/authModel');
const {LocationSchema,LanguageSchema,QuestionBankSchema} = require('../models/metaModel');

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


router.post('/ques', jsonParser, (req, res) => {
    console.log("meta ques data post 01")
    const requiredFields = ['category','quesId','question','quesType'];
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            //console.error(message);
            return res.status(400).send(message);
        }
    }

    let input = {};
    let qCat = config.qbCategories.split(' ');
    let qresCat = config.qbRespTypes.split(' ');
    if(req.body.category!==undefined && req.body.category.length!==0) {
        if (qCat.indexOf(req.body.category) === -1) {
            return res.status(422).json({message: 'Invalid Category'});
        }
        input.category = req.body.category;
    }
    if(req.body.quesId!==undefined && req.body.quesId.length!==0) {
        input.quesId = req.body.quesId.trim();
    }
    if(req.body.question!==undefined && req.body.question.length!==0) {
        input.question = req.body.question.trim();
    }

    if(req.body.quesType!==undefined && req.body.quesType.length!==0) {
        if (qresCat.indexOf(req.body.quesType) === -1) {
            return res.status(422).json({message: 'Invalid Question Category'});
        }
        input.quesType = req.body.quesType;
    }

    if(req.body.response1!==undefined) {
        let resp = {}
        if(req.body.response1.respId!==undefined && req.body.response1.respId.length!==0)
            resp.respId = req.body.response1.respId.trim();
        if(req.body.response1.response!==undefined && req.body.response1.response.length!==0)
            resp.response = req.body.response1.response.trim();
        if(req.body.response1.respWeight!==undefined) {
            if(req.body.response1.respWeight>100)
                return res.status(422).json({message: 'Invalid Weightage'});
            resp.respWeight = req.body.response1.respWeight;
        }
        if(req.body.response1.respType!==undefined && req.body.response1.respType.length!==0) {
            if (qresCat.indexOf(req.body.response1.respType) === -1) {
                return res.status(422).json({message: 'Invalid Response Category'});
            }
            resp.respType = req.body.response1.respType;
        }
        input.response1 = resp;
    }
    if(req.body.response2!==undefined) {
        let resp = {}
        if(req.body.response2.respId!==undefined && req.body.response2.respId.length!==0)
            resp.respId = req.body.response2.respId.trim();
        if(req.body.response2.response!==undefined && req.body.response2.response.length!==0)
            resp.response = req.body.response2.response.trim();
        if(req.body.response2.respWeight!==undefined) {
            if(req.body.response2.respWeight>100)
                return res.status(422).json({message: 'Invalid Weightage'});
            resp.respWeight = req.body.response1.respWeight;
        }
        if(req.body.response2.respType!==undefined && req.body.response2.respType.length!==0) {
            if (qresCat.indexOf(req.body.response2.respType) === -1) {
                return res.status(422).json({message: 'Invalid Response Category'});
            }
            resp.respType = req.body.response2.respType;
        }
        input.response2 = resp;
    }
    if(req.body.response3!==undefined) {
        let resp = {}
        if(req.body.response3.respId!==undefined && req.body.response3.respId.length!==0)
            resp.respId = req.body.response3.respId.trim();
        if(req.body.response3.response!==undefined && req.body.response3.response.length!==0)
            resp.response = req.body.response3.response.trim();
        if(req.body.response3.respWeight!==undefined) {
            if(req.body.response3.respWeight>100)
                return res.status(422).json({message: 'Invalid Weightage'});
            resp.respWeight = req.body.response1.respWeight;
        }
        if(req.body.response3.respType!==undefined && req.body.response3.respType.length!==0) {
            if (qresCat.indexOf(req.body.response3.respType) === -1) {
                return res.status(422).json({message: 'Invalid Response Category'});
            }
            resp.respType = req.body.response3.respType;
        }
        input.response3 = resp;
    }
    if(req.body.response4!==undefined) {
        let resp = {}
        if(req.body.response4.respId!==undefined && req.body.response4.respId.length!==0)
            resp.respId = req.body.response4.respId.trim();
        if(req.body.response4.response!==undefined && req.body.response4.response.length!==0)
            resp.response = req.body.response4.response.trim();
        if(req.body.response4.respWeight!==undefined) {
            if(req.body.response4.respWeight>100)
                return res.status(422).json({message: 'Invalid Weightage'});
            resp.respWeight = req.body.response1.respWeight;
        }
        if(req.body.response4.respType!==undefined && req.body.response4.respType.length!==0) {
            if (qresCat.indexOf(req.body.response4.respType) === -1) {
                return res.status(422).json({message: 'Invalid Response Category'});
            }
            resp.respType = req.body.response4.respType;
        }
        input.response4 = resp;
    }

    console.log("meta ques data post 02")

    console.log(input)
    return QuestionBankSchema
        .find({quesId:input.quesId})
        .count()
        .exec()
        .then(count => {
            if (count !== 0) {
                console.log("meta ques data post 03")
                return Promise.reject({
                    name: 'InvalidQIdError',
                    message: 'Ques Id Exists'
                });
            }
        })
        .then(()=>{
            console.log("meta ques data post 04")
            return QuestionBankSchema
                .create(input)
        })
        .then((data) => {
            console.log("meta ques data post 05")
            res.status(201).json(data.apiRepr());
        })
        .catch(err => {
            console.log("meta ques data post 06")
            console.error(err);
            if (err.name === 'InvalidQIdError') {
                return res.status(422).json({message: err.message});
            }
            res.status(500).json({message: 'Internal server error'});
        });
});


router.get('/ques/bycat/:cat', (req, res) => {
    console.log("meta ques bycat get 01" + req.params.cat)

    let qCat = config.qbCategories.split(' ');
    if(req.params.cat!==undefined && req.params.cat.length!==0) {
        if (qCat.indexOf(req.params.cat) === -1) {
            return res.status(422).json({message: 'Invalid Category'});
        }
    }


    return QuestionBankSchema
        .find({category:req.params.cat})
        .exec()
        .then(data => {
            console.log("meta ques bycat get 02")
            // console.log(data)
            // console.log(typeof data)
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(
            err => {
                console.log("meta ques bycat get 03")
                console.error(err);
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


