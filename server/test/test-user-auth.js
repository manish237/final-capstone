const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const expect = require('chai').expect;

const should = chai.should();

const {RegisterData,PreferenceData,AddressHistData} = require('../server/models/models');
const {TEST_DATABASE_URL} = require('../../config');
const {app, runServer, closeServer} = require('../../server');

// This let's us make HTTP requests
// in our tests.
// see: https://github.com/chaijs/chai-http
chai.use(chaiHttp);
let existingUser;
let loginUser;
let loginPwd;
function seedRegisterData() {
    //console.info('seeding registerdata data');
    const seedData = [];
    let rec = {};
    for (let i=1; i<=10; i++) {
        rec = generateRegisterData();
        //console.log(rec)
        existingUser = rec.username;
        existingPwd = rec.password;
        seedData.push(rec);

    }
    // this will return a promise
    return RegisterData.insertMany(seedData);
}

function generateRegisterData(noHash=false) {
    //console.log("inside register data generator")
    let currTime = new Date();
    let uName = faker.internet.email();
    let pwd = faker.internet.password();
    loginUser = uName;
    loginPwd = pwd;

    let hashPwd = bcrypt.hashSync(pwd, 10);
    //console.log("Adding with user=" + uName + " password=" + pwd + " hashed password=" + hashPwd);
    return {
        username: uName,
        password: noHash===false?hashPwd:pwd,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address:{
            address1: faker.address.streetAddress(),
            address2: "",
            city: faker.address.city(),
            state: faker.address.state(),
            zip:faker.address.zipCode(),
            country: faker.address.country(),
            longitude: faker.address.longitude(),
            latitude: faker.address.latitude(),
        },
        vehicle:{},
        created: currTime//faker.date.recent()
    }
}

function generateUpdateData() {
    //console.log("inside register data generator")
    return {
        username : loginUser,
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        address:{
            address1: faker.address.streetAddress(),
            address2: "",
            city: faker.address.city(),
            state: faker.address.state(),
            zip:faker.address.zipCode(),
            country: faker.address.country(),
            longitude: faker.address.longitude(),
            latitude: faker.address.latitude(),
        }
    }
}


function tearDownDb() {
    //console.warn('Deleting database');
    return mongoose.connection.dropDatabase();
}

describe('Registration data resource', function() {

    before(function () {
        //console.log("before");
        return runServer(TEST_DATABASE_URL);
    });
    beforeEach(function() {
        //console.log("beforeeach");
        return seedRegisterData();
    });
    afterEach(function() {
        //console.log("aftereach");
        return tearDownDb();
    });
    after(function () {
        //console.log("after");
        return closeServer();
    });

    describe('Registration endpoint', function() {
        it('create a new user', function () {
            const newUser = generateRegisterData(true);
            return chai.request(app)
                .post('/auth/register')
                .send(newUser)
                .then(function (res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.should.include.keys('id', 'username', 'name_string', 'firstName', 'lastName', 'address_string', 'address', 'vehicle');
                    return RegisterData.findById(res.body.id);
                }).then(function(user) {
                    user.username.should.equal(newUser.username);
                    let localUserName = `${user.firstName} ${user.lastName}`;
                    localUserName.should.equal(`${newUser.firstName} ${newUser.lastName}`);
                    bcrypt.compareSync(newUser.password, user.password).should.be.true;
                });
        });
        it('registering an existing user', function() {
            //console.log("function")
            let newUser = generateRegisterData(true);

            newUser.username = existingUser;

            return chai.request(app)
                .post('/auth/register')
                .send(newUser)
                .catch(err=>{
                    //console.log(err)
                    err.should.have.status(422)
                });
        });
        it('registering a user with empty password', function() {
            //console.log("function")
            let newUser = generateRegisterData(true);

            newUser.password = "";

            return chai.request(app)
                .post('/auth/register')
                .send(newUser)
                .catch(err=>{
                    //console.log("err")
                    err.should.have.status(422)
                });
        });
    });
    describe('Login endpoint', function() {
        it('logging in as a valid new user', function () {
            //const newUser = generateRegisterData(true);
            let loginData = {
                username : loginUser,
                password : loginPwd
            }
            //console.log(loginData)
            return chai.request(app)
                .post('/auth/login')
                .send(loginData)
                .then(function (res) {
                    //console.log(res.body)
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.user.should.include.keys('id', 'username', 'name_string', 'firstName', 'lastName', 'address_string', 'address', 'vehicle');
                })
        });
        it('logging in with invalid  user', function() {
            //console.log("function")
            let loginData = {
                username : faker.internet.email(),
                password : faker.internet.password()
            }

            return chai.request(app)
                .post('/auth/login')
                .send(loginData)
                .catch(err=>{
                    //console.log(err)
                    err.should.have.status(422)
                });
        });
        it('logging in with wrong password', function() {
            let loginData = {
                username : loginUser,
                password : faker.internet.password()
            }

            return chai.request(app)
                .post('/auth/login')
                .send(loginData)
                .catch(err=>{
                    //console.log(err)
                    err.should.have.status(422)
//                    err.response.res.body.message.should.be("Incorrect password")
                });
        });
    });
    describe('reset password endpoint', function() {
        it('resetting password with valid details', function () {
            //const newUser = generateRegisterData(true);
            let newPass = faker.internet.password();
            let loginData = {
                username : loginUser,
                password : newPass
            }
            //console.log(loginData)
            return chai.request(app)
                .put(`/auth/reset/${loginData.username}`)
                .send(loginData)
                .then(function (res) {
                    res.should.have.status(200);
                })
                .then(()=>{
                    // console.log("second then")
                    // console.log("user=" + loginUser)
                    // console.log("using pass=" + newPass)
                    return chai.request(app)
                        .post(`/auth/login`)
                        .send(loginData)
                })
                .then(function (res) {
                    // console.log("res2====")
                    // console.log(res.body)
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.user.should.include.keys('id', 'username', 'name_string', 'firstName', 'lastName', 'address_string', 'address', 'vehicle');
                })
        });
        it('resetting password for invalid  user', function() {
            //console.log("function")
            let loginData = {
                username : faker.internet.email(),
                password : faker.internet.password()
            }

            return chai.request(app)
                .put(`/auth/reset/${loginData.username}`)
                .send(loginData)
                .catch(err=>{
                    //console.log(err)
                    err.should.have.status(422)
                });
        });
    });
    describe('Registration data GET endpoint', function() {
        it('get existing user', function () {
            return chai.request(app)
                .get(`/user/data/${loginUser}`)
                .then(function (res) {
                    //console.log(res.body)
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.registerData[0].should.include.keys('id', 'username', 'name_string', 'firstName', 'lastName', 'address_string', 'address', 'vehicle');
                    expect(res.body.registerData).to.have.length(1);
                })
        });
        it('get invalid user', function() {
            //console.log("function")
            let localUser = faker.internet.email();

            return chai.request(app)
                .get(`/user/data/${localUser}`)
                .catch(err=>{
                    //console.log("err")
                    err.should.have.status(422)
                });
        });
    });
    describe('Registration data PUT endpoint', function() {
        it('update existing user', function () {
            let updateRecord = generateUpdateData();

            // console.log("updateRecord====");
            // console.log(updateRecord);

            return chai.request(app)
                .put(`/user/data/${loginUser}`)
                .send(updateRecord)
                .then(function (res) {
                    //console.log(res.body)
                    res.should.have.status(200);
                })
                .then(()=>{
                    // console.log("second then")
                    // console.log("user=" + loginUser)
                    return chai.request(app)
                        .get(`/user/data/${loginUser}`)
                })
                .then(function (res) {
                    console.log("res2====")
                    console.log(res.body)
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.registerData[0].should.include.keys('id', 'username', 'name_string', 'firstName', 'lastName', 'address_string', 'address', 'vehicle');
                    let localVar = `${updateRecord.firstName} ${updateRecord.lastName}`;
                    localVar.should.equal(res.body.registerData[0].name_string);
                    let addr2 = updateRecord.address.address2 === undefined ? '' : updateRecord.address.address2;
                    localVar = `${updateRecord.address.address1} ${addr2} ${updateRecord.address.city} ${updateRecord.address.state} ${updateRecord.address.zip} ${updateRecord.address.country}`.trim();
                    localVar.should.equal(res.body.registerData[0].address_string);
                })
        });
        it('update invalid user', function() {
            //console.log("function")
            let localUser = faker.internet.email();
            let updateRecord = generateUpdateData();
            updateRecord.userName = localUser;
            return chai.request(app)
                .put(`/user/data/${localUser}`)
                .send(updateRecord)
                .catch(err=>{
                    //console.log("err")
                    err.should.have.status(400)
                });
        });
    });
});