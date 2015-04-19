
var app = angular.module('TempoHub', ['ionic', 'TempoHub.controllers'])//, 'TempoHub.controllers', 'TempoHub.services'])

/*app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});*/
app.config(function($stateProvider, $urlRouterProvider) {

        $stateProvider
            .state('SignIn', {
                url: '/signIn',
                templateUrl: 'views/signIn.html'
            })
            .state('SignUp', {
                url: '/signUp',
                templateUrl: 'views/signUp.html'
            })
            .state('ForgotPassword', {
                url: '/forgotPassword',
                templateUrl: 'views/forgotPassword.html'
            })
			.state('SecurityQuestion', {
                url: '/securityQuestion',
                templateUrl: 'views/securityQuestion.html'
            })
            .state('EditDetails', {
                url: '/EditDetails',
                templateUrl: 'views/editDetails.html'
            })
            .state('mainMenu', {
                url: '/mainMenu',
                abstract: true,
                templateUrl: 'views/mainMenu.html'
            })
            .state('mainMenu.mainPage', {
                url: "/mainPage",
                views: {
                    'menuContent': {
                        templateUrl: "views/mainPage.html"
                    }
                }
            })
            .state('mainMenu.info', {
                url: "/info",
                views: {
                    'menuContent': {
                        templateUrl: "views/info.html"
                    }
                }
            })
            .state('clipsMenu', {
                url: '/clipsMenu',
                templateUrl: 'views/clipsMenu.html'
            })
            .state('votingMenu', {
                url: '/votingMenu',
                abstract: true,
                templateUrl: 'views/votingMenu.html'
            })
            .state('votingMenu.current', {
                url: '/current',
                views: {
                    'current': {
                        templateUrl: 'views/current.html',
                        controller: 'currentCtrl'
                    }
                }
            })
            .state('votingMenu.previous', {
                url: '/previous',
                views: {
                    'previous': {
                        templateUrl: 'views/previous.html',
                        controller: 'previousCtrl'
                    }
                }
            })


    $urlRouterProvider.otherwise('/signIn');
    });
app.service("UserQuestion", function UserQuestion(){
    var UserQuestion = this
    UserQuestion.question="Default";
    UserQuestion.email = "Default";
});