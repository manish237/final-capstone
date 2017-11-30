angular.module('apiLibrary', ['apiLibraryConstants'])
    .config(function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
    })
    .factory('myCache', function($cacheFactory) {
        return $cacheFactory('myData');
    })
    .factory('_', function() {
        return window._; // assumes underscore has already been loaded on the page
    })

    .factory('refreshStorage', ['regdata','commondata','consumerdata','providerdata','localStorageService','profiledetails',function(regdata,commondata,consumerdata,providerdata,localStorageService,profiledetails) {
        return {
            refresh: function(uname,type) {
                console.log(uname)
                console.log(type)
                var theResults = {};
                profiledetails(uname)
                    .then(data=>{
                        console.log("refreshStorage 01")
                        "use strict";
                        if(data.error) {
                            console.log("refreshStorage 02")
                            return Promise.reject({
                                error: data.error
                            });
                        }
                        else
                        {
                            console.log("refreshStorage 03")
                            theResults=data;

                            let ds = {
                                type:type,
                                username:uname,
                                usertype:theResults.commondata.usertype,
                                data:theResults
                            }
                            console.log(ds)
                            localStorageService.set('genData',ds)
                        }
                    })
                    .catch(err => {
                        theResults={};
                    });
            }
        };
    }])
    .factory('providerList', ['$http','$cacheFactory', '$q','myCache', 'API_GET_PROVIDER_LIST', function($http, $cacheFactory,$q, myCache,API_GET_PROVIDER_LIST){
        return function(){
            console.log("providerList")
            // console.log(params)
            //var reqParams = {"username": CAC_API_USER_NAME};

            //var cacheData = myCache.get('myData');
            // console.log(cacheData)
            var cacheData = $cacheFactory.get('$http');
            console.log(cacheData.get(API_GET_PROVIDER_LIST))


            /*if(cacheData.get(API_GET_PROVIDER_LIST)) {
                console.log("mycache hit")
                console.log(cacheData.get(API_GET_PROVIDER_LIST))
                return $q.when(cacheData.get(API_GET_PROVIDER_LIST)[1])
            }
            else {*/
            console.log("service hit")
            return $http({
                method: 'GET',
                url: API_GET_PROVIDER_LIST,
                // params: reqParams,
                cache:true
            })
            .then(
                function (response) {
                    console.log(response.data)
                    //console.log("success list")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    return $q.when(response.data);
                },
                function (response) {
                    // alert('error');
                    console.log("fail")
                    return $q.when({});
                })
            // }
        };
    }])
    .factory('messageList', ['$http','$cacheFactory', '$q','myCache', 'API_GET_MESSAGE', function($http, $cacheFactory,$q, myCache,API_GET_MESSAGE){
        return function(commtype,uname){
            console.log("messageList " + commtype + " " + uname)
            // console.log(params)
            //var reqParams = {"username": CAC_API_USER_NAME};

            //var cacheData = myCache.get('myData');
            // console.log(cacheData)
            var cacheData = $cacheFactory.get('$http');
            console.log(cacheData.get(API_GET_MESSAGE))


            /*if(cacheData.get(API_GET_MESSAGE)) {
                console.log("mycache hit")
                return $q.when(cacheData)
            }
            else {*/
                console.log("service hit")
                return $http({
                    method: 'GET',
                    url: API_GET_MESSAGE+commtype+"/"+uname,
                    // params: reqParams,
                    cache:false
                })
                .then(
                    function (response) {
                        console.log(response.data)
                        //console.log("success list")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        return $q.when(response.data);
                    },
                    function (response) {
                        // alert('error');
                        console.log("fail")
                        return $q.when({});
                    })
            // }
        };
    }])

    .factory('registration', ['$http', '$q','API_POST_REGISTER', function($http, $q, API_POST_REGISTER){
        return function(params){
            console.log("registration--" + params)
            return $http({
                method: 'POST',
                url: API_POST_REGISTER,
                data: params,

            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function (error, status) {
                    // alert('error');
                    console.log("fail")
                    console.log(error.data.message)
                    console.log(error.status)
                    return $q.when({"error":error.data.message,"status":error.status});
                    // return $q.reject({"error":"error"});
                })

        };
    }])

	.factory('login', ['$http', '$q','API_POST_LOGIN', function($http, $q, API_POST_LOGIN){
        return function(params){
            console.log("login--")
            console.log(params)
            return $http({
                method: 'POST',
                url: API_POST_LOGIN,
                data: params,

            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function (error, status) {
                    // alert('error');
                    console.log("fail")
                    console.log(error.data.message)
                    console.log(error.status)
                    return $q.when({"error":error.data.message,"status":error.status});
                    // return $q.reject({"error":"error"});
                })

        };
    }])
    .factory('resetLogin', ['$http', '$q','API_PUT_RESET_PASSWORD', function($http, $q, API_PUT_RESET_PASSWORD){
        return function(params){
            console.log("login--" + params)
            return $http({
                method: 'PUT',
                url: API_PUT_RESET_PASSWORD + params.username,
                data: params,

            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
    .factory('regdata', ['$http', '$q','API_GET_UNAME', function($http, $q, API_GET_UNAME){
        return function(uname){
            console.log("regdata--" + uname)
            return $http({
                method: 'GET',
                url: API_GET_UNAME+uname
            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function (error, status) {
                    // alert('error');
                    console.log("fail")
                    console.log(error.data.message)
                    console.log(error.status)
                    return $q.when({"error":error.data.message,"status":error.status});
                    // return $q.reject({"error":"error"});
                })

        };
    }])
    .factory('commondata', ['$http', '$q','API_GET_COMMON_PROFILE', function($http, $q, API_GET_COMMON_PROFILE){
        return function(uname){
            console.log("commondata--" + uname)
            return $http({
                method: 'GET',
                url: API_GET_COMMON_PROFILE+uname
            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function (error, status) {
                    // alert('error');
                    console.log("fail")
                    console.log(error.data.message)
                    console.log(error.status)
                    return $q.when({"error":error.data.message,"status":error.status});
                    // return $q.reject({"error":"error"});
                })

        };
    }])
    .factory('commondataUpd', ['$http', '$q','API_POST_COMMON_PROFILE', function($http, $q, API_POST_COMMON_PROFILE){
        return function(params){
            console.log("commondataUpd--")
            console.log(params)
            return $http({
                method: 'POST',
                url: API_POST_COMMON_PROFILE,
                data:params

            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
    .factory('profiledetails', ['$http', '$q','API_GET_PROFILE_INFO', function($http, $q, API_GET_PROFILE_INFO){
        return function(uname){
            console.log("profiledetails--" + uname)
            return $http({
                method: 'GET',
                url: API_GET_PROFILE_INFO+uname
            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function (error, status) {
                    // alert('error');
                    console.log("fail")
                    console.log(error.data.message)
                    console.log(error.status)
                    return $q.when({"error":error.data.message,"status":error.status});
                    // return $q.reject({"error":"error"});
                })
            
        };
    }])
    .factory('consumerdata', ['$http', '$q','API_GET_CONSUMER_PROFILE', function($http, $q, API_GET_CONSUMER_PROFILE){
        return function(uname){
            console.log("consumerdata--" + uname)
            return $http({
                method: 'GET',
                url: API_GET_CONSUMER_PROFILE+uname
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
    .factory('consumerdataUpd', ['$http', '$q','API_POST_CONSUMER_PROFILE', function($http, $q, API_POST_CONSUMER_PROFILE){
        return function(params){
            console.log("consumerdataUpd--")
            console.log(params)
            return $http({
                method: 'POST',
                url: API_POST_CONSUMER_PROFILE,
                data:params
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
    .factory('providerdata', ['$http', '$q','API_GET_PROVIDER_PROFILE', function($http, $q, API_GET_PROVIDER_PROFILE){
        return function(uname){
            console.log("providerdata--" + uname)
            return $http({
                method: 'GET',
                url: API_GET_PROVIDER_PROFILE+uname
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
    .factory('providerdataUpd', ['$http', '$q','API_POST_PROVIDER_PROFILE', function($http, $q, API_POST_PROVIDER_PROFILE){
        return function(params){
            console.log("providerdataUpd--")
            console.log(params)

            return $http({
                method: 'POST',
                url: API_POST_PROVIDER_PROFILE,
                data:params
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
    .factory('messagePost', ['$http', '$q','API_POST_MESSAGE', function($http, $q, API_POST_MESSAGE){
        return function(params){
            console.log("messagePost--")
            console.log(params)

            return $http({
                method: 'POST',
                url: API_POST_MESSAGE,
                data:params
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
    .factory('unameExists', ['$http', '$q','API_GET_UNAME_EXISTS', function($http, $q, API_GET_UNAME_EXISTS){
        return function(uname){
            console.log("unameExists--" + uname)
            return $http({
                method: 'GET',
                url: API_GET_UNAME_EXISTS + uname
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data.exists);
                    },
                    function () {
                        // alert('error');
                        console.log("fail")
                        return $q.when({});
                    })

        };
    }])
    .factory('handleExists', ['$http', '$q','API_GET_CHAT_HANDLE_EXISTS', function($http, $q, API_GET_CHAT_HANDLE_EXISTS){
        return function(uname,requestor){
            console.log("handleExists--" + uname + " " + requestor)
            return $http({
                method: 'GET',
                url: API_GET_CHAT_HANDLE_EXISTS + uname
            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    if(response.data.data!==undefined && response.data.data.length===1)
                    {
                        if(response.data.data[0].username===requestor)
                        {
                            return $q.when(false);
                        }
                        else
                            return $q.when(true);
                    }
                    return $q.when(response.data.exists);
                },
                function () {
                    // alert('error');
                    console.log("fail")
                    return $q.when({});
                })

        };
    }])

    .factory('instantFood', ['$http', '$q','API_GET_EXT_NUTRITIONIX_INSTANT', function($http, $q, API_GET_EXT_NUTRITIONIX_INSTANT){
        return function(query){
            console.log("instantFood--" + query)
            return $http({
                method: 'GET',
                url: API_GET_EXT_NUTRITIONIX_INSTANT,
                params: {query:query}
            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function () {
                    // alert('error');
                    console.log("fail")
                    return $q.when({});
                })

        };
    }])
    .factory('getFeeds', ['$http', '$q','API_GET_FEEDS', function($http, $q, API_GET_FEEDS){
        return function(){
            console.log("getFeeds--")
            return $http({
                method: 'GET',
                url: API_GET_FEEDS
            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function () {
                    // alert('error');
                    console.log("fail")
                    return $q.when({});
                })

        };
    }])
    .factory('instantLoc', ['$http', '$q','API_GET_META_LOC', function($http, $q, API_GET_META_LOC){
        return function(query){
            console.log("Loc--" + query)
            return $http({
                method: 'GET',
                url: API_GET_META_LOC,
                params: {qs:query}
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function () {
                        // alert('error');
                        console.log("fail")
                        return $q.when({});
                    })

        };
    }])
    .factory('getLang', ['$http', '$q', function($http, $q){
        return function(){
            console.log("getLang--")
            return $http({
                method: 'GET',
                url: '../data/languages.json'
            })
            .then(
                function (response) {
                    // console.log(response.data)
                    console.log("success")
                    return $q.when(response.data);
                },
                function () {
                    // alert('error');
                    console.log("fail")
                    return $q.when({});
                })

        };
    }])
    .factory('getQBank', ['$http', '$q', 'API_GET_QUES_BANK', function($http, $q,API_GET_QUES_BANK){
        return function(cat){
            console.log("getQBank--" + cat)
            return $http({
                method: 'GET',
                url: API_GET_QUES_BANK+cat
            })
            .then(
                function (response) {
                    console.log("getQBank success")
                    console.log(response.data)
                    return $q.when(response.data);
                },
                function () {
                    // alert('error');
                    console.log("fail")
                    return $q.when({});
                })

        };
    }])
    .factory('dietdata', ['$http', '$q','API_GET_USER_DIET', function($http, $q, API_GET_USER_DIET){
        return function(uname){
            console.log("dietdata--" + uname)
            return $http({
                method: 'GET',
                url: API_GET_USER_DIET+uname
            })
            .then(
                function (response) {
                    console.log(response.data)
                    console.log("success")
                    // console.log(response.data.geonames)
                    // myCache.put('myData', response.data.geonames);
                    // console.log(myCache.get('myData'))
                    // if(response.data.exists)
                    //     return true;
                    // else
                    //     return false;
                    return $q.when(response.data);
                },
                function (error, status) {
                    // alert('error');
                    console.log("fail")
                    console.log(error.data.message)
                    console.log(error.status)
                    return $q.when({"error":error.data.message,"status":error.status});
                    // return $q.reject({"error":"error"});
                })

        };
    }])
    .factory('dietdataUpd', ['$http', '$q','API_POST_USER_DIET', function($http, $q, API_POST_USER_DIET){
        return function(params){
            console.log("dietdataUpd--")
            console.log(params)

            return $http({
                method: 'POST',
                url: API_POST_USER_DIET,
                data:params
            })
                .then(
                    function (response) {
                        console.log(response.data)
                        console.log("success")
                        // console.log(response.data.geonames)
                        // myCache.put('myData', response.data.geonames);
                        // console.log(myCache.get('myData'))
                        // if(response.data.exists)
                        //     return true;
                        // else
                        //     return false;
                        return $q.when(response.data);
                    },
                    function (error, status) {
                        // alert('error');
                        console.log("fail")
                        console.log(error.data.message)
                        console.log(error.status)
                        return $q.when({"error":error.data.message,"status":error.status});
                        // return $q.reject({"error":"error"});
                    })

        };
    }])
