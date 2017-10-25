"use strict"

angular.module('ctrlLibrary', ['apiLibrary','apiLibraryConstants','angucomplete-alt','ui.select', 'ngSanitize'])


.controller('MainController',['$scope','$rootScope','$timeout','providerList','unameExists','registration','instantFood','login','commondata','consumerdata','providerdata','_','instantLoc','resetLogin','getLang','commondataUpd','consumerdataUpd','providerdataUpd','messagePost',function ($scope, $rootScope,$timeout,providerList,unameExists,registration,instantFood,login,commondata,consumerdata,providerdata,_,instantLoc,resetLogin,getLang,commondataUpd,consumerdataUpd,providerdataUpd,messagePost) {
    let ctrl = this;
    console.log("MainCtrl");
    $scope.test = "my test data"
    ctrl.match = true;
    ctrl.gPlace;
    // console.log(ctrl.gPlace)
    // console.log(ctrl.chosenPlace)
    //
    // console.log(ctrl.testText)
    // console.log(ctrl.chosenPlaceDetails)
    getLang().then(function (data) {
        // console.log(data);
        ctrl.languages = data;
    })
    $scope.$watch('ctrl.chosenPlace',function (newVal) {
        ctrl.chosenPlace = newVal;

        //console.log("chosenPlace--" + newVal);
    })

    $scope.$watch('ctrl.chosenPlaceDetails',function (newVal) {
        ctrl.chosenPlaceDetails = newVal;

        //console.log("chosenPlaceDetails--");
        //console.log(newVal)
        // console.log(ctrl.chosenPlaceDetails.geometry.location.lat())

    })




    $scope.$watch('ctrl.selectedLangs',function (newVal) {
        //console.log("selectedLangs--");
        ctrl.selectedLangs = newVal;

        //console.log(newVal)
    })

    $scope.$watch('ctrl.selectedPrefLang',function (newVal) {
        //console.log("selectedPrefLang--");
        ctrl.selectedPrefLang = newVal;
        //console.log(newVal)

    })

    /*    providerList().then(function (data) {
            console.log(data[0])
            $scope.providers = data;
        })*/

/*    var test1 = instantFood("Chhole Bhature").then(function (data) {
        console.log(data)
    });
    console.log("test1=")
    console.log(test1)*/


/*    var test1 = unameExists("provider1@gmail.com")/!*.then(function (data) {
        console.log(data)
    });*!/
    console.log("test1=")
    console.log(test1)

    var test2 = unameExists("pasdasdasd1@gmail.com")/!*.then(function (data) {
        console.log(data)
    });*!/
    console.log("test2=" )
    console.log(test2)*/

    ctrl.submit = function(form){
        //console.log(form.$valid)
        if(form.$valid==true)
        {
            ctrl.validForm=true;

            var reqBody = {
                "username":ctrl.uname,
                "password":ctrl.pwd,
                "name":ctrl.name,
                "type":ctrl.utype
            }
            //console.log(reqBody);
            registration(reqBody).then(function (data) {
                //console.log(data)
                if(data.error)
                    ctrl.errorMessage = data.error;
            })


        }
    }

	ctrl.loginSubmit = function(form){
	        //console.log(form.$valid)
        var theResults = [];

        if(form.$valid==true)
	        {
	            ctrl.validForm=true;

	            var reqBody = {
	                "username":ctrl.loginUname,
	                "password":ctrl.loginPwd,
	            }
	            //console.log(reqBody);
	            let commoninfo={};
                login(reqBody)
                    .then(data => {
                        if(data.error)
                            ctrl.errorMessage = data.error;
                        else {
                                //console.log("login")
                                //console.log(data)
                            theResults.push(data);
                                return commondata(ctrl.loginUname)
                            }
                    })
                    .then(dataCommon=>{
                        if(dataCommon.error)
                            ctrl.errorMessage = dataCommon.error;
                        else {
                                //console.log(dataCommon)
                                commoninfo = dataCommon;
                                //console.log(dataCommon[0].usertype)
                            theResults.push(dataCommon);

                            if (dataCommon[0].usertype === 'CONSUMER') {
                                    return consumerdata(ctrl.loginUname)
                                }
                                else if (dataCommon[0].usertype === 'PROVIDER') {
                                    return providerdata(ctrl.loginUname)
                                }
                        }
                    })
                    .then(dataAdditional=> {
                        "use strict";
                        //console.log(dataAdditional)
                        theResults.push(dataAdditional);

                    })
                //console.log(theResults)
	        }
	    }
    ctrl.loginResetSubmit = function(form){
	    //console.log("reset submit")
        //console.log(form.$valid)
        var theResults = [];

        if(form.$valid==true)
        {
            ctrl.validForm=true;

            var reqBody = {
                "username":ctrl.resetUname,
                "password":ctrl.pwd,
            }
            //console.log(reqBody);
            let commoninfo={};
            resetLogin(reqBody)
                .then(data => {
                    if(data.error)
                        ctrl.errorMessage = data.error;
                    else {
                        //console.log("login")
                        //console.log(data)
                        return data
                    }
                })
        }
    }

    /*username: {type: String, required: true, index: true},
    chathandle:{type:String, index: true},
    name: {type: String, required: true},
    usertype: {type: String, enum: usertypes},
    gender: {type: String, enum: genders},
    accountstatus: {type: String, enum: statuses},
    location:{type: String},
    longitude:{type: String},
    latitude:{type: String},
    languages:{type:String},*/
/*
    username: {type: String, required: true, index: true},
    age:{type:Number},
    preferredlanguage:{type:String},
    conditionlist: [{type: String}],
        medicationlist: [{type: String}],
        healthscore:{type:Number},
    lastvisit:{type: Date},
    lastvisitDiagnosis:[{type: String,enum:standarddiagnosis}],*/

    ctrl.submitConsumerProfile = function(form){
        //console.log("reset submitProfile")
        //console.log(form.$valid)
        var theResults = [];
        if(form.$valid==true)
        {
            ctrl.validForm=true;
            var dataComm = {
                username : ctrl.loginUname,
                name:ctrl.name,
                gender:ctrl.gender!==undefined?ctrl.gender:"",
                chathandle:ctrl.chathandle!==undefined?ctrl.chathandle:"",
                languages:ctrl.selectedLangs!==undefined?ctrl.selectedLangs.map(o=>o.name):[],
                location:ctrl.chosenPlace!==undefined?ctrl.chosenPlace:"",
                longitude:ctrl.chosenPlaceDetails!==undefined?ctrl.chosenPlaceDetails.geometry.location.lng():"",
                latitude:ctrl.chosenPlaceDetails!==undefined?ctrl.chosenPlaceDetails.geometry.location.lat():""
            }


            //console.log("req dataComm")
            //console.log(dataComm)
            var dataCons =   this.dataCons = {
                    username: ctrl.loginUname,
                    age:ctrl.age!==undefined?ctrl.age:"",
                    preferredlanguage: ctrl.selectedPrefLang !== undefined ? ctrl.selectedPrefLang.name : ""
            }

            //console.log("req dataCons")
            //console.log(dataCons)

            var reqBody = {
                "username":ctrl.resetUname,
                "password":ctrl.pwd,
            }
            //console.log(reqBody);
            let commoninfo={};
            commondataUpd(dataComm)
                .then(data => {
                    if(data.error)
                        ctrl.errorMessage = data.error;
                    else {
                        //console.log("dataComm")
                        //console.log(data)
                        if(dataCons!==undefined)
                            return consumerdataUpd(dataCons)
                        else
                            return data;
                    }
                })
                .then(data => {
                    if(data.error)
                        ctrl.errorMessage = data.error;
                    else {
                        //console.log("dataCons")
                        //console.log(data)
                        return data;
                    }
                })
        }
    }


    ctrl.submitProviderProfile = function(form){
        console.log("submitProviderProfile")
        //console.log(form.$valid)
        var theResults = [];
        if(form.$valid==true)
        {
            ctrl.validForm=true;
            var dataComm = {
                username : ctrl.loginUname,
                name:ctrl.name,
                gender:ctrl.gender!==undefined?ctrl.gender:"",
                chathandle:ctrl.chathandle!==undefined?ctrl.chathandle:"",
                languages:ctrl.selectedLangs!==undefined?ctrl.selectedLangs.map(o=>o.name):[],
                location:ctrl.chosenPlace!==undefined?ctrl.chosenPlace:"",
                longitude:ctrl.chosenPlaceDetails!==undefined?ctrl.chosenPlaceDetails.geometry.location.lng():"",
                latitude:ctrl.chosenPlaceDetails!==undefined?ctrl.chosenPlaceDetails.geometry.location.lat():""
            }


            console.log("req dataComm")
            console.log(dataComm)
            var chatAvailability = false;
            if(ctrl.chatAvail!==undefined){
                if(ctrl.chatAvail==='YES')
                    chatAvailability=true;
            }

            var dataPro =   this.dataCons = {
                username: ctrl.loginUname,
                qualifications:ctrl.qual!==undefined?ctrl.qual.split(','):"",
                expertise:ctrl.expert!==undefined?ctrl.expert:"",
                servicetype:ctrl.servicetype!==undefined?ctrl.servicetype:"",
                chat:chatAvailability!==undefined?chatAvailability:"",
            }

            console.log("req dataPro")
            console.log(dataPro)

            //console.log(reqBody);
            commondataUpd(dataComm)
                .then(data => {
                    if(data.error)
                        ctrl.errorMessage = data.error;
                    else {
                        //console.log("dataComm")
                        //console.log(data)
                        if(dataPro!==undefined)
                            return providerdataUpd(dataPro)
                        else
                            return data;
                    }
                })
                .then(data => {
                    if(data.error)
                        ctrl.errorMessage = data.error;
                    else {
                        //console.log("dataCons")
                        //console.log(data)
                        return data;
                    }
                })
        }
    }



    ctrl.getFood = function (userInputString, timeoutPromise) {
        //console.log(userInputString)
        //console.log(timeoutPromise)

        return instantFood(userInputString).then(function (data) {
            //console.log(data)
            var a=[]
            if(data.branded)
            {
                for(var i=0;i<data.branded.length;i++) {
                    var obj = _.pick(data.branded[i], 'food_name', 'photo');
                    var desc = data.branded[i].nf_calories + "cal for " + data.branded[i].serving_qty + " " + data.branded[i].serving_unit;
                    obj.description = desc;
                    a.push(obj);
                }
            }
            //console.log(a)
            if(data.common)
            {
                for(var i=0;i<data.common.length;i++) {

                    var obj = _.pick(data.common[i], 'food_name', 'photo');
                    var desc = data.common[i].nf_calories + " Cal for " + data.common[i].serving_qty + " " + data.common[i].serving_unit;
                    obj.description = desc;
                    a.push(obj);
                    // a.push( _.map(data.common, function(o) { return _.pick(o, 'food_name','photo') }));
                }
            }
            //console.log(a)
            // return  {"data": [{ "id": "1" }, { "id": "2" }, { "id": "3" }]};
             return  {"data": a};
        })
    }

    ctrl.getLoc = function (userInputString, timeoutPromise) {
        //console.log(userInputString)
        //console.log(timeoutPromise)

        return instantLoc(userInputString).then(function (data) {
            //console.log(data)
            var a=[]
            /*if(data.branded)
            {
                for(var i=0;i<data.branded.length;i++) {
                    var obj = _.pick(data.branded[i], 'food_name', 'photo');
                    var desc = data.branded[i].nf_calories + "cal for " + data.branded[i].serving_qty + " " + data.branded[i].serving_unit;
                    obj.description = desc;
                    a.push(obj);
                }
            }
            //console.log(a)
            if(data.common)
            {
                for(var i=0;i<data.common.length;i++) {

                    var obj = _.pick(data.common[i], 'food_name', 'photo');
                    var desc = data.common[i].nf_calories + " Cal for " + data.common[i].serving_qty + " " + data.common[i].serving_unit;
                    obj.description = desc;
                    a.push(obj);
                    // a.push( _.map(data.common, function(o) { return _.pick(o, 'food_name','photo') }));
                }
            }*/
            //console.log(a)
            // return  {"data": [{ "id": "1" }, { "id": "2" }, { "id": "3" }]};
            return  {"data": a};
        })
    }


    // console.log("name")
    // console.log(ctrl.name)
    // console.log("users")
    //
    // console.log(ctrl.users)
    ctrl.connectToChat = function(form){
        ctrl.messages = [];

        //console.log("reset submitProfile")
        //console.log(form.$valid)
        var theResults = [];
        if(form.$valid==true)
        {

            var socket = io.connect({query:"name="+ctrl.loginUname});

            socket.on('init', function (data) {
                console.log("init")
                // console.log($scope)
                console.log(data)
                console.log()
                $rootScope.$apply(function () {
                    // ctrl.newCustomers.push(data.customer);
                    // console.log(this)
                    // console.log("apply")
                    ctrl.name = data.name;
                    ctrl.users = data.users;

                });

            });

            socket.on('send:message', function (message) {
                console.log("send:message")
                $rootScope.$apply(function () {
                    // ctrl.newCustomers.push(data.customer);
                    ctrl.messages.push(message);
                    ctrl.typing = false;

                });

            });

            socket.on('user:join', function (data) {
                console.log("user:join")

                $rootScope.$apply(function () {
                    ctrl.messages.push({
                        user: 'chatroom',
                        text: 'User ' + data.name + ' has joined.'
                    });
                    ctrl.users.push(data.name);
                })

            });
            socket.on('some:typing', function () {
                console.log("some:typing")

                $rootScope.$apply(function () {
                    ctrl.typing = true;
                })

            });


            // add a message to the conversation when a user disconnects or leaves the room
            socket.on('user:left', function (data) {
                console.log("user:left")

                $rootScope.$apply(function () {
                    ctrl.messages.push({
                        user: 'chatroom',
                        text: 'User ' + data.name + ' has left.'
                    });
                    var i, user;
                    for (i = 0; i < ctrl.users.length; i++) {
                        user = ctrl.users[i];
                        if (user === data.name) {
                            ctrl.users.splice(i, 1);
                            break;
                        }
                    }
                })
            });


            ctrl.sendMessage = function () {
                socket.emit('send:message', {
                    message: ctrl.message
                });

                // add the message to our model locally
                ctrl.messages.push({
                    user: ctrl.name,
                    text: ctrl.message
                });

                // clear message box
                ctrl.message = '';

            };

            ctrl.notifyTyping = function () {
                console.log("typing")
                socket.emit('send:typing');

            };
        }
    }

    ctrl.sendMessage = function(form){
        //console.log(form.$valid)
        var theResults = [];

        if(form.$valid==true)
        {
            ctrl.validForm=true;

            var reqBody = {
                "commtype":"MESSAGE",
                "fromusername":ctrl.fromusername,
                "tousername":ctrl.tousername
            }
            //console.log(reqBody);
            let commoninfo={};
            messagePost(reqBody)
                .then(data => {
                    if(data.error)
                        ctrl.errorMessage = data.error;
                    else {
                        //console.log("login")
                        //console.log(data)
                        theResults.push(data);
                        return data;
                    }
                })
            //console.log(theResults)
        }
    }



}])