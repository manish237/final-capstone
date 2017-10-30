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
    // console.log(oCtrl.data.data[1][0])
    // console.log(oCtrl.data.data[1][0].name)
    oCtrl.name = oCtrl.data.data[1][0].name;
    oCtrl.score = oCtrl.data.data[2][0].score;
    oCtrl.logout = function (target) {
        console.log("logout")
        $location.url('/')
    };

}])
.controller('ProfileCtrl',['$scope','$rootScope','$location',function ($scope, $rootScope,$location) {
    console.log("ProfileCtrl");

}])

.controller('MessageCenterCtrl',['$scope','$rootScope','$location',function ($scope, $rootScope,$location) {
    console.log("MessageCenterCtrl");

}])

.controller('DietManagerCtrl',['$scope','$rootScope','$location',function ($scope, $rootScope,$location) {
    console.log("DietManagerCtrl");

}])

.controller('HealthAssessCtrl',['$scope','$rootScope','$location',function ($scope, $rootScope,$location) {
    console.log("HealthAssessCtrl");

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