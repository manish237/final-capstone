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
    .factory('dataStorage', [function() {
        var loginData = {};
        var registerData = {};
        var resetData = {};
        var genData = {};

        return {
            setLoginData: function(data) {
                loginData = data;
            },
            setRegisterData: function(data) {
                registerData = data;
            },
            setResetData: function(data) {
                resetData = data;
            },
            setGenData: function(data) {
                genData = data;
            },
            getLoginData: function() {
                return loginData;
            },
            getRegisterData: function() {
                return registerData;
            },
            getResetData: function() {
                return resetData;
            },
            getGenData: function() {
                return genData;
            }
        };
    }])


    .factory('providerList', ['$http','$cacheFactory', '$q','myCache', 'API_GET_PROVIDER_LIST', function($http, $cacheFactory,$q, myCache,API_GET_PROVIDER_LIST){
        return function(){
            //console.log("providerList")
            // console.log(params)
            //var reqParams = {"username": CAC_API_USER_NAME};

            //var cacheData = myCache.get('myData');
            // console.log(cacheData)
            var cacheData = $cacheFactory.get('$http');
            console.log(cacheData.get(API_GET_PROVIDER_LIST))


            if(cacheData.get(API_GET_PROVIDER_LIST)) {
                console.log("mycache hit")
                return $q.when(cacheData)
            }
            else {
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
            }
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
            console.log("login--" + params)
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
        return function(uname){
            console.log("handleExists--" + uname)
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
