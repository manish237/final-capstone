'use strict'

const express = require('express');
const router = express.Router();
const config = require('../../config')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {AuthData} = require('../models/authModel');
const {CommonProfileData,ConsumerProfileData,ProviderProfileData} = require('../models/profileModel');

router.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/', jsonParser, (req, res) => {
    console.log("provider profile data post 01")

    const requiredFields = ['username'];
    let input = {};
    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            //console.error(message);
            return res.status(400).send(message);
        }
    }
    input.username = req.body.username;



    let servicetypes = config.servicetype.split(' ');
    if(req.body.servicetype!==undefined && req.body.servicetype.length!==0) {
        if (servicetypes.indexOf(req.body.servicetype) === -1) {
            return res.status(422).json({message: 'Invalid Gender'});
        }
        input.servicetype = req.body.servicetype;
    }

    if(req.body.expertise!==undefined && req.body.expertise.length!==0) {
        input.expertise = req.body.expertise;
    }

    if(req.body.chat!==undefined) {
        input.chat = req.body.chat;
    }


    if(req.body.qualifications!==undefined && req.body.qualifications.length!==0) {
        input.qualifications = [];
        for(let i = 0;i<req.body.qualifications.length;i++)
        {
            input.qualifications.push(req.body.qualifications[i])
        }
    }

    return AuthData
        .find({username:input.username})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("provider profile data post 02")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(()=>{
            console.log("provider profile data post 03")
            return ProviderProfileData
                .find({username:input.username})
                .count()
                .exec()
        })
        .then((countU)=>{
            console.log("provider profile data post 04")
            if(countU===0)
            {
                console.log("provider profile data post 05")
                //create new record
                input.datecreated=req.body.datecreated || Date.now();
                console.log(input)

                return ProviderProfileData
                    .create(input)

            }
            else
            {
                console.log("provider profile data post 06")

                input.dateupdated=req.body.dateupdated||Date.now();
                console.log(input)


                return ProviderProfileData
                    .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
            }

        })
        .then((preferenceData) => {
            console.log("provider profile data post 07")
            res.status(201).json(preferenceData.apiRepr());
        })
        .catch(err => {
            console.log("provider profile data post 08")
            console.error(err);
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }

            res.status(500).json({message: 'Internal server error'});
        });
});

router.put('/:uname', jsonParser, (req, res) => {
    console.log("provider profile data put 01")
    let input = {};

    if (!(req.params.uname && req.body.username && req.params.uname === req.body.username)) {
        const message = (
            `Request path id (${req.params.uname}) and request body id ` +
            `(${req.body.uname}) must match`);
        //console.error(message);
        res.status(400).json({message: message});
    }

    input.username = req.body.username;

    let servicetypes = config.servicetype.split(' ');
    if(req.body.servicetype!==undefined && req.body.servicetype.length!==0) {
        if (servicetypes.indexOf(req.body.servicetype) === -1) {
            return res.status(422).json({message: 'Invalid Gender'});
        }
        input.servicetype = req.body.servicetype;
    }

    if(req.body.expertise!==undefined && req.body.expertise.length!==0) {
        input.expertise = req.body.expertise;
    }

    if(req.body.chat!==undefined) {
        input.chat = req.body.chat;
    }


    if(req.body.qualifications!==undefined && req.body.qualifications.length!==0) {
        input.qualifications = [];
        for(let i = 0;i<req.body.qualifications.length;i++)
        {
            input.qualifications.push(req.body.qualifications[i])
        }
    }

    console.log("provider profile data put 02")

    input.dateupdated=req.body.dateupdated||Date.now();

    console.log(input)
    return AuthData
        .find({username:input.username})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("provider profile data put 03")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(() => {
            return ProviderProfileData
                .find({username:input.username})
                .count()
                .exec()
        })
        .then((count)=>{
            console.log("provider profile data put 04")
            if (count === 0) {
                console.log("provider profile data put 04a")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
            return ProviderProfileData
                .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
        })
        .then(prefData => {
            console.log("provider profile data put 05")
            console.log(prefData)
            res.status(200).json(prefData.apiRepr())
        })
        .catch(err => {
            console.log("provider profile data put 06")
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }
            console.log(err)
            res.status(500).json({message: 'Internal server error'})
        });

});


//by username
router.get('/:uname', (req, res) => {
    console.log("provider profile data get 01")
    return AuthData
        .find({username: req.params.uname})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("provider profile data get 02")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(()=>{
            console.log("provider profile data get 03")
            return ProviderProfileData
                .find({username: req.params.uname})
        })
        .then(data => {
            console.log("provider profile data get 04")
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(
            err => {
                console.log("provider profile data get 05")
                //console.error(err);
                if (err.name === 'InvalidUserError') {
                    return res.status(422).json({message: err.message});
                }
                res.status(500).json({message: 'Internal server error'});
            });
});

module.exports = router;