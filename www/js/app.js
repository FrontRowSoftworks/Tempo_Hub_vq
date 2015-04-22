
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
            .state('ResetPassword', {
                url: '/resetPassword',
                templateUrl: 'views/resetPassword.html'
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
            .state('mainMenu.editDetails', {
                url: '/editDetails',
                views: {
                    'menuContent': {
                        templateUrl: "views/editDetails.html"
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
                    'votingMenuContent': {
                        templateUrl: 'views/current.html',
                        controller: 'currentCtrl'
                    }
                }
            })
            .state('votingMenu.single', {
                url: "/current/:videoId",
                views: {
                    'votingMenuContent': {
                        templateUrl: "views/videoPage.html",
                        controller: 'currentCtrl'
                    }
                }
            })

            .state('votingMenu.previous', {
                url: '/previous',
                views: {
                    'votingMenuContent': {
                        templateUrl: 'views/previous.html',
                        controller: 'previousCtrl'
                    }
                }
            });


    $urlRouterProvider.otherwise('/signIn');
    });
app.service("UserQuestion", function UserQuestion(){
    var UserQuestion = this;
    UserQuestion.question="Default";
    UserQuestion.email = "Default";

    var reset = function () {
        UserQuestion.question = "Default";
        UserQuestion.email = "Default";
    }
});
app.factory("UserDetails", function () {
    var UserDetails  = {
        email: null,
        mobileNumber: null,
        lastVotedTime: null
    }

    UserDetails.set = function(email, mobileNumber, country) {
        UserDetails.email = email;
        UserDetails.mobileNumber = mobileNumber;
        UserDetails.country = country;
        console.log ("UD: " + UserDetails.email + ", " + UserDetails.mobileNumber + ", " + UserDetails.country);
    }

    UserDetails.reset = function () {
        UserDetails.set(null, null, null);
    }

    return UserDetails;
});
