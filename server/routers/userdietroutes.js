'use strict'

const express = require('express');
const router = express.Router();
const config = require('../../config')
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {UserDietSchema} = require('../models/dietModel');

router.use(bodyParser.urlencoded({
    extended: true
}));


router.post('/', jsonParser, (req, res) => {
    console.log("user diet post 01")
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

    var dietCategories = config.dietCategories.split(' ');
    input.username = req.body.username;

    if(req.body.grosscal!==undefined && req.body.grosscal.length!==0) {
        input.grosscal = req.body.grosscal;
    }

    if(req.body.entrydate!==undefined && req.body.entrydate.length!==0) {
        input.entrydate = req.body.entrydate;
    }

    if(req.body.items!==undefined && req.body.items.length!==0) {
        input.items=[];
        for(let i = 0;i<req.body.items.length;i++)
        {
            console.log("outer loop")

            // let itemsObj = {};
            /*if(req.body.items[i].dietcat!==undefined && req.body.items[i].dietcat!==0) {
                itemsObj.dietcat = req.body.items[i].dietcat
            }

            if(req.body.items[i].totcal!==undefined && req.body.items[i].totcal!==0) {
                itemsObj.totcal = req.body.items[i].totcal
            }
*/
            /*if(req.body.items[i].dietitems!==undefined && req.body.items[i].dietitems.length!==0) {
                itemsObj.dietitems=[]
                for(let j = 0;j<req.body.items[i].dietitems.length;j++){*/
            let itemObj = {};
            // console.log("inner loop")
            // console.log(req.body.items[i].dietitems[j])

            if(req.body.items[i].itemcat!==undefined && req.body.items[i].itemcat!==0) {
                if (dietCategories.indexOf(req.body.items[i].itemcat) === -1) {
                    return res.status(422).json({message: 'Invalid Meal Type'});
                }
                itemObj.itemcat = req.body.items[i].itemcat
            }

            if (req.body.items[i].itemname !== undefined && req.body.items[i].itemname.length !== 0) {
                itemObj.itemname = req.body.items[i].itemname
            }

            if (req.body.items[i].numcal !== undefined && req.body.items[i].numcal !== 0) {
                itemObj.numcal = req.body.items[i].numcal
            }
    
            if (req.body.items[i].nf_calories !== undefined && req.body.items[i].nf_calories !== 0) {
                itemObj.nf_calories = req.body.items[i].nf_calories
            }
            
            if (req.body.items[i].serving_qty !== undefined && req.body.items[i].serving_qty !== 0) {
                itemObj.serving_qty = req.body.items[i].serving_qty
            }
    
            if (req.body.items[i].nf_qty !== undefined && req.body.items[i].nf_qty !== 0) {
                itemObj.nf_qty = req.body.items[i].nf_qty
            }

            if (req.body.items[i].serving_unit !== undefined && req.body.items[i].serving_unit.length !== 0) {
                itemObj.serving_unit = req.body.items[i].serving_unit
            }

            if (req.body.items[i].serving_weight_grams !== undefined && req.body.items[i].serving_weight_grams !== 0) {
                itemObj.serving_weight_grams = req.body.items[i].serving_weight_grams
            }
    
            if (req.body.items[i].nf_desc !== undefined && req.body.items[i].nf_desc.length !== 0) {
                itemObj.nf_desc = req.body.items[i].nf_desc
            }

            if (req.body.items[i].brand_id !== undefined && req.body.items[i].brand_id.length !== 0) {
                itemObj.brand_id = req.body.items[i].brand_id
            }

            if (req.body.items[i].item_id !== undefined && req.body.items[i].item_id.length !== 0) {
                itemObj.item_id = req.body.items[i].item_id
            }

            // console.log(itemObj)
            // itemsObj.dietitems.push(itemObj)
/*                }
            }*/

            console.log(itemObj)
            input.items.push(itemObj)
            itemObj={};
        }
    }

    console.log(input)
    // return res.status(500).json({message: 'Internal server error'});
    return UserDietSchema
        .find({username:input.username,entrydate:input.entrydate})
        .count()
        .exec()
        .then(count => {
            if(count===0)
            {
                console.log("user diet post 02")
                //create new record
                input.datecreated=req.body.datecreated||Date.now();
                console.log(input)

                return UserDietSchema
                    .create(input)

            }
            else
            {
                console.log("user diet post 03")

                input.dateupdated=req.body.dateupdated||Date.now();
                console.log(input)


                return UserDietSchema
                    .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
            }
        })
        .then(data => {
            console.log("user diet post 04")
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(err => {
            console.log("user diet post 05")
            console.error(err);
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }

            res.status(500).json({message: 'Internal server error'});
        });
});

router.put('/:uname', jsonParser, (req, res) => {
    console.log("user diet put 01")
    let input = {};

    if(req.body.item!==undefined && req.body.item.length!==0) {
        input.item = [];
        for(let i = 0;i<req.body.item.length;i++)
        {
            console.log(req.body.languages[i])
            input.item.push(req.body.languages[i])
        }
    }


    if(req.body.grosscal!==undefined && req.body.grosscal.length!==0) {
        input.grosscal = req.body.grosscal;
    }

    if(req.body.entrydate!==undefined && req.body.entrydate.length!==0) {
        input.entrydate = req.body.entrydate;
    }
    console.log("user diet put 02")

    input.dateupdated=req.body.dateupdated||Date.now();

    console.log(input)
    return UserDietSchema
        .find({username:input.username})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("user diet post 03")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
            else
            {
                console.log("user diet put 04")

                return UserDietSchema
                    .findOneAndUpdate({username: input.username}, {$set: input}, {new: true})
            }
        })
        .then(data => {
            console.log("user diet put 05")
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(err => {
            console.log("user diet put 06")
            if (err.name === 'InvalidUserError' || err.name === 'DuplicateChatHandleError') {
                return res.status(422).json({message: err.message});
            }
            console.log(err)
            res.status(500).json({message: 'Internal server error'})
        });

});

router.get('/:uname', (req, res) => {
    console.log("user diet get 01")
    return UserDietSchema
        .find({username: req.params.uname})
        .count()
        .exec()
        .then(count => {
            if (count === 0) {
                console.log("user diet get 02")
                return Promise.reject({
                    name: 'InvalidUserError',
                    message: 'username not found'
                });
            }
            else {
                console.log("user diet get 03")
                return UserDietSchema
                    .find({username: req.params.uname})
            }
        })
        .then(data => {
            console.log("user diet get 04")
            //console.log(addressHistData)
            res.status(200).json(data)
        })
        .catch(
            err => {
                console.log("user diet get 05")
                //console.error(err);
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


