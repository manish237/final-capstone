const {BasicStrategy} = require('passport-http');
const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const queryParser = bodyParser.urlencoded({ extended: true });
const config = require("../../config")

const mongoose = require('mongoose');
const {AuthData} = require('../models/authModel');
const {CommonProfileData,ConsumerProfileData,ProviderProfileData} = require('../models/profileModel');


const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const localStrategy = new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    session: false
},(username, password, callback) => {
    let user;
    AuthData
        .findOne({username: username})
        .exec()
        .then(_user => {
            user = _user;
            if (!user) {
                return callback(null, false, {message: 'Incorrect username'});
            }
            return user.validatePassword(password);
        })
        .then(isValid => {
            if (!isValid) {
                return callback(null, false, {message: 'Incorrect password'});
            }
            else {
                return callback(null, user.apiRepr())
            }
        })
        .catch(err => {
            //console.log("err")
            //console.error(err);
            //console.log("in reset 08")
            return callback(null, false, {message: 'Incorrect username'});

        });
});


passport.use(localStrategy);

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});



router.use(passport.initialize());
router.use(passport.session());
router.use(queryParser);





router.post('/register', jsonParser, (req, res) => {
    console.log("register 01")
    console.log(req.body)
    const requiredFields = ['username', 'password', 'name', 'type'];

    for (let i=0; i<requiredFields.length; i++) {
        const field = requiredFields[i];
        if (!(field in req.body)) {
            const message = `Missing \`${field}\` in request body`
            //console.error(message);
            return res.status(400).send(message);
        }
    }

    let {username, password, name, type} = req.body;
    if (typeof username !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: username'});
    }

    //validate username
    username = username.trim();

    if (username === '') {
        return res.status(422).json({message: 'Incorrect field length: username'});
    }

    //validate password
    if (!(password)) {
        return res.status(422).json({message: 'Missing field: password'});
    }

    if (typeof password !== 'string') {
        return res.status(422).json({message: 'Incorrect field type: password'});
    }

    password = password.trim();

    if (password === '') {
        return res.status(422).json({message: 'Incorrect field length: password'});
    }

    //validate type
    var usertypes = config.usertype.split(' ');
    if(usertypes.indexOf(type) === -1){
        return res.status(422).json({message: 'Incorrect User Type'});
    }


    //console.log(req.body)
    //set longitude/latitude using google API
    let regData = {};
    return AuthData
        .find({username})
        .count()
        .exec()
        .then(count => {
            console.log("register 03 " + count)

            if (count > 0) {
                return Promise.reject({
                    name: 'AuthenticationError',
                    message: 'username already taken'
                });
            }
            // if no existing user, hash password
            return AuthData.hashPassword(password)
        })
        .then(hash => {
            console.log("register 04 " + hash)

            return AuthData
                .create({
                    username: req.body.username,
                    password: hash,
                    datecreated: req.body.created || Date.now()
                })
        })
        .then(registerData=>{

            "use strict";
            console.log("register 05 ")
            // console.log(registerData)
            regData=registerData;
            return CommonProfileData
                .create({
                    username: req.body.username,
                    name: req.body.name,
                    usertype:req.body.type,
                    accountstatus:type===usertypes[0]?'ACTIVE':'PENDING',
                    datecreated: req.body.created || Date.now()
                })
        })
        .then(
            data => {
                console.log("register 06 ")
                // console.log(data)
                // console.log(regData)
                return res.status(200).json(data.apiRepr())
            })
        .catch(err => {
            console.error(err);
            //console.log("in register 08")

            if (err.name === 'AuthenticationError') {
                return res.status(422).json({message: err.message});
            }
            res.status(500).json({message: 'Internal server error'});
        });
});

router.post('/login',jsonParser,(req, res) => {
    console.log("login 01")
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            //console.log(err)

            return res.status(500).json({message: 'Unknown Error'})
        }
        if(!user) //false or auth error
        {

            return res.status(422).json({message: info.message});
        }
        else
        {

            return res.status(200).json({user: user});
        }
    })(req, res);
});


router.put('/reset/:uname', jsonParser, (req, res) => {
    if (!(req.params.uname && req.body.username && req.params.uname === req.body.username)) {
        console.log("reset login 01")
        const message = (
            `Request path id (${req.params.uname}) and request body id ` +
            `(${req.body.uname}) must match`);
        //console.error(message);
        res.status(400).json({message: message});
    }
    let {username, password} = req.body;
    if (!(password)) {
        //console.log("reset login 02")
        return res.status(422).json({message: 'Missing field: password'});
    }

    if (typeof password !== 'string') {
        //console.log("reset login 03")
        return res.status(422).json({message: 'Incorrect field type: password'});
    }

    password = password.trim();

    if (password === '') {
        //console.log("reset login 04")
        return res.status(422).json({message: 'Incorrect field length: password'});
    }

    return AuthData
        .find({username})
        .count()
        .exec()
        .then(count => {
            console.log("reset login 02")
            if (count == 0) {
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
            return AuthData.hashPassword(password)
        })
        .then(hash => {
            console.log("reset login 03")
            return AuthData
                .findOneAndUpdate({username: username}, {$set: {password: hash,dateupdated: Date.now()}})
                .exec()
        })
        .then(prefData => {
            console.log("reset login 04")
            console.log(prefData)
            return res.status(200).json(prefData.apiRepr())
        })
        .catch(err => {
            //console.log("err")
            //console.error(err);
            //console.log("in reset 08")

            if (err.name === 'InvalidUserError') {
                return res.status(422).json({message: err.message});
            }
            res.status(500).json({message: 'Internal server error'});
        });
})

router.get('/exists/:uname', jsonParser, (req, res) => {
    console.log("exists 01")

    return AuthData
        .find({username: req.params.uname})
        .count()
        .exec()
        .then(count => {
            if (count > 0) {
                console.log("exists 02")
                res.status(200).json({exists:true})
            }
            else {
                console.log("exists 03")

                res.status(200).json({exists: false})
            }
        })
        .catch(
            err => {
                console.log("exists 04")
                //console.error(err);
                if (err.name === 'InvalidUserError') {
                    return res.status(422).json({message: err.message});
                }
                res.status(500).json({message: 'Internal server error'});
            });

});


module.exports = router;