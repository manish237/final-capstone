'use strict'

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var authSchema = mongoose.Schema({
    username:{type:String, required:true, unique:true, index: true},
    password: {type: String, required: true},
    datecreated:{type: Date, required: true},
    dateupdated:{type: Date}
});

authSchema.methods.validatePassword = function(password) {
    return bcrypt.compare(password, this.password);
}

authSchema.statics.hashPassword = function(password) {
    return bcrypt.hash(password, 10);
}

authSchema.methods.apiRepr = function() {
    return {
        id: this._id,
        username: this.username,
        date_created: this.datecreated,
        date_updated: this.dateupdated
    };
}

const AuthData = mongoose.model('AuthData',authSchema)

module.exports = {AuthData};
