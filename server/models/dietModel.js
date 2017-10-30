'use strict'

const mongoose = require('mongoose');
const config = require('../../config');

var dietCategories = config.dietCategories.split(' ');



var dietItemDetailSchema = mongoose.Schema({
    itemname: {type: String},
    numcal: {type: Number}
});

var dietItemSchema = mongoose.Schema({
    dietcat: {type: String,enum:dietCategories},
    dietitems: [{type: dietItemDetailSchema}],
    totcal: {type: Number}
});

var userDietSchema = mongoose.Schema({
    username: {type: String},
    items: [{type: dietItemSchema}],
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
