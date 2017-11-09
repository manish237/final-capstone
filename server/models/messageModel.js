'use strict'

const mongoose = require('mongoose');
const config = require('../../config');

var commtypes = config.commtype.split(' ');

var communicationSchema = mongoose.Schema({
    fromusername: {type: String, index: true},
    tousername: {type: String, index: true},
    fromchathandle: {type: String, index: true},
    tochathandle: {type: String, index: true},
    message: {type: String},
    read:{type:Boolean},
    commtype: {type: String, enum: commtypes},
    datecreated:{type: Date, required: true}
});

communicationSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        fromusername: this.fromusername,
        tousername:this.tousername,
        fromchathandle: this.fromchathandle,
        tochathandle: this.tochathandle,
        message:this.message,
        commtype:this.commtype,
        read:this.read,
        datecreated: this.datecreated
    }
};

const CommunicationData = mongoose.model('CommunicationData',communicationSchema);

module.exports = {CommunicationData};

