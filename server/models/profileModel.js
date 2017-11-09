'use strict'

const mongoose = require('mongoose');
const config = require('../../config');

var usertypes = config.usertype.split(' ');
var statuses = config.accountstatus.split(' ');
var genders = config.usergender.split(' ');
var servicetypes = config.servicetype.split(' ');
var standarddiagnosis = config.standarddiagnosis.split(' ');
var examOutcomeType = config.examOutcomeTypes.split(' ');


var commonProfileSchema = mongoose.Schema({
    username: {type: String, required: true, index: true},
    chathandle:{type:String, index: true},
    name: {type: String, required: true},
    usertype: {type: String, enum: usertypes},
    gender: {type: String, enum: genders},
    accountstatus: {type: String, enum: statuses},
    location:{type: String},
    longitude:{type: String},
    latitude:{type: String},
    languages:[{type:String}],
    datecreated:{type: Date, required: true},
    dateupdated:{type: Date}
});

var surveySchema = mongoose.Schema({
    questionid: {type: String},
    responseid: {type: String},
    response:{type:String}
});

var historySchema = mongoose.Schema({
    listPrescription: {type: String},
    listNonPrescription: {type: String},
    dateLastPhysical: {type: Date},
    lastPhysicalType:{type:String,enum:examOutcomeType},
    dateLastDental: {type: Date},
    lastDentalType:{type:String,enum:examOutcomeType},

    listOtherTest: {type: String},
    listDrugAllergies: {type: String},

    smoking: {type: Boolean},
    alcohol: {type: Boolean},

    stroke: {type: Boolean},
    arthritis: {type: Boolean},
    diabetes: {type: Boolean},
    anemia: {type: Boolean},
    asthma: {type: Boolean}
});


var consumerProfileSchema = mongoose.Schema({
    username: {type: String, required: true, index: true},
    preferredlanguage:{type:String},
    age:{type:Number},
    medHistorylist: {type: historySchema},
    oralassessment:[{type: surveySchema}],
    hygenescore:{type:Number},
    lastvisit:{type: Date},
    nextvisit:{type: Date},
    datecreated:{type: Date, required: true},
    dateupdated:{type: Date}
});

var providerProfileSchema = mongoose.Schema({
    username: {type: String, required: true, index: true},
    qualifications:[{type:String}],
    expertise: {type: String},
    servicetype: {type: String, enum: servicetypes, index: true},
    chat:{type: Boolean},
    datecreated:{type: Date, required: true},
    dateupdated:{type: Date}
});

commonProfileSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        username: this.username,
        chathandle:this.chathandle,
        name: this.name,
        usertype: this.usertype,
        gender: this.gender,
        accountstatus: this.accountstatus,
        location:this.location,
        longitude:this.longitude,
        latitude:this.latitude,
        languages:this.languages,
        datecreated:this.datecreated,
        dateupdated:this.dateupdated
    }
}

consumerProfileSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        username: this.username,
        age: this.age,
        preferredlanguage: this.preferredlanguage,
        conditionlist: this.conditionlist,
        medicationlist: this.medicationlist,
        healthscore: this.healthscore,
        lastvisit: this.lastvisit,
        nextvisit: this.nextvisit,
        datecreated: this.datecreated,
        dateupdated: this.dateupdated
    }
};

providerProfileSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        username: this.username,
        qualifications:this.qualifications,
        expertise: this.expertise,
        servicetype: this.servicetype,
        healthscore:this.healthscore,
        chat:this.chat,
        datecreated: this.datecreated,
        dateupdated: this.dateupdated
    }
};

const CommonProfileData = mongoose.model('CommonProfileData',commonProfileSchema)
const ConsumerProfileData = mongoose.model('ConsumerProfileData',consumerProfileSchema)
const ProviderProfileData = mongoose.model('ProviderProfileData',providerProfileSchema)

module.exports = {CommonProfileData,ConsumerProfileData,ProviderProfileData};
