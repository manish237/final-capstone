angular.module('dirLibrary', ['apiLibrary'])

.directive("passwordMatcher", function() {
    return {
        restrict : "A",

        require : "ngModel",

        link : function(scope, element, attributes, ngModel) {
            //console.log("in confirm password directive")
            ngModel.$validators.matcher = function(modelValue) {
                //console.log(attributes.passwordMatcher)
                // console.log(attributes)
                //console.log(modelValue)
                return attributes.passwordMatcher === modelValue;
            };
        }
    };
})


.directive('usernameValidator', ['$http', '$q', 'unameExists',function($http,$q,unameExists) {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function($scope, element, attributes, ngModel) {

/*            var x = unameExists;
            console.log(x)*/
            // ngModel.$asyncValidators.unique = function(modelValue , viewValue) {

            /*ngModel.$asyncValidators.uniqueUsername = function(modelValue, viewValue) {
                console.log("call- " +modelValue + " " + viewValue)
                return $http.get('/auth/exists/'+modelValue||viewValue).then(
                    function(response) {
                        console.log("call - ");
                        console.log(response.data)
                        if (response.data.exists) {
                            return $q.reject("error!!!!!");
                        }
                        return true;
                    }
                );
            };*/


            ngModel.$asyncValidators.uniqueUsername = function(modelValue , viewValue) {
                //console.log("call- " +modelValue + " " + viewValue)
                // var userInput= modelValue || viewValue;
                return unameExists(modelValue||viewValue)
                    .then(function(response) {
                        //username exists, this means validation success
                        // console.log("call suuccess- ");
                        // console.log(response)
                        if (response) {
                            return $q.reject("error!!!!!");
                        }
                        return true;
                    });
            }
    }
    }
}])

.directive('chatHandleValidator', ['$http', '$q', 'handleExists',function($http,$q,handleExists) {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function($scope, element, attributes, ngModel) {
            ngModel.$asyncValidators.uniqueChatHandle = function(modelValue , viewValue) {
                //console.log("call- " +modelValue + " " + viewValue)
                // var userInput= modelValue || viewValue;
                return handleExists(modelValue||viewValue)
                    .then(function(response) {
                        //username exists, this means validation success
                        // console.log("call suuccess- ");
                        // console.log(response)
                        if (response) {
                            return $q.reject("error!!!!!");
                        }
                        return true;
                    });
            }
        }
    }
}])



.directive('loginWindow', ['$http', '$q', 'instantFood',function($http,$q,instantFood) {
    return {
        restrict: 'E',
        templateUrl:"../reset.html",
        replace : true
        /*link : function($scope, element, attributes) {

            ngModel.$asyncValidators.uniqueUsername = function(modelValue , viewValue) {
                //console.log("call- " +modelValue + " " + viewValue)
                // var userInput= modelValue || viewValue;
                return unameExists(modelValue||viewValue)
                    .then(function(response) {
                        //username exists, this means validation success
                        // console.log("call suuccess- ");
                        // console.log(response)
                        if (response) {
                            return $q.reject("error!!!!!");
                        }
                        return true;
                    });
            }
        }*/
    }
}])


.directive('foodAutoComplete', ['$http', '$q', 'instantFood',function($http,$q,instantFood) {
    return {
        restrict: 'A',
        require : 'ngModel',
        link : function($scope, element, attributes, ngModel) {

            ngModel.$asyncValidators.uniqueUsername = function(modelValue , viewValue) {
                //console.log("call- " +modelValue + " " + viewValue)
                // var userInput= modelValue || viewValue;
                return unameExists(modelValue||viewValue)
                    .then(function(response) {
                        //username exists, this means validation success
                        // console.log("call suuccess- ");
                        // console.log(response)
                        if (response) {
                            return $q.reject("error!!!!!");
                        }
                        return true;
                    });
            }
        }
    }
}])
.directive('googleplace', function() {
    return {
        require: 'ngModel',
        scope:{
            ngModel: '=',
            details: '=?',
            test:'=?'
        },
        link: function(scope, element, attrs, model) {
            // console.log("gplace 01")
            //
            // console.log(element)

            scope.gPlace = new google.maps.places.Autocomplete(element[0], {});

            // console.log(model)

            google.maps.event.addListener(scope.gPlace, 'place_changed', function() {
                scope.$apply(function() {
                    //
                    // console.log(model)
                    // console.log(scope.gPlace)
                    // console.log(element.val())
                    scope.test = "hello text"
                    scope.details = scope.gPlace.getPlace();
                    model.$setViewValue(element.val());
                });
            });
        }
    };
})

