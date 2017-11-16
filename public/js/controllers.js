"use strict"

angular.module('ctrlLibrary', ['apiLibrary','apiLibraryConstants','angucomplete-alt','ui.select', 'ngSanitize','componentLibrary'])
.config(function($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
})

.controller('HomeController',['$scope','$rootScope','$location','$uibModal','$log','localStorageService',function ($scope, $rootScope,$location,$uibModal,$log,localStorageService) {
    let hCtrl = this;
    console.log("MainCtrl");
    
    hCtrl.openLoginModal = function (target) {
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
    
    hCtrl.openRegisterModel = function (target) {
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
            // dataStorage.setGenData(selectedItem);
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

.controller('OverviewCtrl',['$http','$scope','$rootScope','$location','$route','localStorageService','$mdDialog','getQBank','consumerdataUpd','refreshStorage','getFeeds',function ($http,$scope, $rootScope,$location,$route,localStorageService,$mdDialog,getQBank,consumerdataUpd,refreshStorage,getFeeds) {
    console.log("OverviewCtrl");
    let oCtrl=this;
    console.log($route)
    //loading user data from storage
    oCtrl.data = localStorageService.get('genData')
    console.log(oCtrl.data)
    
    //initializations
    oCtrl.username = oCtrl.data.username;
    oCtrl.response = {};
    oCtrl.responsereq = [];
    oCtrl.track = {};
    oCtrl.selectedIndex = 0;
    oCtrl.radio = oCtrl.track[oCtrl.selectedIndex];




    //data load

    getFeeds().then(function (data) {
        // console.log(data)
        if(data.query!==undefined && data.query.results!=undefined && data.query.results.rss!=undefined && data.query.results.rss.channel!=undefined)
            oCtrl.feeds = data.query.results.rss.channel;
        console.log(oCtrl.feeds)
        return data;
    })

    var qbank = getQBank('HISTORY').then(function (data) {
        console.log(data)
        oCtrl.qbank = data;
        oCtrl.max = oCtrl.qbank.length;
        
        for(var i=0;i<oCtrl.qbank.length;i++) {
            oCtrl.response[oCtrl.qbank[i].quesId] = "";
            oCtrl.track[i]=""
            if(oCtrl.data.data!==undefined && oCtrl.data.data.additionaldata!==undefined){
                if(oCtrl.data.data.additionaldata.oralassessment!==undefined){
                    oCtrl.response[oCtrl.qbank[i].quesId]=oCtrl.data.data.additionaldata.oralassessment.filter(item=>item.questionid===oCtrl.qbank[i].quesId)[0].responseid;
                    oCtrl.track[i]=oCtrl.data.data.additionaldata.oralassessment.filter(item=>item.questionid===oCtrl.qbank[i].quesId)[0].responseid;
                    oCtrl.radio = oCtrl.track[oCtrl.selectedIndex];
                }
            }
        }
        return data;
    })









    //For name and hygene score
    if(oCtrl.data.type === 'register'){
        //we just have name ... no score
        if(oCtrl.data.data!==undefined && oCtrl.data.data.commondata!==undefined && oCtrl.data.data.commondata.name !==undefined)
            oCtrl.name = oCtrl.data.data.commondata.name;


        oCtrl.hygenescore = 0;
    }
    else if(oCtrl.data.type === 'login' || oCtrl.data.type === 'reset'){
/*
        console.log(oCtrl.data.data.commondata)
        console.log(oCtrl.data.data.additionaldata)
*/

        if(oCtrl.data.data!==undefined && oCtrl.data.data.commondata!==undefined && oCtrl.data.data.commondata.name !==undefined)
            oCtrl.name = oCtrl.data.data.commondata.name;

        if(oCtrl.data.data!==undefined && oCtrl.data.data.additionaldata!==undefined && oCtrl.data.data.additionaldata.hygenescore !==undefined)
            oCtrl.hygenescore = oCtrl.data.data.additionaldata.hygenescore;
    }
    
    
    /*
    * Health Assessment Section
    * */
    
    
    
    //For displaying the dialog
    oCtrl.showTabDialog = function(ev) {
        $mdDialog.show({
                controller: function () {
                    return oCtrl;
                },
                controllerAs: 'oCtrl',
                templateUrl: 'tabDialog.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose:true
            })
            .then(function(answer) {
                oCtrl.status = 'You said the information was "' + answer + '".';
            }, function() {
                oCtrl.status = 'You cancelled the dialog.';
            });
    };
    
    //on answer selection
    oCtrl.saveOption = function(quesId){
        console.log("saveOption")
        oCtrl.response[quesId]=oCtrl.radio!==undefined?oCtrl.radio:"";
        oCtrl.track[oCtrl.selectedIndex]=oCtrl.radio;
    }
    
    
    //next ques
    oCtrl.nextTab = function(quesId) {
/*
        console.log("next")
        
        console.log(quesId)
        console.log(oCtrl.radio)
        console.log(oCtrl.response)
        console.log(oCtrl.track)
*/
        oCtrl.response[quesId]=oCtrl.radio!==undefined?oCtrl.radio:"";
        oCtrl.track[oCtrl.selectedIndex]=oCtrl.radio;
        
        var index = (oCtrl.selectedIndex == oCtrl.max) ? 0 : oCtrl.selectedIndex + 1;
    
        oCtrl.selectedIndex = index;
        oCtrl.radio = oCtrl.track[oCtrl.selectedIndex];
        
/*
        console.log(oCtrl.response)
        console.log(oCtrl.track)
*/
        
        // oCtrl.response[quesId]=oCtrl.radio;
    };
    
    //prev ques
    oCtrl.prevTab = function(quesId) {
        console.log("prev")
        
/*
        console.log(quesId)
        console.log(oCtrl.radio)
        console.log(oCtrl.response)
        console.log(oCtrl.track)
*/
    
        oCtrl.response[quesId]=oCtrl.radio!==undefined?oCtrl.radio:"";
        oCtrl.track[oCtrl.selectedIndex]=oCtrl.radio!==undefined?oCtrl.radio:"";
        
        var index = (oCtrl.selectedIndex >0 ) ? oCtrl.selectedIndex -1 : 0;
    
        oCtrl.selectedIndex = index;
        oCtrl.radio = oCtrl.track[oCtrl.selectedIndex]
        
/*
        console.log(oCtrl.response)
        console.log(oCtrl.track)
*/
        // oCtrl.response[quesId]=oCtrl.radio;
        
    };
    
    //hide
    oCtrl.hide = function() {
        console.log("hide")
        oCtrl.selectedIndex = 0;
        $mdDialog.hide();
    };
    
    //cancel
    oCtrl.cancel = function() {
        console.log("cancel")
        oCtrl.selectedIndex = 0;
        $mdDialog.cancel();
    };
    
    //save answers
    oCtrl.save = function() {
        console.log("save")
        console.log(oCtrl.response)
        console.log(oCtrl.track)
        oCtrl.selectedIndex = 0;
        oCtrl.radio = oCtrl.track[oCtrl.selectedIndex];
        let input = {};
        
        for (const [key, value] of Object.entries(oCtrl.response)) {
            // console.log({questionid:key,responseid:value}); // "a 5", "b 7", "c 9"
            oCtrl.responsereq.push({questionid:key,responseid:value})
        }
        console.log(oCtrl.data)
        let hardscore=Math.floor(Math.random() * 5) + 1;
        console.log(oCtrl.responsereq)
        if(oCtrl.data!==undefined){
            console.log("condition 1")
            
            if(oCtrl.data.data!==undefined)
            {
                console.log("condition 2")
                
                if(oCtrl.data.data.additionaldata!==undefined)
                {
                    console.log("condition 2a")
                    
                    //update existing
                    input = oCtrl.data.data.additionaldata;
                    input.oralassessment = oCtrl.responsereq;
                    input.hygenescore=hardscore;
                    
                }
                else
                {
                    console.log("condition 3")
                    
                    console.log("new")
                    input = {};
                    input.username = oCtrl.username;
                    input.oralassessment = oCtrl.responsereq;
                    input.hygenescore=hardscore;
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
        console.log(oCtrl.data)
        
        //save the data to profile
        consumerdataUpd(input)
            .then(data => {
                if(data.error)
                    oCtrl.errorMessage = data.error;
                else {
                    console.log(data)
                    refreshStorage.refresh(oCtrl.data.username,oCtrl.data.type)
                    oCtrl.data = localStorageService.get('genData')
                    
                }
            })
            .then(oCtrl.delay(1000))
            .then(()=>{$route.reload()})
            .catch(err => {
                oCtrl.errorMessage = err;
            });
        console.log(oCtrl.data)
        $mdDialog.cancel();
    };
    
    
    oCtrl.logout = function (target) {
        console.log("logout")
        localStorageService.remove('genData')
        $location.url('/')
    };
    oCtrl.delay = function sleeper(ms) {
        return function(x) {
            console.log("in delay")
            return new Promise(resolve => setTimeout(() => resolve(x), ms));
        };
    }
}])

.controller('DietManagerCtrl',['$scope','$rootScope','$location','localStorageService','providerList','messageList','messagePost','$uibModal','$log','getQBank','$mdDialog','consumerdataUpd','refreshStorage','uibDateParser','dietdataUpd','instantFood',function ($scope, $rootScope,$location,localStorageService,providerList,messageList,messagePost,$uibModal,$log,getQBank,$mdDialog,consumerdataUpd,refreshStorage,uibDateParser,dietdataUpd,instantFood) {
        console.log("DietManagerCtrl");
        let dmCtrl=this;
        dmCtrl.data = localStorageService.get('genData')
        dmCtrl.username = dmCtrl.data.username;
        
        let currDate = new Date();
        dmCtrl.entryDate = currDate.getFullYear() + "-" + (currDate.getMonth()+1) + "-" + currDate.getDate();
        dmCtrl.dateEntryCurr = uibDateParser.parse(new Date(dmCtrl.entryDate),dmCtrl.format)  ;
        
        dmCtrl.format = 'dd-MMMM-yyyy';
        dmCtrl.popup1 = {
            opened: false
        };
        
        dmCtrl.choices =[]
        
        console.log(dmCtrl.data)
        dmCtrl.hideForm=false;
        
        if(dmCtrl.data.data!==undefined && dmCtrl.data.data.dietdata!==undefined){
            dmCtrl.dietdata = dmCtrl.data.data.dietdata;
            dmCtrl.userdiet = dmCtrl.dietdata.filter(item => new Date(dmCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
            if(dmCtrl.userdiet!==undefined)
                dmCtrl.hideForm=true;
            else
                dmCtrl.hideForm=false;
            console.log(dmCtrl.userdiet)
        }
        
        
        
        dmCtrl.addNewChoice = function() {
            console.log("addNewChoice")
            console.log(dmCtrl.choices)
            var newItemNo = dmCtrl.choices.length+1;
            dmCtrl.choices.push({'id':'choice'+newItemNo});
            console.log(dmCtrl.choices)
            
            
        };
        
        dmCtrl.removeChoice = function(choiceid) {
            console.log("removeChoice")
            console.log(dmCtrl.choices)
            dmCtrl.choices = dmCtrl.choices.filter((item)=>item.id!==choiceid);
            
            // var lastItem = dmCtrl.choices.length-1;
            console.log(dmCtrl.choices)
            
            
            // dmCtrl.choices.splice(lastItem);
        };
        
        dmCtrl.open1 = function() {
            dmCtrl.popup1.opened = true;
        };
        
        dmCtrl.dayminusone =function() {
            var startDate = new Date(dmCtrl.dateEntryCurr);
            var day = 60 * 60 * 24 * 1000;
            var endDate = new Date(startDate.getTime() - day);
            
            dmCtrl.entryDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();
            dmCtrl.dateEntryCurr = uibDateParser.parse(new Date(endDate),dmCtrl.format)  ;
            
            if(dmCtrl.dietdata!==undefined){
                dmCtrl.userdiet = dmCtrl.dietdata.filter(item => new Date(dmCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
                if(dmCtrl.userdiet!==undefined)
                    dmCtrl.hideForm=true;
                else
                    dmCtrl.hideForm=false;
            }
            
        }
        
        dmCtrl.dayplusone =function() {
            var startDate = new Date(dmCtrl.dateEntryCurr);
            var day = 60 * 60 * 24 * 1000;
            var endDate = new Date(startDate.getTime() + day);
            
            dmCtrl.entryDate = endDate.getFullYear() + "-" + (endDate.getMonth()+1) + "-" + endDate.getDate();
            dmCtrl.dateEntryCurr = uibDateParser.parse(new Date(endDate),dmCtrl.format)  ;
            
            if(dmCtrl.dietdata!==undefined) {
                dmCtrl.userdiet = dmCtrl.dietdata.filter(item => new Date(dmCtrl.entryDate).toString() === new Date(item.entrydate).toString())[0];
                if(dmCtrl.userdiet!==undefined)
                    dmCtrl.hideForm=true;
                else
                    dmCtrl.hideForm=false;
            }
        }
        
        dmCtrl.saveFood=function () {
            console.log("save")
            
            console.log(dmCtrl.choices)
            if(dmCtrl.choices!==undefined && dmCtrl.choices.length>0){
                
                let grosscal=0;
                let req = {
                
                };
                req.username = dmCtrl.username;
                req.entrydate = dmCtrl.entryDate;
                
                let item={},selecteditem={}
                req.items=[];
                for(var i=0;i<dmCtrl.choices.length;i++){
                    item = {};
                    selecteditem = dmCtrl.choices[i].selectedfood!==undefined?dmCtrl.choices[i].selectedfood:{};
                    console.log(selecteditem)
                    
                    if(selecteditem.originalObject!==undefined && selecteditem.originalObject.food_name!==undefined){
                        item.itemname=selecteditem.originalObject.food_name;
                    }
                    
                    if(dmCtrl.choices[i].timeofday!==undefined && dmCtrl.choices[i].timeofday.length!==0)
                        item.itemcat=dmCtrl.choices[i].timeofday;
                    
                    if(dmCtrl.choices[i].selectedfoodcal!==undefined && dmCtrl.choices[i].selectedfoodcal!==0) {
                        item.numcal = dmCtrl.choices[i].selectedfoodcal;
                        grosscal=grosscal+parseInt(item.numcal);
                    }
                    else {
                        //calculate
                        if(dmCtrl.choices[i].selectedfoodqty!==undefined && dmCtrl.choices[i].selectedfoodqty!==0)
                        {
                            if(selecteditem.originalObject!==undefined && selecteditem.originalObject.details!==undefined){
                                console.log(dmCtrl.choices[i].selectedfoodqty)
                                console.log(selecteditem.originalObject.details.serving_qty)
                                console.log(selecteditem.originalObject.details.nf_calories)
                                
                                item.numcal = (dmCtrl.choices[i].selectedfoodqty/selecteditem.originalObject.details.serving_qty)*selecteditem.originalObject.details.nf_calories;
                                
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
                    
                    if(dmCtrl.choices[i].selectedfoodqty!==undefined && dmCtrl.choices[i].selectedfoodqty!==0)
                        item.serving_qty=dmCtrl.choices[i].selectedfoodqty;
                    
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
                dmCtrl.dietdata = dietdataUpd(req)
                    .then(data => {
                        if (data.error)
                            dmCtrl.errorMessage = data.error;
                        else {
                            console.log(data)
                            refreshStorage.refresh(dmCtrl.data.username, dmCtrl.data.type)
                            
                        }
                    })
                    .then(dmCtrl.delay(1000))
                    .then(()=>{
                        dmCtrl.data = localStorageService.get('genData')
                        console.log(dmCtrl.data)
                        dmCtrl.dietdata = dmCtrl.data.data.dietdata;
                        
                        dmCtrl.userdiet = dmCtrl.dietdata.filter(item => new Date(dmCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
                        if(dmCtrl.userdiet!==undefined)
                            dmCtrl.hideForm=true;
                        else
                            dmCtrl.hideForm=false;
                        console.log(dmCtrl.userdiet)
                    })
                    /*.then(function (data) {
                        console.log(data)
                        if(data.error)
                            console.log(data.error);
                        else
                        {
                            refreshStorage.refresh(dmCtrl.data.username,dmCtrl.data.type)
                            dmCtrl.data = localStorageService.get('genData')
                            dmCtrl.userdiet = data.filter(item => new Date(dmCtrl.entryDate).toString()===new Date(item.entrydate).toString())[0];
                            console.log(dmCtrl.userdiet)
                        }
                        return data;
                    })*/
                    .catch(err => {
                        dmCtrl.errorMessage = err;
                    });
                //posting
                
                dmCtrl.choices = [];
            }
            
        }
        
        dmCtrl.getFood = function (userInputString, timeoutPromise) {
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
                    }
                }
                return  {"data": a};
            })
        }
        
        dmCtrl.delay = function sleeper(ms) {
            return function(x) {
                console.log("in delay")
                return new Promise(resolve => setTimeout(() => resolve(x), ms));
            };
        }
        dmCtrl.logout = function (target) {
            console.log("logout")
            localStorageService.remove('genData')
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
        mcCtrl.formmessages =[]
        console.log(mcCtrl.data)
    
        /*Provider List*/
        var proList = providerList().then(function (data) {
            console.log(data)
            mcCtrl.providers = data;
            return data;
        })
    
        /*Selected Provider Details*/
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
    
        mcCtrl.delay = function sleeper(ms) {
            return function(x) {
                console.log("in delay")
                return new Promise(resolve => setTimeout(() => resolve(x), ms));
            };
        }
        
        /*Message List*/
        messageList("MESSAGE",mcCtrl.data.username)
            .then(mcCtrl.delay(1000))
            .then(function (data) {
                console.log(data)
                console.log(data.length)
                var arr;
                let item={};
                mcCtrl.formmessages = data;

                if(data!==undefined && data.length!==0)
                {
                    proList.then(
                        function(data2)
                        {
                            arr = [];
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
                            mcCtrl.formmessages = arr;
                        }
                    )
                    
                }
        })
    
    
        /*Message Send*/
        mcCtrl.submitSendMessage = function(form){
            console.log("Message Submit")
            console.log(form.$valid)
            if(form.$valid==true)
            {
                mcCtrl.validForm=true;
                form.$submitted = false;
                
                var reqBody = {
                    "commtype":"MESSAGE",
                    "fromusername":mcCtrl.data.username,
                    "tousername":mcCtrl.tousername,
                    "message":mcCtrl.formmessage
                }
                console.log(reqBody);
                messagePost(reqBody)
                    .then(data => {
                        if(data.error)
                            ctrl.errorMessage = data.error;
                        else {
                            //console.log("login")
                            console.log(data)
                            mcCtrl.formmessage="";
                            mcCtrl.tousername="";
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
                                mcCtrl.formmessages = arr;
                            }
                        )
                        
                        
                        // mcCtrl.messages = data;
                    })
                    .catch(err => {
                        mcCtrl.formmessages = data;;
                    });
            }
        }
    
        /*Provider Details Popup*/
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
    
        /*Chat Section*/
        mcCtrl.connectToChat = function() {
            console.log("connectToChat")
            /*console.log(mcCtrl)
            console.log(mcCtrl.data.data)
            console.log(mcCtrl.data.data.commondata)
            console.log(mcCtrl.data.data.commondata.chathandle)*/
            if(mcCtrl.data.data!==undefined && mcCtrl.data.data.commondata!=='undefined' && mcCtrl.data.data.commondata.chathandle!==undefined) {
                console.log(mcCtrl.data.data.commondata.chathandle)
                
                mcCtrl.enableChatWindow = true;
                mcCtrl.showCreateChatHandle = false;
                
                
                mcCtrl.messages = [];
                
                var socket = io.connect({query:"name="+mcCtrl.data.data.commondata.chathandle});
                
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
    
        
        mcCtrl.logout = function (target) {
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
        if(pCtrl.data.data!==undefined && pCtrl.data.data.commondata!==undefined){
            //process common data
            let commData = pCtrl.data.data.commondata;
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
        if(pCtrl.data.data!==undefined && pCtrl.data.data.additionaldata!==undefined){
            let addData = pCtrl.data.data.additionaldata;
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





