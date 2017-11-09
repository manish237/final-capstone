"use strict"

angular.module('ctrlLibrary', ['apiLibrary','apiLibraryConstants','angucomplete-alt','ui.select', 'ngSanitize','componentLibrary'])


.controller('MainController',['$scope','$rootScope','$timeout','$location','providerList','unameExists','registration','instantFood','login','commondata','consumerdata','providerdata','_','instantLoc','resetLogin','getLang','commondataUpd','consumerdataUpd','providerdataUpd','messagePost','$uibModal','$log','dataStorage','localStorageService',function ($scope, $rootScope,$timeout,$location,providerList,unameExists,registration,instantFood,login,commondata,consumerdata,providerdata,_,instantLoc,resetLogin,getLang,commondataUpd,consumerdataUpd,providerdataUpd,messagePost,$uibModal,$log,dataStorage,localStorageService) {
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

    ctrl.openLoginModal = function (target) {
        console.log("openLoginModal")
        console.log(target)
        var modalInstance = $uibModal.open({
            animation: true,
            component: 'loginForm',
            resolve: {
                items: function () {
                    return;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log("result")
            console.log(selectedItem)
            dataStorage.setGenData(selectedItem);
            localStorageService.set('genData',selectedItem)
            if(target==='assessment')
            {
                $location.url('/HealthAssessment')
            }
            else if(target==='diet'){
                $location.url('/Diet')
            }
            else if(target==='message'){
                $location.url('/MessageCenter')
            }
            else if(target==='overview'){
                $location.url('/Overview')
            }
            else {
                $location.url('/Overview')
            }
            //redirect to home page
        }, function () {
            $log.info('modal-component dismissed at: ' + new Date());
        });
    };

    ctrl.openRegisterModel = function (target) {
        console.log("openRegisterModel")
        console.log(target)
        var modalInstance = $uibModal.open({
            animation: true,
            component: 'registerForm',
            resolve: {
                items: function () {
                    return;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log("result")
            console.log(selectedItem)
            dataStorage.setGenData(selectedItem);
            localStorageService.set('genData',selectedItem)

            if(target==='overview'){
                $location.url('/Overview')
            }
            else {
                $location.url('/Overview')
            }
            //redirect to home page
        }, function () {
            $log.info('modal-component dismissed at: ' + new Date());
        });
    };

}])

.controller('OverviewCtrl',['$scope','$rootScope','$location','dataStorage','localStorageService',function ($scope, $rootScope,$location,dataStorage,localStorageService) {
    console.log("OverviewCtrl");
    let oCtrl=this;

    oCtrl.data = localStorageService.get('genData')
    console.log(oCtrl.data)
    console.log(oCtrl.data.type === 'login')

    if(oCtrl.data.type === 'register')
    {
        //we just have name ... no score
        console.log(oCtrl.data.data.name)
        oCtrl.name = oCtrl.data.data.name;
        oCtrl.hygenescore = 0;
    }
    else if(oCtrl.data.type === 'login' || oCtrl.data.type === 'reset'){
        if(oCtrl.data.data[1]!==undefined && oCtrl.data.data[1][0].name !==undefined)
            oCtrl.name = oCtrl.data.data[1][0].name;

        if(oCtrl.data.data[2]!==undefined && oCtrl.data.data[2][0]!==undefined && oCtrl.data.data[2][0].hygenescore !==undefined)
            oCtrl.hygenescore = oCtrl.data.data[2][0].hygenescore;
    }

    // console.log(oCtrl.data.data[1][0])
    // console.log(oCtrl.data.data[1][0].name)


    oCtrl.logout = function (target) {
        console.log("logout")
        localStorageService.remove('genData')
        $location.url('/')
    };

}])

.controller('ProfileCtrl',['$scope','$rootScope','$location','localStorageService','getLang','refreshStorage','commondataUpd','consumerdataUpd','providerdataUpd','uibDateParser',function ($scope, $rootScope,$location,localStorageService,getLang,refreshStorage,commondataUpd,consumerdataUpd,providerdataUpd,uibDateParser) {
    console.log("ProfileCtrl");
    let pCtrl=this;
    pCtrl.data = localStorageService.get('genData')

    pCtrl.gPlace;

    pCtrl.format = 'dd-MMMM-yyyy';
    pCtrl.popup1 = {
        opened: false
    };
    pCtrl.popup2 = {
        opened: false
    };

    pCtrl.open1 = function() {
        pCtrl.popup1.opened = true;
    };
    pCtrl.open2 = function() {
        pCtrl.popup2.opened = true;
    };
    $scope.$watch('pCtrl.chosenPlace',function (newVal) {
        pCtrl.chosenPlace = newVal;

        //console.log("chosenPlace--" + newVal);
    })

    $scope.$watch('pCtrl.chosenPlaceDetails',function (newVal) {
        pCtrl.chosenPlaceDetails = newVal;

        //console.log("chosenPlaceDetails--");
        //console.log(newVal)
        // console.log(ctrl.chosenPlaceDetails.geometry.location.lat())

    })
    $scope.$watch('pCtrl.selectedLangs',function (newVal) {
        //console.log("selectedLangs--");
        pCtrl.selectedLangs = newVal;

        //console.log(newVal)
    })
    $scope.$watch('pCtrl.selectedPrefLang',function (newVal) {
        //console.log("selectedPrefLang--");
        pCtrl.selectedPrefLang = newVal;
        //console.log(newVal)

    })


    console.log(pCtrl)
    /*
    * Editing Personal Info
    * Name
    * Location
    * gender
    * languages
    * chat handle
    * */

    pCtrl.username = pCtrl.data.username;
    if(pCtrl.data.type === 'login' || pCtrl.data.type === 'reset'){
        if(pCtrl.data.data[1]!==undefined && pCtrl.data.data[1][0]!==undefined){
            //process common data
            let commData = pCtrl.data.data[1][0];
            if(commData.name!==undefined)
            {
                pCtrl.name = commData.name;
            }
            if(commData.chathandle!==undefined)
            {
                pCtrl.chathandle = commData.chathandle;
            }
            if(commData.gender!==undefined)
            {
                pCtrl.gender = commData.gender;
            }
            if(commData.location!==undefined)
            {

                pCtrl.location = commData.location;
            }
            if(commData.longitude!==undefined)
            {
                pCtrl.longitude = commData.longitude;
            }
            if(commData.latitude!==undefined)
            {
                pCtrl.latitude = commData.latitude;
            }
            if(commData.usertype!==undefined)
            {
                pCtrl.usertype = commData.usertype;
            }
            if(commData.languages!==undefined)
            {
                pCtrl.languages = commData.languages;
                pCtrl.selectedLangs = commData.languages;
            }
        }
        if(pCtrl.data.data[2]!==undefined && pCtrl.data.data[2][0]!==undefined){
            let addData = pCtrl.data.data[2][0];
            if(addData.age!==undefined)
            {
                pCtrl.age = addData.age;
            }
            if(addData.preferredlanguage!==undefined)
            {
                pCtrl.preferredlanguage = addData.preferredlanguage;
                pCtrl.selectedPrefLang = addData.preferredlanguage;
            }
            if(addData.qualifications!==undefined)
            {
                pCtrl.qual = addData.qualifications.join();
            }
            if(addData.expertise!==undefined)
            {
                pCtrl.expert = addData.expertise;
            }
            if(addData.servicetype!==undefined)
            {
                pCtrl.servicetype = addData.servicetype;
            }
            if(addData.chat!==chatavail)
            {
                if(addData.chat===true)
                    pCtrl.chatavail = "YES";
                else
                    pCtrl.chatavail = "NO";
            }
            if(addData.medHistorylist!==undefined)
            {
                console.log(addData.medHistorylist.dateLastPhysical)
                console.log(addData.medHistorylist.dateLastPhysical!==undefined)
                console.log(addData.medHistorylist.dateLastPhysical!=='undefined')
                pCtrl.listPrescription = addData.medHistorylist.listPrescription!==undefined?addData.medHistorylist.listPrescription:"";
                pCtrl.listNonPrescription = addData.medHistorylist.listNonPrescription!==undefined?addData.medHistorylist.listNonPrescription:"";

                // if(addData.medHistorylist.dateLastPhysical!==undefined) {

                console.log(uibDateParser.parse(new Date(addData.medHistorylist.dateLastPhysical),pCtrl.format))
                console.log((uibDateParser.parse(new Date(addData.medHistorylist.dateLastPhysical),pCtrl.format)=='Invalid Date'))
                if((uibDateParser.parse(new Date(addData.medHistorylist.dateLastPhysical),pCtrl.format)=='Invalid Date'))
                    pCtrl.dateLastPhysical = ""//uibDateParser.parse(new Date(),pCtrl.format)  ;
                else
                    pCtrl.dateLastPhysical = uibDateParser.parse(new Date(addData.medHistorylist.dateLastPhysical),pCtrl.format)  ;
                // }



                // if(addData.medHistorylist.dateLastDental!==undefined) {
                console.log(uibDateParser.parse(new Date(addData.medHistorylist.dateLastDental),pCtrl.format))
                pCtrl.dateLastDental = uibDateParser.parse(new Date(addData.medHistorylist.dateLastDental),pCtrl.format)
                if((uibDateParser.parse(new Date(addData.medHistorylist.dateLastDental),pCtrl.format)=='Invalid Date'))
                    pCtrl.dateLastDental = ""//uibDateParser.parse(new Date(),pCtrl.format)  ;
                else
                    pCtrl.dateLastDental = uibDateParser.parse(new Date(addData.medHistorylist.dateLastDental),pCtrl.format)  ;
                // }


                pCtrl.listOtherTest = addData.medHistorylist.listOtherTest!==undefined?addData.medHistorylist.listOtherTest:"";
                pCtrl.listDrugAllergies = addData.medHistorylist.listDrugAllergies!==undefined?addData.medHistorylist.listDrugAllergies:"";

                pCtrl.smoking = addData.medHistorylist.smoking!==undefined?addData.medHistorylist.smoking===true?"true":"false":"false";
                pCtrl.alcohol = addData.medHistorylist.alcohol!==undefined?addData.medHistorylist.alcohol===true?"true":"false":"false";

                pCtrl.stroke = addData.medHistorylist.stroke!==undefined?addData.medHistorylist.stroke:false;
                pCtrl.arthritis = addData.medHistorylist.arthritis!==undefined?addData.medHistorylist.arthritis:false;
                pCtrl.diabetes = addData.medHistorylist.diabetes!==undefined?addData.medHistorylist.diabetes:false;
                pCtrl.anemia = addData.medHistorylist.anemia!==undefined?addData.medHistorylist.anemia:false;
                pCtrl.asthma = addData.medHistorylist.asthma!==undefined?addData.medHistorylist.asthma:false;

            }
        }
    }

    let metalangs = [];
    getLang().then(function (data) {
        //console.log(data);
        metalangs = data;
        pCtrl.metalanguages = data;

        //console.log(pCtrl.languages)
        // console.log(pCtrl.preferredlanguage)
        var newArr = [];
        if(pCtrl.languages!==undefined && pCtrl.languages.length>=1) {
            for(var i=0;i<pCtrl.languages.length;i++)
            {
                newArr.push(pCtrl.metalanguages.filter(o => o.name === pCtrl.languages[i])[0])
            }

            //console.log(newArr)
            pCtrl.selectedLangs=newArr;
        }
        if(pCtrl.preferredlanguage!==undefined && pCtrl.preferredlanguage.length!==0) {
            pCtrl.selectedPrefLang = pCtrl.metalanguages.filter(o => o.name === pCtrl.preferredlanguage)[0]
        }

    })




    pCtrl.submitCommonProfile = function(form){
        //console.log("reset submitProfile")
        //console.log(form.$valid)
        var theResults = [];
        if(form.$valid==true)
        {
            pCtrl.validForm=true;
            var dataComm = {
                username : pCtrl.data.username,
                name:pCtrl.name,
                gender:pCtrl.gender!==undefined?pCtrl.gender:"",
                chathandle:pCtrl.chathandle!==undefined?pCtrl.chathandle:"",
                languages:pCtrl.selectedLangs!==undefined?pCtrl.selectedLangs.map(o=>o.name):[],
                location:pCtrl.chosenPlace!==undefined?pCtrl.chosenPlace:"",
                longitude:pCtrl.chosenPlaceDetails!==undefined?pCtrl.chosenPlaceDetails.geometry.location.lng():"",
                latitude:pCtrl.chosenPlaceDetails!==undefined?pCtrl.chosenPlaceDetails.geometry.location.lat():""
            }

            console.log(dataComm);
            let commoninfo={};
            commondataUpd(dataComm)
                .then(data => {
                    if(data.error)
                        pCtrl.errorMessage = data.error;
                    else {
                        console.log(data)
                        refreshStorage.refresh(pCtrl.data.username,pCtrl.data.type)
                    }
                })
                .catch(err => {
                    theResults=[];
                });
            pCtrl.data = localStorageService.get('genData')
            //console.log(pCtrl.data)
        }
    }



    /*
    * Editing Consumer specific info
    * preferred language
    * age
    * */
    pCtrl.submitConsumerProfile = function(form){
        //console.log("reset submitProfile")
        //console.log(form.$valid)
        var theResults = [];
        if(form.$valid==true)
        {
            pCtrl.validForm=true;
            var dataCons =   {
                username: pCtrl.data.username,
                age:pCtrl.age!==undefined?pCtrl.age:"",
                preferredlanguage: pCtrl.selectedPrefLang !== undefined ? pCtrl.selectedPrefLang.name : "",
                medHistorylist:{
                    listPrescription: pCtrl.listPrescription !== undefined ? pCtrl.listPrescription : "",
                    listNonPrescription: pCtrl.listNonPrescription !== undefined ? pCtrl.listNonPrescription : "",
                    dateLastPhysical: pCtrl.dateLastPhysical !== undefined ? pCtrl.dateLastPhysical : "",
                    dateLastDental: pCtrl.dateLastDental !== undefined ? pCtrl.dateLastDental : "",

                    listOtherTest: pCtrl.listOtherTest !== undefined ? pCtrl.listOtherTest : "",
                    listDrugAllergies: pCtrl.listDrugAllergies !== undefined ? pCtrl.listDrugAllergies : "",

                    smoking: pCtrl.smoking !== undefined ? pCtrl.smoking : false,
                    alcohol: pCtrl.alcohol !== undefined ? pCtrl.alcohol : false,

                    stroke: pCtrl.stroke !== undefined ? pCtrl.stroke : false,
                    arthritis: pCtrl.arthritis !== undefined ? pCtrl.arthritis : false,
                    diabetes: pCtrl.diabetes !== undefined ? pCtrl.diabetes : false,
                    anemia: pCtrl.anemia !== undefined ? pCtrl.anemia : false,
                    asthma: pCtrl.asthma !== undefined ? pCtrl.asthma : false
                }
            }

            console.log(dataCons);
            consumerdataUpd(dataCons)
                .then(data => {
                    if(data.error)
                        pCtrl.errorMessage = data.error;
                    else {
                        console.log(data)
                        refreshStorage.refresh(pCtrl.data.username,pCtrl.data.type)
                    }
                })
                .catch(err => {
                    pCtrl.errorMessage = err;
                });
            pCtrl.data = localStorageService.get('genData')
            //console.log(pCtrl.data)
        }
    }
    /*
    * Editing medical history -- launch survey
    * */

    pCtrl.submitProviderProfile = function(form){
        console.log("submitProviderProfile")
        //console.log(form.$valid)
        var theResults = [];
        if(form.$valid==true)
        {
            pCtrl.validForm=true;

            var chatavailability = false;
            if(pCtrl.chatavail!==undefined){
                if(pCtrl.chatavail==='YES')
                    chatavailability=true;
            }

            var dataPro =   this.dataCons = {
                username: pCtrl.data.username,
                qualifications:pCtrl.qual!==undefined?pCtrl.qual.split(','):"",
                expertise:pCtrl.expert!==undefined?pCtrl.expert:"",
                servicetype:pCtrl.servicetype!==undefined?pCtrl.servicetype:"",
                chat:chatavailability!==undefined?chatavailability:"",
            }

            console.log("req dataPro")
            console.log(dataPro)

            //console.log(reqBody);
            providerdataUpd(dataPro)
                .then(data => {
                    if(data.error)
                        pCtrl.errorMessage = data.error;
                    else {
                        refreshStorage.refresh(pCtrl.data.username,pCtrl.data.type)
                    }
                })
                .catch(err => {
                    pCtrl.errorMessage = err;
                });
            pCtrl.data = localStorageService.get('genData')
        }
    }



    pCtrl.logout = function (target) {
        localStorageService.remove('genData')
        console.log("logout")
        $location.url('/')
    };

}])

.controller('MessageCenterCtrl',['$scope','$rootScope','$location','localStorageService','providerList','messageList','messagePost','$uibModal','$log',function ($scope, $rootScope,$location,localStorageService,providerList,messageList,messagePost,$uibModal,$log) {
    console.log("MessageCenterCtrl");
    let mcCtrl=this;
    mcCtrl.data = localStorageService.get('genData')
    mcCtrl.username = mcCtrl.data.username;
    mcCtrl.showdetails = false;
    mcCtrl.enableChatWindow = false;


    mcCtrl.delay = function sleeper(ms) {
        return function(x) {
            console.log("in delay")
            return new Promise(resolve => setTimeout(() => resolve(x), ms));
        };
    }


    var proList = providerList().then(function (data) {
        console.log(data)
        mcCtrl.providers = data;
        return data;
    })

    mcCtrl.getdetails = function(uname){
        console.log(uname)
        // console.log(mcCtrl)
        if(uname!==undefined && uname.length>0)
        {
            mcCtrl.showdetails = true;
            mcCtrl.pDetails = mcCtrl.providers.filter(o=>o.common.username===uname)[0]
        }
        else
            mcCtrl.showdetails = false;
    }

    messageList("MESSAGE",mcCtrl.data.username)
        .then(mcCtrl.delay(1000))
        .then(function (data) {
            console.log(data)
            var arr = [];
            let item={};
            if(data!==undefined && data.length!==0)
            {
                proList.then(
                    function(data2)
                    {
                        var arr = [];
                        let item={};
                        console.log(data2)
                        console.log(data)
                        for(var i=0;i<data.length;i++){
                            item = data[i];
                            if(item.tousername !== mcCtrl.data.username)
                                item.tousername = data2.filter(o=>o.common.username===item.tousername)[0];
                            else
                                item.tousername ="";
                            if(item.fromusername !== mcCtrl.data.username)
                                item.fromusername = data2.filter(o=>o.common.username===item.fromusername)[0];
                            else
                                item.fromusername ="";
                            arr.push(item);
                            item={};
                        }
                        mcCtrl.messages = arr;
                    }
                )

            }
        //mcCtrl.messages = data;
        })


    mcCtrl.logout = function (target) {
        localStorageService.remove('genData')
        console.log("logout")
        $location.url('/')
    };

    mcCtrl.submitSendMessage = function(form){
        //console.log(form.$valid)
        if(form.$valid==true)
        {
            mcCtrl.validForm=true;

            var reqBody = {
                "commtype":"MESSAGE",
                "fromusername":mcCtrl.data.username,
                "tousername":mcCtrl.tousername,
                "message":mcCtrl.message
            }
            console.log(reqBody);
            messagePost(reqBody)
                .then(data => {
                    if(data.error)
                        ctrl.errorMessage = data.error;
                    else {
                        //console.log("login")
                        console.log(data)

                        return messageList("MESSAGE",mcCtrl.data.username);
                    }
                })
                .then(mcCtrl.delay(1000))
                .then(function (data) {
                    console.log(data)
                    //process messages
                    proList.then(
                        function(data2)
                        {
                            var arr = [];
                            let item={};
                            console.log(data2)
                            console.log(data)
                            for(var i=0;i<data.length;i++){
                                item = data[i];
                                console.log(data2.filter(o=>o.common.username===item.tousername)[0])
                                if(item.tousername !== mcCtrl.data.username)
                                    item.tousername = data2.filter(o=>o.common.username===item.tousername)[0];
                                else
                                    item.tousername ="";
                                if(item.fromusername !== mcCtrl.data.username)
                                    item.fromusername = data2.filter(o=>o.common.username===item.fromusername)[0];
                                else
                                    item.fromusername ="";
                                arr.push(item);
                                item={};
                            }
                            mcCtrl.messages = arr;
                        }
                    )


                    // mcCtrl.messages = data;
                })
                .catch(err => {
                    mcCtrl.errormessage = data;;
                });
        }
    }

    mcCtrl.openProviderDetails = function (target) {
        console.log("openProviderDetails")
        console.log(target)
        var modalInstance = $uibModal.open({
            animation: true,
            component: 'providerDetails',
            resolve: {
                items: function () {
                    return target;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            console.log("result")
        }, function () {
            $log.info('modal-component dismissed at: ' + new Date());
        });
    };

    mcCtrl.connectToChat = function() {
        console.log("connectToChat")
        console.log(mcCtrl)
        console.log(mcCtrl.data.data!=='undefined')
        console.log(mcCtrl.data.data[1]!=='undefined')
        console.log(mcCtrl.data.data[1][0].chathandle!=='undefined')
        console.log(mcCtrl.data.data[1][0].chathandle!==undefined)
        if(mcCtrl.data.data!==undefined && mcCtrl.data.data[1]!=='undefined' && mcCtrl.data.data[1][0].chathandle!==undefined) {
            console.log(mcCtrl.data.data[1][0].chathandle)

            mcCtrl.enableChatWindow = true;
            mcCtrl.showCreateChatHandle = false;


            mcCtrl.messages = [];

            var socket = io.connect({query:"name="+mcCtrl.data.data[1][0].chathandle});

            socket.on('init', function (data) {
                console.log("init")
                console.log(data)
                console.log()
                $rootScope.$apply(function () {
                    mcCtrl.name = data.name;
                    mcCtrl.users = data.users;

                });
            });

            socket.on('send:message', function (message) {
                console.log("send:message")
                $rootScope.$apply(function () {
                    mcCtrl.messages.push(message);
                    mcCtrl.typing = false;

                });
            });

            socket.on('user:join', function (data) {
                console.log("user:join")

                $rootScope.$apply(function () {
                    mcCtrl.messages.push({
                        user: 'chatroom',
                        text: 'User ' + data.name + ' has joined.'
                    });
                    mcCtrl.users.push(data.name);
                })

            });
            socket.on('some:typing', function () {
                console.log("some:typing")
                $rootScope.$apply(function () {
                    mcCtrl.typing = true;
                })
            });


            // add a message to the conversation when a user disconnects or leaves the room
            socket.on('user:left', function (data) {
                console.log("user:left")

                $rootScope.$apply(function () {
                    mcCtrl.messages.push({
                        user: 'chatroom',
                        text: 'User ' + data.name + ' has left.'
                    });
                    var i, user;
                    for (i = 0; i < mcCtrl.users.length; i++) {
                        user = mcCtrl.users[i];
                        if (user === data.name) {
                            mcCtrl.users.splice(i, 1);
                            break;
                        }
                    }
                })
            });


            mcCtrl.sendChatMessage = function () {
                socket.emit('send:message', {
                    message: mcCtrl.message
                });

                // add the message to our model locally
                mcCtrl.messages.push({
                    user: mcCtrl.name,
                    text: mcCtrl.message
                });

                // clear message box
                mcCtrl.message = '';

            };

            mcCtrl.notifyTyping = function () {
                console.log("typing")
                socket.emit('send:typing');

            };
        }
        else {
            mcCtrl.enableChatWindow = false;
            mcCtrl.showCreateChatHandle = true;
        }
    }



}])

.controller('DietManagerCtrl',['$scope','$rootScope','$location','localStorageService','providerList','messageList','messagePost','$uibModal','$log','getQBank','$mdDialog','consumerdataUpd','refreshStorage',function ($scope, $rootScope,$location,localStorageService,providerList,messageList,messagePost,$uibModal,$log,getQBank,$mdDialog,consumerdataUpd,refreshStorage) {
    console.log("DietManagerCtrl");
    let dmCtrl=this;
    dmCtrl.data = localStorageService.get('genData')
    dmCtrl.username = dmCtrl.data.username;
    dmCtrl.response = {};
    dmCtrl.responsereq = [];

    dmCtrl.track = {};
    dmCtrl.trackhyg = {};

    dmCtrl.delay = function sleeper(ms) {
        return function(x) {
            console.log("in delay")
            return new Promise(resolve => setTimeout(() => resolve(x), ms));
        };
    }


    dmCtrl.myDate = new Date();
    $scope.$watch('dmCtrl.myDate',function (newVal) {
        console.log(newVal)
        dmCtrl.myDate = newVal;
        //console.log("chosenPlace--" + newVal);
    })

    dmCtrl.showTabDialog = function(ev) {
        $mdDialog.show({
            controller: function () {
                return dmCtrl;
            },
            controllerAs: 'dmCtrl',
            templateUrl: 'tabDialog.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:false
        })
            .then(function(answer) {
                dmCtrl.status = 'You said the information was "' + answer + '".';
            }, function() {
                dmCtrl.status = 'You cancelled the dialog.';
            });
    };
    dmCtrl.selectedIndex = 0;
    dmCtrl.radio = dmCtrl.track[dmCtrl.selectedIndex];

    var qbank = getQBank('HISTORY').then(function (data) {
        console.log(data)
        dmCtrl.qbank = data;
        dmCtrl.max = dmCtrl.qbank.length;

        for(var i=0;i<dmCtrl.qbank.length;i++) {
            dmCtrl.response[dmCtrl.qbank[i].quesId] = "";
            dmCtrl.track[i]=""
            if(dmCtrl.data.data!==undefined && dmCtrl.data.data.length>0){
                if(dmCtrl.data.data[2]!==undefined && dmCtrl.data.data[2].length>0 && dmCtrl.data.data[2][0].oralassessment!==undefined){
                    // console.log(dmCtrl.data.data[2][0].oralassessment)
                    // console.log(dmCtrl.data.data[2][0].oralassessment.filter(item=>item.questionid===dmCtrl.qbank[i].quesId)[0].responseid)
                    dmCtrl.response[dmCtrl.qbank[i].quesId]=dmCtrl.data.data[2][0].oralassessment.filter(item=>item.questionid===dmCtrl.qbank[i].quesId)[0].responseid;
                    dmCtrl.track[i]=dmCtrl.data.data[2][0].oralassessment.filter(item=>item.questionid===dmCtrl.qbank[i].quesId)[0].responseid;
                    dmCtrl.radio = dmCtrl.track[dmCtrl.selectedIndex];

                }
            }
        }
        return data;
    })



    console.log(dmCtrl.myDate)

    console.log(dmCtrl)






    console.log(dmCtrl.response)
    console.log(dmCtrl.track)

    $scope.$watch('dmCtrl.radio',function (newVal) {
/*        console.log("dmCtrl.radio")
        console.log(newVal)*/
    },true)


    //initialize the model vars

    console.log(dmCtrl.radio)


    dmCtrl.saveOption = function(quesId){
        console.log("saveOption")
        
/*        console.log(quesId)
        console.log(dmCtrl.selectedIndex)
        console.log(dmCtrl.radio)
        console.log(dmCtrl.response)
        console.log(dmCtrl.track)*/
        
    dmCtrl.response[quesId]=dmCtrl.radio!==undefined?dmCtrl.radio:"";
    dmCtrl.track[dmCtrl.selectedIndex]=dmCtrl.radio;




/*        console.log(dmCtrl.response)
        console.log(dmCtrl.track)*/
    }



    dmCtrl.nextTab = function(quesId) {
        console.log("next")

        console.log(quesId)
        console.log(dmCtrl.radio)
        console.log(dmCtrl.response)
        console.log(dmCtrl.track)


        dmCtrl.response[quesId]=dmCtrl.radio!==undefined?dmCtrl.radio:"";
        dmCtrl.track[dmCtrl.selectedIndex]=dmCtrl.radio;

        var index = (dmCtrl.selectedIndex == dmCtrl.max) ? 0 : dmCtrl.selectedIndex + 1;

        dmCtrl.selectedIndex = index;
        dmCtrl.radio = dmCtrl.track[dmCtrl.selectedIndex];

        console.log(dmCtrl.response)
        console.log(dmCtrl.track)

        // dmCtrl.response[quesId]=dmCtrl.radio;
    };


    dmCtrl.prevTab = function(quesId) {
        console.log("prev")

        console.log(quesId)
        console.log(dmCtrl.radio)
        console.log(dmCtrl.response)
        console.log(dmCtrl.track)

        dmCtrl.response[quesId]=dmCtrl.radio!==undefined?dmCtrl.radio:"";
        dmCtrl.track[dmCtrl.selectedIndex]=dmCtrl.radio!==undefined?dmCtrl.radio:"";

        var index = (dmCtrl.selectedIndex >0 ) ? dmCtrl.selectedIndex -1 : 0;

        dmCtrl.selectedIndex = index;
        dmCtrl.radio = dmCtrl.track[dmCtrl.selectedIndex]

        console.log(dmCtrl.response)
        console.log(dmCtrl.track)
        // dmCtrl.response[quesId]=dmCtrl.radio;

    };


    dmCtrl.hide = function() {
        console.log("hide")
        dmCtrl.selectedIndex = 0;
        $mdDialog.hide();
    };


    dmCtrl.cancel = function() {
        console.log("cancel")
        dmCtrl.selectedIndex = 0;
        $mdDialog.cancel();
    };


    dmCtrl.save = function() {
        console.log("save")
        console.log(dmCtrl.response)
        console.log(dmCtrl.track)
        dmCtrl.selectedIndex = 0;
        dmCtrl.radio = dmCtrl.track[dmCtrl.selectedIndex];
        let input = {};

        for (const [key, value] of Object.entries(dmCtrl.response)) {
            // console.log({questionid:key,responseid:value}); // "a 5", "b 7", "c 9"
            dmCtrl.responsereq.push({questionid:key,responseid:value})
        }
        console.log(dmCtrl.data)

        console.log(dmCtrl.responsereq)
        if(dmCtrl.data!==undefined){
            console.log("condition 1")

            if(dmCtrl.data.data!==undefined && dmCtrl.data.data.length>0)
            {
                console.log("condition 2")

                if(dmCtrl.data.data[2]!==undefined && dmCtrl.data.data[2].length>0)
                {
                    console.log("condition 2a")

                    //update existing
                    input = dmCtrl.data.data[2][0];
                    input.oralassessment = dmCtrl.responsereq;
                    input.hygenescore=4;

                }
                else
                {
                    console.log("condition 3")

                    console.log("new")
                    input = {};
                    input.username = dmCtrl.username;
                    input.oralassessment = dmCtrl.responsereq;
                    input.hygenescore=4;
                }
            }
            else {
                console.log("condition 4")

            }
        }
        else
        {
            console.log("condition 5")

            console.log("invalid state")
        }
        console.log(input)
        console.log(dmCtrl.data)

        //save the data to profile
        consumerdataUpd(input)
            .then(data => {
                if(data.error)
                    dmCtrl.errorMessage = data.error;
                else {
                    console.log(data)
                    refreshStorage.refresh(dmCtrl.data.username,dmCtrl.data.type)
                }
            })
            .catch(err => {
                dmCtrl.errorMessage = err;
            });
        dmCtrl.data = localStorageService.get('genData')
        console.log(dmCtrl.data)
        $mdDialog.cancel();
    };

    dmCtrl.logout = function (target) {
        localStorageService.remove('genData')
        console.log("logout")
        $location.url('/')
    };

}])


.controller('HealthAssessCtrl',['$scope','$rootScope','$location','localStorageService','providerList','messageList','messagePost','$uibModal','$log','getQBank','$mdDialog','consumerdataUpd','uibDateParser','instantFood','dietdata','dietdataUpd','moment',function ($scope, $rootScope,$location,localStorageService,providerList,messageList,messagePost,$uibModal,$log,getQBank,$mdDialog,consumerdataUpd,uibDateParser,instantFood,dietdata,dietdataUpd,moment) {
    console.log("HealthAssessCtrl");

    let haCtrl=this;

    haCtrl.errorMessage="";
    haCtrl.format = 'dd-MMMM-yyyy';
    haCtrl.popup1 = {
        opened: false
    };

    // console.log(moment())
    let currDate = new Date();
    haCtrl.entryDate = currDate.getFullYear() + "-" + (currDate.getMonth()+1) + "-" + currDate.getDate();
    haCtrl.dateEntryCurr = uibDateParser.parse(new Date(haCtrl.entryDate),haCtrl.format)  ;


    haCtrl.data = localStorageService.get('genData')
    haCtrl.username = haCtrl.data.username;

    haCtrl.choices = [];

    haCtrl.delay = function sleeper(ms) {
        return function(x) {
            console.log("in delay")
            return new Promise(resolve => setTimeout(() => resolve(x), ms));
        };
    }


    haCtrl.dietdata = dietdata(haCtrl.username).then(function (data) {
        console.log(data)
        if(data.error)
            console.log(data.error);
        else
        {
            haCtrl.userdiet = data.filter(item => new Date(haCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
            console.log(haCtrl.userdiet)
        }
        return data;
    })






    haCtrl.open1 = function() {
        haCtrl.popup1.opened = true;
    };

    haCtrl.dayminusone =function()
    {
        var startDate = new Date(haCtrl.dateEntryCurr);
        var day = 60 * 60 * 24 * 1000;
        var endDate = new Date(startDate.getTime() - day);

        haCtrl.entryDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();
        haCtrl.dateEntryCurr = uibDateParser.parse(new Date(endDate),haCtrl.format)  ;

        haCtrl.dietdata.then(function (data) {
            console.log(data)
            if(data.error)
                console.log(data.error);
            else
            {
                haCtrl.userdiet = data.filter(item => new Date(haCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
                console.log(haCtrl.userdiet)
            }
            // haCtrl.userdiet = data.filter(item => new Date(haCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
        })


    }
    haCtrl.dayplusone =function()
    {
        var startDate = new Date(haCtrl.dateEntryCurr);
        var day = 60 * 60 * 24 * 1000;
        var endDate = new Date(startDate.getTime() + day);

        haCtrl.entryDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();
        haCtrl.dateEntryCurr = uibDateParser.parse(new Date(endDate),haCtrl.format)  ;

        haCtrl.dietdata.then(function (data) {

            console.log(data)
            if(data.error)
                console.log(data.error);
            else
            {
                haCtrl.userdiet = data.filter(item => new Date(haCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
                console.log(haCtrl.userdiet)
            }
            // haCtrl.userdiet = data.filter(item => new Date(haCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
    })

    }

    haCtrl.addNewChoice = function() {
        console.log("addNewChoice")
        console.log(haCtrl.choices)
        var newItemNo = haCtrl.choices.length+1;
        haCtrl.choices.push({'id':'choice'+newItemNo});
        console.log(haCtrl.choices)


    };

    haCtrl.removeChoice = function(choiceid) {
        console.log("removeChoice")
        console.log(haCtrl.choices)
        haCtrl.choices = haCtrl.choices.filter((item)=>item.id!==choiceid);

        // var lastItem = haCtrl.choices.length-1;
        console.log(haCtrl.choices)


        // haCtrl.choices.splice(lastItem);
    };


    haCtrl.getFood = function (userInputString, timeoutPromise) {
        /*console.log(userInputString)
        console.log(timeoutPromise)
*/
        return instantFood(userInputString).then(function (data) {
            //console.log(data)
            var a=[]
            if(data.branded)
            {
                for(var i=0;i<data.branded.length;i++) {
                    if(data.branded[i].nf_calories===undefined)
                        continue;
                    var obj = _.pick(data.branded[i], 'food_name', 'photo');
                    var desc = data.branded[i].nf_calories + "cal for " + data.branded[i].serving_qty + " " + data.branded[i].serving_unit;
                    obj.description = desc;
                    obj.details = data.branded[i];
                    a.push(obj);
                }
            }
            //console.log(a)
            if(data.common)
            {
                for(var i=0;i<data.common.length;i++) {
                    if(data.branded[i].nf_calories===undefined)
                        continue;
                    var obj = _.pick(data.common[i], 'food_name', 'photo');
                    var desc = data.common[i].nf_calories + " Cal for " + data.common[i].serving_qty + " " + data.common[i].serving_unit;
                    obj.description = desc;
                    obj.details = data.common[i];

                    a.push(obj);
                    // a.push( _.map(data.common, function(o) { return _.pick(o, 'food_name','photo') }));
                }
            }
            // console.log(a)
            // return  {"data": [{ "id": "1" }, { "id": "2" }, { "id": "3" }]};
            return  {"data": a};
        })
    }

    haCtrl.saveFood=function () {
        console.log("save")

        console.log(haCtrl.choices)
        if(haCtrl.choices!==undefined && haCtrl.choices.length>0){
            /*"username":"consumer1@gmail.com",
                "grosscal":"1350",
                "entrydate":"2017-10-28",
                "items":[
                {
                    "itemname":"Item1",
                    "itemcat" : "BREAKFAST",
                    "numcal":"150",
                    "serving_qty":1,
                    "serving_unit":"oz",
                    "item_id":"1234abcd"
                },
                {
                    "itemname":"Item2",
                    "itemcat" : "LUNCH",
                    "numcal":"150",
                    "serving_qty":1,
                    "serving_unit":"oz",
                    "item_id":"1234abcd"
                },
                {
                    "itemname":"Item3",
                    "itemcat" : "DINNER",
                    "numcal":"150",
                    "serving_qty":1,
                    "serving_unit":"oz",
                    "item_id":"1234abcd"
                }
            ]

        }*/
            let grosscal=0;
            let req = {

            };
            req.username = haCtrl.username;
            req.entrydate = haCtrl.entryDate;

            let item={},selecteditem={}
            req.items=[];
            for(var i=0;i<haCtrl.choices.length;i++){
                item = {};
                selecteditem = haCtrl.choices[i].selectedfood!==undefined?haCtrl.choices[i].selectedfood:{};
                console.log(selecteditem)

                if(selecteditem.originalObject!==undefined && selecteditem.originalObject.food_name!==undefined){
                    item.itemname=selecteditem.originalObject.food_name;
                }

                if(haCtrl.choices[i].timeofday!==undefined && haCtrl.choices[i].timeofday.length!==0)
                    item.itemcat=haCtrl.choices[i].timeofday;

                if(haCtrl.choices[i].selectedfoodcal!==undefined && haCtrl.choices[i].selectedfoodcal!==0) {
                    item.numcal = haCtrl.choices[i].selectedfoodcal;
                    grosscal=grosscal+parseInt(item.numcal);
                }
                else {
                    //calculate
                    if(haCtrl.choices[i].selectedfoodqty!==undefined && haCtrl.choices[i].selectedfoodqty!==0)
                    {
                        if(selecteditem.originalObject!==undefined && selecteditem.originalObject.details!==undefined){
                            console.log(haCtrl.choices[i].selectedfoodqty)
                            console.log(selecteditem.originalObject.details.serving_qty)
                            console.log(selecteditem.originalObject.details.nf_calories)

                            item.numcal = (haCtrl.choices[i].selectedfoodqty/selecteditem.originalObject.details.serving_qty)*selecteditem.originalObject.details.nf_calories;

                            console.log(item.numcal)

                            grosscal=grosscal+item.numcal;
                        }
                    }
                    else {
                        //default from details
                        if(selecteditem.originalObject!==undefined && selecteditem.originalObject.details!==undefined){
                            item.numcal = selecteditem.originalObject.details.nf_calories;
                            grosscal=grosscal+item.numcal;
                        }
                    }
                }

                if(haCtrl.choices[i].selectedfoodqty!==undefined && haCtrl.choices[i].selectedfoodqty!==0)
                    item.serving_qty=haCtrl.choices[i].selectedfoodqty;

                if(selecteditem.originalObject!==undefined && selecteditem.originalObject.details!==undefined){
                    item.serving_unit=selecteditem.originalObject.details.serving_unit;
                }

                if(selecteditem.originalObject!==undefined && selecteditem.originalObject.details!==undefined){
                    item.item_id=selecteditem.originalObject.details.nix_item_id;
                }
                req.items.push(item)
                item={};selecteditem={};
            }

            req.grosscal = grosscal;
            console.log(req)
            haCtrl.dietdata = dietdataUpd(req)
                .then(data => {
                    if(data.error)
                        haCtrl.errorMessage = data.error;
                    else {
                        console.log(data)
                        return dietdata(haCtrl.username)
                    }
                })
                .then(function (data) {
                    console.log(data)
                    if(data.error)
                        console.log(data.error);
                    else
                    {
                        haCtrl.userdiet = data.filter(item => new Date(haCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
                        console.log(haCtrl.userdiet)
                    }
                    return data;
                })
                .catch(err => {
                    haCtrl.errorMessage = err;
                });
            //posting

            haCtrl.choices = [];
        }

    }

    console.log(haCtrl)
}])


/*
.controller('LoginController',['login','commondata','consumerdata','providerdata','$uibModal','$log',function (login,commondata,consumerdata,providerdata,$uibModal,$log) {
    var theResults = [];

    console.log("loginctrl")
    let $ctrl = this;
    $ctrl.loginSubmit = function (form) {
        console.log("close loginSubmit")

        if(form.$valid==true)
        {

            $ctrl.validForm=true;

            var reqBody = {
                "username":$ctrl.loginUname,
                "password":$ctrl.loginPwd,
            }
            //console.log(reqBody);
            let commoninfo={};
            login(reqBody)
                .then(data => {
                    if(data.error) {

                        $ctrl.errorMessage = data.error;
                        return Promise.reject({
                            error: data.error
                        });
                        //throw new Error(data.error);

                        //$q.reject(data.error)
                        // return data;
                    }
                    else {

                        //console.log("login")
                        //console.log(data)
                        theResults.push(data);
                        return commondata($ctrl.loginUname)
                    }
                })
                .then(dataCommon=>{
                    if(dataCommon.error){

                        $ctrl.errorMessage = dataCommon.error;
                        return Promise.reject({
                            error: dataCommon.error
                        });
                        //throw new Error(dataCommon.error);

                        //$q.reject(dataCommon.error)
                        //return dataCommon;
                    }
                    else {

                        //console.log(dataCommon)
                        commoninfo = dataCommon;
                        //console.log(dataCommon[0].usertype)
                        theResults.push(dataCommon);

                        if (dataCommon[0].usertype === 'CONSUMER') {
                            return consumerdata($ctrl.loginUname)
                        }
                        else if (dataCommon[0].usertype === 'PROVIDER') {
                            return providerdata($ctrl.loginUname)
                        }
                    }
                })
                .then(dataAdditional=> {
                    "use strict";
                    if(dataAdditional.error){

                        $ctrl.errorMessage = dataAdditional.error;

                        return Promise.reject({
                            error: dataAdditional.error
                        });
                        throw new Error(dataAdditional.error);

                        //$q.reject(dataAdditional.error)
                        //return dataAdditional;
                    }
                    else {
                        //console.log(dataAdditional)
                        theResults.push(dataAdditional);
                        $ctrl.close({$value: {
                            type:"login",
                            data:theResults
                        }});

                    }

                })
                .catch(err => {
                    $ctrl.errorMessage = err.error;
                });
            //console.log(theResults)
        }


    }
    $ctrl.cancel = function () {
        console.log("close login")

        $ctrl.dismiss({$value: 'cancel'});
    };

    $ctrl.registration = function () {
        console.log(" registration")
        console.log($ctrl)
        var parent = $ctrl;
        var modalInstance = $uibModal.open({
            animation: true,
            component: 'registerForm',
            // scope:$ctrl,
            resolve: {
                items: function () {
                    return $ctrl;
                }
            }
        });
        $ctrl.cancel();
        modalInstance.result.then(function (selectedItem) {
            console.log("result2")
            console.log(selectedItem)
            parent.close({$value: selectedItem});
            //redirect to home page
        }, function () {
            $log.info('modal-component 2 dismissed at: ' + new Date());
            console.log($ctrl)
            $ctrl.cancel();
        });
    }
    $ctrl.reset = function () {
        console.log(" reset")
        console.log($ctrl)
        var parent = $ctrl;
        var modalInstance = $uibModal.open({
            animation: true,
            component: 'resetForm',
            // scope:$ctrl,
            resolve: {
                items: function () {
                    return $ctrl;
                }
            }
        });
        $ctrl.cancel();
        modalInstance.result.then(function (selectedItem) {
            console.log("result2")
            console.log(selectedItem)
            parent.close({$value: selectedItem});
            //redirect to home page
        }, function () {
            $log.info('modal-component 2 dismissed at: ' + new Date());
            console.log($ctrl)
            $ctrl.cancel();
        });
    }
}])

.controller('RegisterController',['$scope','$rootScope','registration',function ($scope, $rootScope,registration) {
    var theResults = [];

    console.log("registerctrl")
    console.log($ctrl)
    var parent = $ctrl;
    console.log(parent)

    let $ctrl = this;

    console.log($ctrl)

    $ctrl.registerSubmit = function (form) {
        console.log("registerSubmit")
        $ctrl.validForm=true;

        var reqBody = {
            "username":$ctrl.uname,
            "password":$ctrl.pwd,
            "name":$ctrl.name,
            "type":$ctrl.utype
        }
        //console.log(reqBody);
        registration(reqBody)
            .then(function (data) {
                //console.log(data)
                if(data.error) {

                    $ctrl.errorMessage = data.error;
                    return Promise.reject({
                        error: data.error
                    });
                }
                else
                {
                    console.log($ctrl)
                    console.log("reg success")
                    $ctrl.close({$value:{
                        type:"register",
                        data:data
                    }});
                }
            })
            .catch(err => {
                $ctrl.errorMessage = err.error;
            });
    }

    $ctrl.cancel = function () {
        console.log("close register")

        $ctrl.dismiss({$value: 'cancel'});
        parent.dismiss({$value: 'cancel'})
    };
}])

.controller('ResetController',['$scope','$rootScope','commondata','consumerdata','providerdata','resetLogin',function ($scope, $rootScope,commondata,consumerdata,providerdata,resetLogin) {
    var theResults = [];

    console.log("resetctrl")
    console.log($ctrl)
    var parent = $ctrl;
    console.log(parent)

    let $ctrl = this;

    console.log($ctrl)

    $ctrl.loginResetSubmit = function (form) {
        console.log("loginResetSubmit")
        $ctrl.validForm=true;

        var reqBody = {
            "username":$ctrl.resetUname,
            "password":$ctrl.pwd,
        }
        //console.log(reqBody);
        resetLogin(reqBody)
            .then(data => {
                if(data.error) {

                    $ctrl.errorMessage = data.error;
                    return Promise.reject({
                        error: data.error
                    });
                    //throw new Error(data.error);

                    //$q.reject(data.error)
                    // return data;
                }
                else {

                    //console.log("login")
                    //console.log(data)
                    theResults.push(data);
                    return commondata($ctrl.resetUname)
                }
            })
            .then(dataCommon=>{
                if(dataCommon.error){

                    $ctrl.errorMessage = dataCommon.error;
                    return Promise.reject({
                        error: dataCommon.error
                    });
                    //throw new Error(dataCommon.error);

                    //$q.reject(dataCommon.error)
                    //return dataCommon;
                }
                else {

                    //console.log(dataCommon)
                    commoninfo = dataCommon;
                    console.log(dataCommon[0].usertype)
                    theResults.push(dataCommon);

                    if (dataCommon[0].usertype === 'CONSUMER') {
                        return consumerdata($ctrl.resetUname)
                    }
                    else if (dataCommon[0].usertype === 'PROVIDER') {
                        return providerdata($ctrl.resetUname)
                    }
                }
            })
            .then(dataAdditional=> {
                "use strict";
                if(dataAdditional.error){

                    $ctrl.errorMessage = dataAdditional.error;

                    return Promise.reject({
                        error: dataAdditional.error
                    });
                    throw new Error(dataAdditional.error);

                    //$q.reject(dataAdditional.error)
                    //return dataAdditional;
                }
                else {
                    // console.log(dataAdditional)
                    theResults.push(dataAdditional);
                    $ctrl.close({$value: {
                        type:"reset",
                        data:theResults
                    }});

                }

            })
            .catch(err => {
                $ctrl.errorMessage = err.error;
            });

    }

    $ctrl.cancel = function () {
        console.log("close reset")

        $ctrl.dismiss({$value: 'cancel'});
        parent.dismiss({$value: 'cancel'})
    };
}])
*/