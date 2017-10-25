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
    console.log("common profile data post 01")
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
    //validate type
    let usertypes = config.usertype.split(' ');
    if(req.body.usertype!==undefined && req.body.usertype.length!==0) {
        if (usertypes.indexOf(req.body.usertype) === -1) {
            return res.status(422).json({message: 'Invalid User Type'});
        }
        input.usertype = req.body.usertype;
    }


    //validate status
    let accstatus = config.accountstatus.split(' ');
    if(req.body.accountstatus!==undefined && req.body.accountstatus.length!==0) {
        if (accstatus.indexOf(req.body.accountstatus) === -1) {
            return res.status(422).json({message: 'Invalid Account Status'});
        }
        input.accountstatus = req.body.accountstatus;
    }

    //validate status
    let gender = config.usergender.split(' ');
    if(req.body.gender!==undefined && req.body.gender.length!==0) {
        if (gender.indexOf(req.body.gender) === -1) {
            return res.status(422).json({message: 'Invalid Gender'});
        }
        input.gender = req.body.gender;
    }



    if(req.body.chathandle!==undefined && req.body.chathandle.length!==0) {
        input.chathandle = req.body.chathandle;
    }

    if(req.body.name!==undefined && req.body.name.length!==0) {
        input.name = req.body.name;
    }

    if(req.body.location!==undefined && req.body.location.length!==0) {
        input.location = req.body.location;
    }

    if(req.body.languages!==undefined && req.body.languages.length!==0) {
        input.languages = [];
        for(let i = 0;i<req.body.languages.length;i++)
        {
            console.log(req.body.languages[i])
            input.languages.push(req.body.languages[i])
        }
    }

    console.log(input)
    let countUser=0;

    return AuthData
        .find({username:input.username})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("common profile data post 02")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(()=>{
            console.log("common profile data post 03")
            return CommonProfileData
                .find({username:input.username})
                .count()
                .exec()
        })
        .then((countU)=>{
            console.log("common profile data post 04")
            countUser=countU;
            if(input.chathandle.length!==0)
                return CommonProfileData
                    .find({chathandle:input.chathandle})
                    .exec()
        })
        .then((chatData)=>{
            console.log("common profile data post 05")
            console.log(chatData)
            console.log(chatData.length)
            if (chatData.length >1   ||  (chatData.length ===1 && chatData[0].username !== input.username)) {
                console.log("common profile data post 06")
                return Promise.reject({
                    name: 'DuplicateChatHandleError',
                    message: 'Chat Handle already taken'
                });
            }
            else
            {
                console.log("common profile data post 07")

                if(countUser===0)
                {
                    console.log("common profile data post 08")
                    //create new record
                    input.datecreated=req.body.datecreated||Date.now();
                    console.log(input)

                    return CommonProfileData
                        .create(input)

                }
                else
                {
                    console.log("common profile data post 09")

                    input.dateupdated=req.body.dateupdated||Date.now();
                    console.log(input)


                    return CommonProfileData
                        .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
                }
            }
        })
        .then((preferenceData) => {
            console.log("common profile data post 10")
            res.status(201).json(preferenceData.apiRepr());
        })
        .catch(err => {
            console.log("common profile data post 11")
            console.error(err);
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }

            res.status(500).json({message: 'Internal server error'});
        });
});

router.put('/:uname', jsonParser, (req, res) => {
    console.log("common profile data put 01")
    let input = {};

    if (!(req.params.uname && req.body.username && req.params.uname === req.body.username)) {
        const message = (
            `Request path id (${req.params.uname}) and request body id ` +
            `(${req.body.uname}) must match`);
        //console.error(message);
        res.status(400).json({message: message});
    }

    input.username = req.body.username;
    //validate type
    let usertypes = config.usertype.split(' ');
    if(req.body.usertype!==undefined && req.body.usertype.length!==0) {
        if (usertypes.indexOf(req.body.usertype) === -1) {
            return res.status(422).json({message: 'Invalid User Type'});
        }
        input.usertype = req.body.usertype;
    }


    //validate status
    let accstatus = config.accountstatus.split(' ');
    if(req.body.accountstatus!==undefined && req.body.accountstatus.length!==0) {
        if (accstatus.indexOf(req.body.accountstatus) === -1) {
            return res.status(422).json({message: 'Invalid Account Status'});
        }
        input.accountstatus = req.body.accountstatus;
    }

    //validate status
    let gender = config.usergender.split(' ');
    if(req.body.gender!==undefined && req.body.gender.length!==0) {
        if (gender.indexOf(req.body.gender) === -1) {
            return res.status(422).json({message: 'Invalid Gender'});
        }
        input.gender = req.body.gender;
    }



    if(req.body.chathandle!==undefined && req.body.chathandle.length!==0) {
        input.chathandle = req.body.chathandle;
    }

    if(req.body.name!==undefined && req.body.name.length!==0) {
        input.name = req.body.name;
    }

    if(req.body.location!==undefined && req.body.location.length!==0) {
        input.location = req.body.location;
    }

    if(req.body.languages!==undefined && req.body.languages.length!==0) {
        input.languages = [];
        for(let i = 0;i<req.body.languages.length;i++)
        {
            input.languages.push(req.body.languages[i])
        }
    }
    console.log("common profile data put 02")

    input.dateupdated=req.body.dateupdated||Date.now();

    console.log(input)
    return AuthData
        .find({username:input.username})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("common profile data put 03")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(() => {
            return CommonProfileData
                .find({username:input.username})
                .count()
                .exec()
        })
        .then((count)=>{
            console.log("common profile data put 04")
            if(count === 0)
            {
                console.log("common profile data put 05")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
            if(input.chathandle.length!==0)
                return CommonProfileData
                    .find({chathandle:input.chathandle})
                    .exec()
        })
        .then((chatData)=>{
            console.log("common profile data put 06")
            //console.log(chatData)
            if (chatData.length >= 1) {
                console.log("common profile data put 07")

                if(chatData[0].username !== input.username){
                    console.log("common profile data put 08")

                    return Promise.reject({
                        name: 'DuplicateChatHandleError',
                        message: 'Chat Handle already taken'
                    });
                }


            }
            else
            {
                console.log("common profile data put 09")

                return CommonProfileData
                    .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
            }
        })
        .then(prefData => {
            console.log("common profile data put 10")
            //console.log(prefData)
            res.status(200).json(prefData.apiRepr())
        })
        .catch(err => {
            console.log("common profile data put 11")
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }
            console.log(err)
            res.status(500).json({message: 'Internal server error'})
        });

});

router.get('/:uname', (req, res) => {
    console.log("common profile data get 01")
    return AuthData
        .find({username: req.params.uname})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("common profile data get 02")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
        })
        .then(()=>{
            console.log("common profile data get 03")
            return CommonProfileData
                .find({username: req.params.uname})
        })
        .then(data => {
            console.log("common profile data get 04")
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(
            err => {
                console.log("common profile data get 05")
                //console.error(err);
                if (err.name === 'InvalidUserError') {
                    return res.status(422).json({message: err.message});
                }
                res.status(500).json({message: 'Internal server error'});
        });
});

router.get('/chathandles/chat', (req, res) => {
    console.log("chat handle 01")
    return CommonProfileData
        .distinct('chathandle')
        .exec()
        .then(data => {
            console.log("chat handle 02")
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(
            err => {
                console.log("chat handle 03")
                //console.error(err);
                if (err.name === 'InvalidUserError') {
                    return res.status(422).json({message: err.message});
                }
                res.status(500).json({message: 'Internal server error'});
            });
});

router.get('/chathandles/chatexists/:handle', (req, res) => {
    console.log("chat handle exists 01" + req.params.handle)
    return CommonProfileData
        .find({chathandle: req.params.handle})
        .count()
        .exec()
        .then(count => {
            if (count > 0) {
                console.log("chat handle exists 02")
                res.status(200).json({exists:true})
            }
            else {
                console.log("chat handle exists 03")

                res.status(200).json({exists: false})
            }
        })
        .catch(
            err => {
                console.log("chat handle exists 04")
                //console.error(err);
                res.status(500).json({message: 'Internal server error'});
            });
});

/*
db.commonprofiledatas.aggregate([
    {
        $lookup:
            {
                from: "providerprofiledatas",
                localField: "username",
                foreignField: "username",
                as: "inventory_docs"
            }
    },
      {
         $match:{
            "username": "provider1@gmail.com"
         }
      }
])
*/


router.get('/providers/list', (req, res) => {
    console.log("provider list get 01")
    let commonData = [];
    return CommonProfileData
        .find({usertype: 'PROVIDER'}).limit(4)
        .exec()
        .then(data => {
            if (data.length >= 0) {
                console.log("provider list get 02")
                commonData = data;
                var result = data.map(item => item.username);
                //console.log(result)
                return ProviderProfileData.find({"username":{$in : result}})
            }
            else {
                return Promise.reject();
            }
        })
        .then(data=> {
            console.log("provider list get 03")
            //console.log(data)
            data = data.sort(config.compareProfileData)
            commonData = commonData.sort(config.compareProfileData)

            if(data.length!==commonData.length)
            {
                console.log("provider list get 04")

                return Promise.reject();
            }
            else {
                console.log("provider list get 05")
                let result = [];
                for(var i=0;i<commonData.length;i++)
                {
/*                    console.log("---------------------------")
                    console.log(data[i])
                    console.log(commonData[i])
                    var x = Object.assign({},commonData[i],data[i])
                    console.log("xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx")
                    console.log(x)*/
                    result.push({
                        common: commonData[i],
                        providerdata:data[i]
                    })
                }
                res.status(200).json(result)
            }
        })
        .catch(
            err => {
                console.log("common profile data get 06")
                console.error(err);
                if (err.name === 'InvalidUserError') {
                    return res.status(422).json({message: err.message});
                }
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


