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
    console.log("consumer profile data post 01")

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

    if(req.body.hygenescore!==undefined && req.body.hygenescore!==0) {
        input.hygenescore = req.body.hygenescore;
    }

    if(req.body.lastvisit!==undefined) {
        input.lastvisit = req.body.lastvisit;
    }

    if(req.body.nextvisit!==undefined) {
        input.nextvisit = req.body.nextvisit;
    }
    if(req.body.age!==undefined) {
        input.age = req.body.age;
    }
    if(req.body.preferredlanguage!==undefined && req.body.preferredlanguage.length!==0) {
        input.preferredlanguage = req.body.preferredlanguage;
    }

    if(req.body.medHistorylist!==undefined && req.body.medHistorylist.length!==0) {
        input.medHistorylist = [];
        for(let i = 0;i<req.body.medHistorylist.length;i++)
        {
            input.medHistorylist.push(req.body.medHistorylist[i])
        }
    }

    if(req.body.oralassessment!==undefined && req.body.oralassessment.length!==0) {
        input.oralassessment = [];
        for(let i = 0;i<req.body.oralassessment.length;i++)
        {
            input.oralassessment.push(req.body.oralassessment[i])
        }
    }
    if(req.body.medicationlist!==undefined && req.body.medicationlist.length!==0) {
        input.medicationlist = [];
        for(let i = 0;i<req.body.medicationlist.length;i++)
        {
            input.medicationlist.push(req.body.medicationlist[i])
        }
    }

    if(req.body.responses!==undefined && req.body.responses.length!==0) {
        input.responses = [];
        for(let i = 0;i<req.body.responses.length;i++)
        {
            input.responses.push(
                {
                    questionid:req.body.responses[i].questionid,
                    response:req.body.responses[i].response
                }
            )
        }
    }

    return AuthData
        .find({username:input.username})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("consumer profile data post 02")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(()=>{
            console.log("consumer profile data post 03")
            return ConsumerProfileData
                .find({username:input.username})
                .count()
                .exec()
        })
        .then((countU)=>{
            console.log("consumer profile data post 04")
            if(countU===0)
            {
                console.log("consumer profile data post 05")
                //create new record
                input.datecreated=req.body.datecreated || Date.now();
                console.log(input)

                return ConsumerProfileData
                    .create(input)

            }
            else
            {
                console.log("consumer profile data post 06")

                input.dateupdated=req.body.dateupdated||Date.now();
                console.log(input)


                return ConsumerProfileData
                    .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
            }

        })
        .then((preferenceData) => {
            console.log("consumer profile data post 07")
            res.status(201).json(preferenceData.apiRepr());
        })
        .catch(err => {
            console.log("consumer profile data post 08")
            console.error(err);
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }

            res.status(500).json({message: 'Internal server error'});
        });
});

router.put('/:uname', jsonParser, (req, res) => {
    console.log("consumer profile data put 01")
    let input = {};

    if (!(req.params.uname && req.body.username && req.params.uname === req.body.username)) {
        const message = (
            `Request path id (${req.params.uname}) and request body id ` +
            `(${req.body.uname}) must match`);
        //console.error(message);
        res.status(400).json({message: message});
    }

    input.username = req.body.username;

    if(req.body.hygenescore!==undefined && req.body.hygenescore!==0) {
        input.hygenescore = req.body.hygenescore;
    }

    if(req.body.lastvisit!==undefined) {
        input.lastvisit = req.body.lastvisit;
    }

    if(req.body.nextvisit!==undefined) {
        input.nextvisit = req.body.nextvisit;
    }
    if(req.body.age!==undefined) {
        input.age = req.body.age;
    }
    if(req.body.preferredlanguage!==undefined && req.body.preferredlanguage.length!==0) {
        input.preferredlanguage = req.body.preferredlanguage;
    }

    if(req.body.medHistorylist!==undefined && req.body.medHistorylist.length!==0) {
        input.medHistorylist = [];
        for(let i = 0;i<req.body.medHistorylist.length;i++)
        {
            input.medHistorylist.push(req.body.medHistorylist[i])
        }
    }

    if(req.body.oralassessment!==undefined && req.body.oralassessment.length!==0) {
        input.oralassessment = [];
        for(let i = 0;i<req.body.oralassessment.length;i++)
        {
            input.oralassessment.push(req.body.oralassessment[i])
        }
    }
    if(req.body.medicationlist!==undefined && req.body.medicationlist.length!==0) {
        input.medicationlist = [];
        for(let i = 0;i<req.body.medicationlist.length;i++)
        {
            input.medicationlist.push(req.body.medicationlist[i])
        }
    }

    if(req.body.responses!==undefined && req.body.responses.length!==0) {
        input.responses = [];
        for(let i = 0;i<req.body.responses.length;i++)
        {
            input.responses.push(
                {
                    questionid:req.body.responses[i].questionid,
                    response:req.body.responses[i].response
                }
            )
        }
    }

    console.log("consumer profile data put 02")

    input.dateupdated=req.body.dateupdated||Date.now();

    console.log(input)
    return AuthData
        .find({username:input.username})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("consumer profile data put 03")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(() => {
            return ConsumerProfileData
                .find({username:input.username})
                .count()
                .exec()
        })
        .then((count)=>{
            console.log("consumer profile data put 04")
            if (count === 0) {
                console.log("consumer profile data put 04a")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
            return ConsumerProfileData
                .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
        })
        .then(prefData => {
            console.log("consumer profile data put 05")
            console.log(prefData)
            res.status(200).json(prefData.apiRepr())
        })
        .catch(err => {
            console.log("consumer profile data put 06")
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }
            console.log(err)
            res.status(500).json({message: 'Internal server error'})
        });

});


//by username
router.get('/:uname', (req, res) => {
    console.log("consumer profile data get 01")
    return AuthData
        .find({username: req.params.uname})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("consumer profile data get 02")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(()=>{
            console.log("consumer profile data get 03")
            return ConsumerProfileData
                .find({username: req.params.uname})
        })
        .then(data => {
            console.log("consumer profile data get 04")
            console.log(data)
            res.status(200).json(data)
        })
        .catch(
            err => {
                console.log("consumer profile data get 05")
                //console.error(err);
                if (err.name === 'InvalidUserError') {
                    return res.status(422).json({message: err.message});
                }
                res.status(500).json({message: 'Internal server error'});
            });
});




module.exports = router;