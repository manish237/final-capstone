angular.module('routeLibrary',['ngRoute'])
    .config(['$routeProvider','$locationProvider',function ($routeProvider,$locationProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.caseInsensitiveMatch=true;
        $routeProvider
            .when('/',{
                templateUrl: './home.html',
                controller : 'MainController',
                controllerAs: 'ctrl',
                css:'css/index.css'
            })
            .when('/Overview',{
                templateUrl: './overview.html',
                controller : 'OverviewCtrl',
                controllerAs: 'oCtrl',
                css:'css/overview.css'

            })
            .when('/Profile',{
                templateUrl: './profile.html',
                controller : 'ProfileCtrl',
                controllerAs: 'pCtrl',
                css:'css/profile.css'

            })
            .when('/MessageCenter',{
                templateUrl: './messagecenter.html',
                controller : 'MessageCenterCtrl',
                controllerAs: 'mcCtrl',
                css:'css/mcenter.css'

            })
            .when('/Diet',{
                templateUrl: './dietmanager.html',
                controller : 'DietManagerCtrl',
                controllerAs: 'dmCtrl',
                css:'css/diet.css'

            })
            .when('/HealthAssessment',{
                templateUrl: './HealthAssess.html',
                controller : 'HealthAssessCtrl',
                controllerAs: 'haCtrl',
                css:'css/healthas.css'
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