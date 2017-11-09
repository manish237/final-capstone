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
    input.read=false;
    return CommunicationData
        .create(input)
        .then((preferenceData) => {
            console.log("message data post 02")
            res.status(201).json(preferenceData.apiRepr());
        })
        .catch(err => {
            console.log("message data post 03")
            console.error(err);
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }

            res.status(500).json({message: 'Internal server error'});
        });
});

//by username
router.get('/:commtype/:uname', (req, res) => {
    console.log("provider comm data get 01")

    let commtypes = config.commtype.split(' ');
    if(req.params.commtype!==undefined && req.params.commtype.length!==0) {
        if (commtypes.indexOf(req.params.commtype) === -1) {
            return res.status(422).json({message: 'Invalid Comm Type'});
        }
    }

    let filter = "";
    let filterto = "";
    if(req.params.commtype === 'MESSAGE') {
        return CommunicationData
            .find(
                    {
                        $and: [
                                {
                                    commtype : req.params.commtype
                                },
                                {
                                    $or : [
                                        {
                                            fromusername : req.params.uname
                                        },
                                        {
                                            tousername : req.params.uname
                                        }
                                    ]
                                }
                            ]
                    }
            )
            .then(data => {
                console.log("provider comm data get 02")
                console.log(data)
                res.status(200).json(data)
            })
            .catch(
                err => {
                    console.log("provider comm data get 03")

                    //console.error(err);
                    if (err.name === 'InvalidUserError') {
                        return res.status(422).json({message: err.message});
                    }
                    res.status(500).json({message: 'Internal server error'});
                });
    }
    else  if(req.params.commtype === 'CHAT') {
        return CommunicationData
            .find(
                {
                    $and: [
                        {
                            commtype : req.params.commtype
                        },
                        {
                            $or : [
                                {
                                    fromchathandle : req.params.uname
                                },
                                {
                                    tochathandle : req.params.uname
                                }
                            ]
                        }
                    ]
                }
            )
            .then(data => {
                console.log("provider comm data get 02")
                console.log(data)
                res.status(200).json(data)
            })
            .catch(
                err => {
                    console.log("provider comm data get 03")

                    //console.error(err);
                    if (err.name === 'InvalidUserError') {
                        return res.status(422).json({message: err.message});
                    }
                    res.status(500).json({message: 'Internal server error'});
                });
    }
    console.log(filterfrom)
    console.log(filterto)

});

module.exports = router;