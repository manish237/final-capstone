"use strict"

let config = {};

config.mongoURI = {
    development: process.env.DATABASE_URL ||
        global.DATABASE_URL ||
        'mongodb://localhost/final-capstone',
    production: process.env.DATABASE_URL ||
        global.DATABASE_URL ||
        'mongodb://localhost/final-capstone',
    test:   process.env.TEST_DATABASE_URL ||
            "mongodb://localhost/test-final-capstone"
};

config.compareProfileData = function (a,b) {
    if(a.username>b.username)
        return -1;
    else if(a.username<b.username)
        return 1;
    else
        return 0;
}

config.PORT = process.env.PORT || 8080

config.usertype = 'CONSUMER PROVIDER'
config.accountstatus = 'ACTIVE PENDING CLOSED SUSPENDED'
config.usergender = 'MALE FEMALE OTHER'
config.servicetype = 'CONTENT CONSULTATION BOTH'
config.commtype = 'MESSAGE CHAT'
config.standarddiagnosis = 'CAVITIES CARIES DIABETES'
config.qbCategories = 'HISTORY HYGENE'
config.qbRespTypes = 'RADIO TEXT DATE CHECKBOX'
config.dietCategories = 'BREAKFAST LUNCH DINNER SNACKS'
config.examOutcomeTypes = 'NORMAL ABNORMAL NEVER NOREMEMBER'


module.exports = config;

