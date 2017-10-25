'use strict'

const mongoose = require('mongoose');
const config = require('../../config');


var qbCategories = config.qbCategories.split(' ');


var locationSchema = mongoose.Schema({
    country: {type: String, index: true},
    state: {type: String, index: true},
    city: {type: String, index: true}
});

var languageSchema = mongoose.Schema({
    code: {type: String, index: true},
    name: {type: String, index: true},
    nativeName: {type: String}
});

var responseSchema = mongoose.Schema({
    respId: {type: Number, index: true},
    response: {type: String, index: true}
});


var questionBankSchema = mongoose.Schema({
    category:{type: String, enum: qbCategories},
    question: {type: String, index: true},
    response1: {type: responseSchema},
    response2: {type: responseSchema},
    response3: {type: responseSchema},
    response4: {type: responseSchema},
    responsetxt: {type: String}
});

locationSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        country: this.country,
        state:this.state,
        city: this.city
    }
};

languageSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        code: this.code,
        name:this.name,
        nativeName: this.nativeName
    }
};

questionBankSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        question: this.question,
        response1:{
            respId: this.respId,
            response: this.response
        },
        response2:{
            respId: this.respId,
            response: this.response
        },
        response3:{
            respId: this.respId,
            response: this.response
        },
        response4:{
            respId: this.respId,
            response: this.response
        },
        responsetxt:this.responsetxt
    }
};

const LocationSchema = mongoose.model('LocationSchema',locationSchema);
const LanguageSchema = mongoose.model('LanguageSchema',languageSchema);
const QuestionBankSchema = mongoose.model('QuestionBankSchema',questionBankSchema);


module.exports = {LocationSchema,LanguageSchema,QuestionBankSchema};

