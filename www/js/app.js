
var app = angular.module('TempoHub', ['ionic', 'TempoHub.controllers', 'ngMessages'])//, 'TempoHub.controllers', 'TempoHub.services'])

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
            .state('mainMenu.contact', {
                url: "/contact",
                views: {
                    'menuContent': {
                        templateUrl: "views/contact.html"
                    }
                }
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
            })

            .state('clipsMenu', {
                url: '/clipsMenu',
                abstract: true,
                templateUrl: 'views/clipsMenu.html'
            })
            .state('clipsMenu.clips', {
                url: '/clips',
                views: {
                    'clipsMenuContent': {
                        templateUrl: 'views/clips.html',
                        controller: 'clipsCtrl'
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

    UserDetails.set = function(email, mobileNumber, lastVotedTime) {
        console.log("UserDetails.set called");
        UserDetails.email = email;
        UserDetails.mobileNumber = mobileNumber;
        UserDetails.lastVotedTime = lastVotedTime;
        UserDetails.setLocalStorage();
        console.log("After UserDetails.set call, UserDetails.email =" + UserDetails.email + ", UserDetails.mobileNumber =" + UserDetails.mobileNumber + ", lastVotedTime =" + UserDetails.lastVotedTime);
    }

    UserDetails.setEmail = function(email) {
        console.log("UserDetails.setEmail called");
        window.localStorage['email'] = email;
        UserDetails.email = window.localStorage['email'];
        console.log("UserDetails.setEmail call complete");
    }

    UserDetails.setMobileNumber = function(mobileNumber) {
        console.log("UserDetails.setMobileNumber called");
        window.localStorage['mobileNumber'] = mobileNumber;
        UserDetails.mobileNumber = window.localStorage['mobileNumber'];
        console.log("UserDetails.setMobileNumber call complete");
    }

    UserDetails.setLastVotedTime = function(lastVotedTime) {
        console.log("UserDetails.setLastVotedTime called");
        window.localStorage['lastVotedTime'] = lastVotedTime;
        UserDetails.lastVotedTime = window.localStorage['lastVotedTime'];
        console.log("UserDetails.setLastVotedTime call complete");
    }

    UserDetails.reset = function () {
        console.log("UserDetails.reset called");
        UserDetails.set(null, null, null);
        UserDetails.resetLocalStorage();
        console.log("After UserDetails.reset call, UserDetails.email =" + UserDetails.email + ", UserDetails.mobileNumber =" + UserDetails.mobileNumber + ", lastVotedTime =" + UserDetails.lastVotedTime);
    }

    UserDetails.setLocalStorage = function() {
        console.log("UserDetails.setLocalStorage called");
        window.localStorage['email'] = UserDetails.email;
        window.localStorage['mobileNumber'] = UserDetails.mobileNumber;
        window.localStorage['lastVotedTime'] = UserDetails.lastVotedTime;
        console.log("After UserDetails.setLocalStorage call, window.localStorage['email'] =" + window.localStorage['email'] + ", window.localStorage['mobileNumber'] =" + window.localStorage['mobileNumber']);
    }

    UserDetails.resetLocalStorage = function() {
        console.log("UserDetails.resetLocalStorage called");
        window.localStorage['email'] = null;
        window.localStorage['mobileNumber'] = null;
        window.localStorage['lastVotedTime'] = null;
        console.log("After UserDetails.resetLocalStorage call, window.localStorage['email'] =" + window.localStorage['email'] + ", window.localStorage['mobileNumber'] =" + window.localStorage['mobileNumber']);
    }

    UserDetails.hasUser = function () {
        if (window.localStorage['email'] != "null" && window.localStorage['email'] != null && window.localStorage['email'] != undefined) {
            UserDetails.set(window.localStorage['email'], window.localStorage['mobileNumber'], window.localStorage['lastVoteTime'], window.localStorage['password']);
            return true;
            console.log("UserDetails.hasUser called: result is true");
        } else {
            return false;
            console.log("UserDetails.hasUser called: result is false");
        }
    }

    return UserDetails;
});
