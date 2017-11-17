'use strict'

const mongoose = require('mongoose');
const config = require('../../config');

var dietCategories = config.dietCategories.split(' ');



var dietItemDetailSchema = mongoose.Schema({
    itemname: {type: String},//external as well
    itemcat: {type: String,enum:dietCategories}, //user input
    numcal: {type: Number}, //user input
    nf_calories: {type: Number},
    serving_qty: {type: Number}, //User input
    nf_qty: {type: Number},
    serving_unit: {type: String}, //external as well
    serving_weight_grams: {type: Number},
    nf_desc:{type:String}, //external as well
    brand_id:{type:String}, //external as well
    item_id:{type:String} //external as well
    
});

var dietItemSchema = mongoose.Schema({
    dietcat: {type: String,enum:dietCategories},
    dietitems: [{type: dietItemDetailSchema}],
    totcal: {type: Number}
});

var userDietSchema = mongoose.Schema({
    username: {type: String},
    items: [{type: dietItemDetailSchema}],
    grosscal:{type: Number},
    entrydate:{type: Date},
    datecreated:{type: Date, required: true},
    dateupdated:{type: Date}
});

userDietSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        username: this.username,
        items: this.items,
        grosscal: this.grosscal,
        entrydate: this.entrydate,
        datecreated: this.datecreated,
        dateupdated: this.dateupdated
    }
};

const UserDietSchema = mongoose.model('UserDietSchema',userDietSchema)

module.exports = {UserDietSchema};
