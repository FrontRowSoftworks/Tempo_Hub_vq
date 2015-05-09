
var app = angular.module('TempoHub', ['ionic', 'TempoHub.controllers', 'ngMessages', 'ngCordova'])

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
                cache: false,
                url: '/current',
                views: {
                    'votingMenuContent': {
                        templateUrl: 'views/current.html',
                        controller: 'CurrentCtrl'
                    }
                }
            })
            .state('votingMenu.single', {
                url: "/current/:videoId",
                views: {
                    'votingMenuContent': {
                        templateUrl: "views/videoPage.html",
                        controller: 'viewVideoCtrl'
                    }
                },
                onEnter: function(){
                    console.log("Hi there");
                    setTimeout("brightcove.createExperiences()", 1);

                },
                onExit: function(){
                    console.log("goodBye!!!");
                }
            })
            .state('votingMenu.previous', {
                cache: false,
                url: '/previous',
                views: {
                    'votingMenuContent': {
                        templateUrl: 'views/previous.html',
                        controller: 'PreviousCtrl'
                    }
                }
            })
            .state('clipsMenu', {
                url: '/clipsMenu',
                abstract: true,
                templateUrl: 'views/clipsMenu.html'
            })
            .state('clipsMenu.clips', {
                cache: false,
                url: '/clips',
                views: {
                    'clipsMenuContent': {
                        templateUrl: 'views/clips.html',
                        controller: 'clipsCtrl'
                    }
                },
                onEnter: function(){
                    console.log("entering clips");
                    setTimeout("brightcove.createExperiences()", 1);

                },
                onExit: function(){
                    console.log("leaving clips");
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
        UserDetails.setEmail(email);
        UserDetails.setMobileNumber(mobileNumber);
        UserDetails.setLastVotedTime(lastVotedTime);
        console.log("After UserDetails.set call, UserDetails.email=" + UserDetails.email + ", UserDetails.mobileNumber=" + UserDetails.mobileNumber + ", lastVotedTime=" + UserDetails.lastVotedTime);
    }

    UserDetails.setEmail = function(email) {
        window.localStorage['email'] = email;
        UserDetails.email = window.localStorage['email'];
    }

    UserDetails.setMobileNumber = function(mobileNumber) {
        window.localStorage['mobileNumber'] = mobileNumber;
        UserDetails.mobileNumber = window.localStorage['mobileNumber'];
    }

    UserDetails.setLastVotedTime = function(lastVotedTime) {
        // must be a string
        window.localStorage['lastVotedTime'] = lastVotedTime;
        UserDetails.lastVotedTime = window.localStorage['lastVotedTime'];
    }

    UserDetails.reset = function () {
        UserDetails.set(null, null, null);
    }


    UserDetails.hasUser = function () {
        if (window.localStorage['email'] != "null" && window.localStorage['email'] != null && window.localStorage['email'] != undefined) {
            console.log("UserDetails.hasUser called: result is true");
            if (UserDetails.email == "null" || UserDetails.email == null || UserDetails.email == undefined) {
                UserDetails.setEmail(window.localStorage['email']);
                UserDetails.setMobileNumber(window.localStorage['mobileNumber']);
                UserDetails.setLastVotedTime(window.localStorage['lastVotedTime']);
            }
            return true;
        } else {
            console.log("UserDetails.hasUser called: result is false");
            return false;
        }
    }

    return UserDetails;
});
/*app.service("CurrentVideo", function CurrentVideo(){
 var CurrentVideo = this;
 CurrentVideo.id = "Default";


 var reset = function () {
 CurrentVideo.title="Default";
 CurrentVideo.id = "Default";
 }
 });*/
app.factory("CurrentVideo", function () {
    var CurrentVideo  = {
        id: 0
    }

    CurrentVideo.set = function(id) {
        console.log("CurrentVideo.set called");
        CurrentVideo.setId(id);
        console.log(id);
    }

    CurrentVideo.setId = function(id) {
        window.localStorage['id'] = id;
        CurrentVideo.id = window.localStorage['id'];
    }

    CurrentVideo.reset = function () {
        CurrentVideo.set(0);
    }
    return CurrentVideo;
});