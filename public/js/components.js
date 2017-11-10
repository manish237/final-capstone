angular.module('componentLibrary', [])
    .component('loginForm', {
        templateUrl: '../login.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function(login,commondata,consumerdata,providerdata,$uibModal,$log,$location,localStorageService,profiledetails) {
            var theResults = {};

            console.log("loginctrl")
            $ctrl = this;
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
                            }
                            else {
                                return profiledetails($ctrl.loginUname)
                            }
                        })
                        .then(data=>{
                            if(data.error){
                                $ctrl.errorMessage = data.error;
                                return Promise.reject({
                                    error: data.error
                                });
                            }
                            else {
                                theResults = data;
                                $ctrl.close({$value: {
                                    type:"login",
                                    username:$ctrl.loginUname,
                                    data:theResults
                                }});
                            }
                        })
                        .catch(err => {
                            $ctrl.errorMessage = err.error;
                        });
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
                    console.log(parent)
                    localStorageService.set('genData',selectedItem)
                    $location.url('/Overview')
                    parent.close({$value: selectedItem});
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
                    console.log(parent)
                    localStorageService.set('genData',selectedItem)
                    $location.url('/Overview')
                    parent.close({$value: selectedItem});
                    //redirect to home page
                }, function () {
                    $log.info('modal-component 2 dismissed at: ' + new Date());
                    console.log($ctrl)
                    $ctrl.cancel();
                });
            }
        }
    })
    .component('registerForm', {
        templateUrl: '../register.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function(registration) {
            var theResults = {};

            console.log("registerctrl")
            var parent;
            // console.log($ctrl===null)
            if((typeof $ctrl)!=='undefined'){
                console.log($ctrl)
                parent = $ctrl;
                console.log(parent)
            }

            $ctrl = this;

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
                            return profiledetails($ctrl.uname)
                        }
                    })
                    .then(data=>{
                        if(data.error){
                            $ctrl.errorMessage = data.error;
                            return Promise.reject({
                                error: data.error
                            });
                        }
                        else {
                            theResults = data;
                            $ctrl.close({$value: {
                                type:"register",
                                username:$ctrl.uname,
                                data:theResults
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
                if((typeof parent)!=='undefined') {
                    parent.dismiss({$value: 'cancel'})
                }
            };
        }
    })
    .component('resetForm', {
        templateUrl: '../reset.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function(resetLogin,commondata,consumerdata,providerdata,profiledetails) {
            var theResults = {};

            console.log("resetctrl")
            console.log($ctrl)
            var parent = $ctrl;
            console.log(parent)

            $ctrl = this;

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
                        }
                        else {
                            return profiledetails($ctrl.resetUname)
                        }
                    })
                    .then(data=>{
                        if(data.error){
                            $ctrl.errorMessage = data.error;
                            return Promise.reject({
                                error: data.error
                            });
                        }
                        else {
                            theResults=data;
                            $ctrl.close({$value: {
                                type:"reset",
                                username:$ctrl.resetUname,
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
        }

    })


    .component('providerDetails', {
        templateUrl: '../providerdetails.html',
        bindings: {
            resolve: '<',
            close: '&',
            dismiss: '&'
        },
        controller: function() {
            var $ctrl = this;

            $ctrl.$onInit = function () {
                $ctrl.details = $ctrl.resolve.items;
                console.log($ctrl.resolve.items)
            };

            $ctrl.cancel = function () {
                console.log("close reset")

                $ctrl.close();
            };
        }

    })
