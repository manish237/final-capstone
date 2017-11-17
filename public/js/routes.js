angular.module('routeLibrary',['ngRoute'])

    .config(['$routeProvider','$locationProvider',function ($routeProvider,$locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.caseInsensitiveMatch=true;
        $routeProvider
            .when('/',{
                templateUrl: './home.html',
                controller : 'HomeController',
                controllerAs: 'hCtrl',
                css: {
                    href: 'css/home.css',
                    persist: true,
                    preload: true,
                    bustCache: true
                }
            })
            .when('/Overview',{
                templateUrl: './overview.html',
                controller : 'OverviewCtrl',
                controllerAs: 'oCtrl',
                css: {
                    href: 'css/overview.css',
                    persist: true,
                    preload: true,
                    bustCache: true
                }

            })
            .when('/Profile',{
                templateUrl: './profile.html',
                controller : 'ProfileCtrl',
                controllerAs: 'pCtrl',
                css: {
                    href: 'css/profile.css',
                    persist: true,
                    preload: true,
                    bustCache: true
                }

            })
            .when('/MessageCenter',{
                templateUrl: './messagecenter.html',
                controller : 'MessageCenterCtrl',
                controllerAs: 'mcCtrl',
                css: {
                    href: 'css/mcenter.css',
                    persist: true,
                    preload: true,
                    bustCache: true
                }
            })
            .when('/Diet',{
                templateUrl: './dietmanager.html',
                controller : 'DietManagerCtrl',
                controllerAs: 'dmCtrl',
                css: {
                    href: './css/dietmanager.css',
                    persist: true,
                    preload: true,
                    bustCache: true
                }

            })
            .when('/error', {
                template : '<p>Error Page Not Found</p>'
            })
            .otherwise('/');
    }])
    .run(['$rootScope', '$location', '$timeout', function($rootScope, $location ,$timeout) {
        $rootScope.$on('$routeChangeError', function() {
            $location.path('/error');
        });
        $rootScope.$on('$routeChangeStart', function() {
            $rootScope.isLoading = true;
        });
        $rootScope.$on('$routeChangeSuccess', function() {
            $timeout(function() {
                $rootScope.isLoading = false;
            }, 1000);
        });
    }])