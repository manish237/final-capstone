'use strict'

const mongoose = require('mongoose');
const config = require('../../config');


var qbCategories = config.qbCategories.split(' ');
var qbRespType = config.qbRespTypes.split(' ');


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
    respId: {type: String, index: true},
    respType:{type: String, enum:qbRespType},
    respWeight:{type: Number},
    response: {type: String, index: true}
});


var questionBankSchema = mongoose.Schema({
    category:{type: String, enum: qbCategories},
    quesId:{type: String, index: true},
    question: {type: String, index: true},
    quesType:{type: String, enum:qbRespType},
    response1: {type: responseSchema},
    response2: {type: responseSchema},
    response3: {type: responseSchema},
    response4: {type: responseSchema}
});

locationSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        country: this.country,
        state:this.state,
        city: this.city
    };
};

languageSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        code: this.code,
        name:this.name,
        nativeName: this.nativeName
    };
};

questionBankSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        quesId:this.quesId,
        question: this.question,
        response1:this.response1,
        response2:this.response2,
        response3:this.response3,
        response4:this.response4
    };
};

const LocationSchema = mongoose.model('LocationSchema',locationSchema);
const LanguageSchema = mongoose.model('LanguageSchema',languageSchema);
const QuestionBankSchema = mongoose.model('QuestionBankSchema',questionBankSchema);


module.exports = {LocationSchema,LanguageSchema,QuestionBankSchema};

