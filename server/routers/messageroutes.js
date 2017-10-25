'use strict'

const express = require('express');
const router = express.Router();
const config = require('../../config')

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {CommunicationData} = require('../models/messageModel');

router.use(bodyParser.urlencoded({
    extended: true
}));

router.post('/', jsonParser, (req, res) => {
    console.log("message data post 01")

    let input={}

    const requiredFields = ['commtype'];

    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            //console.error(message);
            return res.status(400).send(message);
        }
    }

    let commtypes = config.commtype.split(' ');
    if(req.body.commtype!==undefined && req.body.commtype.length!==0) {
        if (commtypes.indexOf(req.body.commtype) === -1) {
            return res.status(422).json({message: 'Invalid Commtype'});
        }
        input.commtype = req.body.commtype;
    }

    if(req.body.fromusername!==undefined && req.body.fromusername.length!==0) {
        input.fromusername = req.body.fromusername;
    }

    if(req.body.tousername!==undefined && req.body.tousername.length!==0) {
        input.tousername = req.body.tousername;
    }

    if(req.body.fromchathandle!==undefined && req.body.fromchathandle.length!==0) {
        input.fromchathandle = req.body.fromchathandle;
    }

    if(req.body.tochathandle!==undefined && req.body.tochathandle.length!==0) {
        input.tochathandle = req.body.tochathandle;
    }

    if(req.body.message!==undefined && req.body.message.length!==0) {
        input.message = req.body.message;
    }

    input.datecreated=req.body.datecreated || Date.now();

    return CommunicationData
        .create(input)
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

//by username
router.get('/:commtype/:uname', (req, res) => {
    console.log("provider profile data get 01")

    let commtypes = config.commtype.split(' ');
    if(req.params.commtype!==undefined && req.params.commtype.length!==0) {
        if (commtypes.indexOf(req.params.commtype) === -1) {
            return res.status(422).json({message: 'Invalid Comm Type'});
        }
    }

    let filter = {};
    if(req.params.commtype === 'MESSAGE')
        filter = {fromusername : req.params.uname}
    else  if(req.params.commtype === 'CHAT')
        filter = {fromchathandle : req.params.uname}

    return CommunicationData
        .find({
            $and : [ { commtype : req.params.commtype }, filter ]
        }).sort( { datecreated: -1 } )

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