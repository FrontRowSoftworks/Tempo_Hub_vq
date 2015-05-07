var app = angular.module('TempoHub.controllers', ['ionic'])

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};

app.directive("compareTo", compareTo);

app.controller('Controller', ['$scope', '$ionicPopup', '$state', '$http', function($scope, $location, $state, $ionicPopup, $timeout, $http){
  $scope.controller = {};
  $scope.controller.forgotPassword = function() {
    $state.go('ForgotPassword');
  };
}]);

app.controller('SignInCtrl', ['$scope', '$http','$state', 'UserDetails', function($scope, $http, $state, UserDetails) {
    if(UserDetails.hasUser()) {
        $state.go('mainMenu.mainPage');
    } else {
        console.log("UserDetails.reset called from SignInCtrl because no user was found");
    }

    $scope.signInCtrl = {};
    $scope.signInCtrl.signIn = function() {
      $scope.loading = true;
      var email = $scope.email;
      var pw = $scope.pw;

        $http.post('http://localhost/HubServices/SignIn.php', { 'email': email, 'pw': pw})
            .success(function(response) {
                $scope.loading = false;
                if (response == 1) {
                  $scope.error = false;
                    console.log(email);
                  $http.post('http://localhost/HubServices/GetUser.php', { 'email': email }).success(function(response) {
                      console.log("ts from service: " + response.vote_ts);
                      UserDetails.set(email, response.mobile, response.vote_ts);
                      console.log("UserDetails.set called from SignInCtrl");
                  });
                  $scope.email = null;
                  $scope.pw  = null;
                  $scope.signInForm.$setUntouched();
                  $state.go('mainMenu.mainPage');
                } else {
                    $scope.errorMessage = "incorrect email/password combination!";
                    $scope.error = true;
                      $scope.pw = null;
                      $scope.signInForm.$setUntouched();
                }
            })
            .error(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.errorMessage = "error contacting server, try again!";
                $scope.error = true;
        });
    };

}]);

app.controller('SignUpCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {
  $scope.success = false;
  $scope.marketingOptIn = 1;
  $scope.signUpCtrl = {};
  $scope.signUpCtrl.signUp = function() {
      $scope.loading = true;
      $scope.userDevice = ionic.Platform.platform();

      $http.post('http://localhost/HubServices/SignUp.php', {
          'email': $scope.email,
          'pw': $scope.password,
          'mobileNumber': $scope.mobileNumber,
          'question': $scope.question,
          'answer': $scope.answer,
          'country': $scope.country.name,
          'marketingOptIn': $scope.marketingOptIn,
          'device': $scope.userDevice
      })
          .success(function (response) {
              $scope.loading = false;
              if (response == 1) {
                  $scope.success = true;
                  $scope.error = false;
                  $scope.signUpForm.$setUntouched();
                  $state.go('SignIn');
              }
              else {
                  $scope.errorMessage = "email already in use!";
                  $scope.error = true;
              }
          })
          .error(function(data, status, headers, config) {
              $scope.loading = false;
              $scope.errorMessage = "error contacting server, try again!";
              $scope.error = true;
          });
  }
    $scope.countries = countries;
}]);

app.controller('ForgotPasswordCtrl', ['$scope', '$state', '$http', 'UserQuestion', function($scope, $state, $http, UserQuestion){
  $scope.forgotPasswordCtrl = {};
  $scope.forgotPasswordCtrl.getQuestion = function() {
      $scope.loading = true;
      $http.post('http://localhost/HubServices/GetSecurityQuestion.php', { 'email': $scope.email })
          .success(function(response) {
              $scope.loading = false;
              if (response.trim().length > 0) {
                  $scope.error = false;
                  UserQuestion.question = response;
                  UserQuestion.email = $scope.email;
                  $state.go('SecurityQuestion');
                  $scope.email = null;
                  $scope.forgotPasswordForm.$setUntouched();
              }
              else {
                  $scope.error = true;
                  $scope.errorMessage = "no account found!";
              }
        })
      .error(function(data, status, headers, config) {
          $scope.loading = false;
          $scope.errorMessage = "error contacting server, try again!";
          $scope.error = true;
      });
  }
}]);

app.controller('SecurityQuestionCtrl',['$state', '$scope', 'UserQuestion', '$http', function($state,$scope, UserQuestion, $http){
  $scope.securityQuestionCtrl = {};
  $scope.question = UserQuestion.question;
  $scope.securityQuestionCtrl.answerQuestion = function(){
      $scope.loading = true;
      $http.post('http://localhost/HubServices/AnswerSecurityQuestion.php', { 'email': UserQuestion.email, 'answer': $scope.answer})
          .success(function(response) {
              $scope.loading = false;
                if (response == 1) {
                    $scope.error = false;
                    $state.go('ResetPassword');
                }
                else {
                    $scope.error = true;
                    $scope.errorMessage = "answer is incorrect!";
                }
          })
      .error(function(data, status, headers, config) {
          $scope.loading = false;
          $scope.errorMessage = "error contacting server, try again!";
          $scope.error = true;
      });
      $scope.answer = null;
      $scope.securityForm.$setUntouched();
  }
}]);

app.controller('ResetPasswordCtrl',['$state', '$scope', 'UserQuestion', '$http', function($state,$scope, UserQuestion, $http){
  $scope.success = false;
  $scope.resetPasswordCtrl = {};
  $scope.resetPasswordCtrl.resetPassword = function() {
    $scope.loading = true;
    $http.post('http://localhost/HubServices/ResetPassword.php', { 'email': UserQuestion.email, 'pw': $scope.newPassword}).success(function(response) {
        if (response == 1) {
            $scope.loading = false;
            $scope.success = true;
            $scope.error = false;
            $state.go('SignIn');
        }
        else {
            $scope.error = true;
            $scope.errorMessage = "error resetting password!";
        }
      })
    .error(function(data, status, headers, config) {
        $scope.loading = false;
        $scope.errorMessage = "error contacting server, try again!";
        $scope.error = true;
    });
    $scope.newPassword = null;
    $scope.confirmPassword = null;
    $scope.resetPasswordForm.$setUntouched();
  }
}]);

app.controller('settingsMenuCtrl', ['$scope', '$state', function($scope, $state) {
    $scope.settingsMenuCtrl = {};
    $scope.settingsMenuCtrl.goToEditDetails = function () {
        $state.go('mainMenu.editDetails');
    }
}]);

app.controller('mainMenuCtrl', ['$scope', '$state', 'UserDetails', function($scope, $state, UserDetails){
  /*
  check for user details has been omitted here because it creates an infinite loop :)
  if the user tries to navigate anywhere past this screen without actually being logged in,
  they'll be redirected to the sign in page anyway.

  if (!UserDetails.hasUser()) {
      $state.go('SignIn');
      console.log("no user");
  }*/

  console.log("Welcome To the main menu state!");

  $scope.mainMenuCtrl = {};

  $scope.mainMenuCtrl.voting = function() {
    $state.go('votingMenu.current');
  }

  $scope.mainMenuCtrl.clips = function() {
    $state.go('clipsMenu.clips');
  }
}]);

app.controller('EditDetailsCtrl', ['$scope', 'UserDetails', '$state', '$http', function ($scope, UserDetails, $state, $http){
    if (!UserDetails.hasUser()) {
        $state.go('SignIn');
        console.log("no user");
    }

    $scope.detailsError = false;
    $scope.passwordError = false;
    $scope.detailsSuccess = false;
    $scope.passwordSuccess = false;
    $scope.editDetailsCtrl = {};
    $scope.user = {
        email: UserDetails.email,
        mobileNumber: UserDetails.mobileNumber
    }

    $scope.editDetailsCtrl.editDetails = function(){
        $scope.detailsLoading = true;
        console.log("email in input: " + $scope.user.email);
        $scope.oldEmail = UserDetails.email;

       $http.post('http://localhost/HubServices/EditDetails.php', {
                'oldEmail': $scope.oldEmail,
                'email': $scope.user.email,
                'mobileNumber': $scope.user.mobileNumber,
                'country': $scope.country.name
            }).success(function (response) {
                $scope.detailsLoading = false;
                $scope.passwordError = false;
                $scope.passwordSuccess = false;
                if (response > 0) {
                    UserDetails.setMobileNumber($scope.user.mobileNumber);
                }
                if (response == 1) {
                    $scope.detailsSuccessMessage = "details changed!";
                    $scope.detailsSuccess = true;
                    $scope.detailsError = false;
                    if (UserDetails.email != $scope.user.email) {
                        UserDetails.setEmail($scope.user.email);
                    }
                } else if (response == 2) {
                    $scope.user.email = UserDetails.email;
                    $scope.detailsErrorMessage = "email not changed, already in use!";
                    $scope.detailsError = true;
                    $scope.detailsSuccessMessage = "details (except email) changed!";
                    $scope.detailsSuccess = true;
                } else {
                    $scope.detailsErrorMessage = "error changing details!";
                    $scope.detailsError = true;
                }
            })
           .error(function(data, status, headers, config) {
               $scope.detailsLoading = false;
               $scope.detailsSuccess = false;
               $scope.detailsErrorMessage = "error contacting server, try again!";
               $scope.detailsError = true;
           });
    }

    $scope.editDetailsCtrl.changePassword = function(){
        $scope.passwordLoading = true;
        $scope.currentEmail = UserDetails.email;
        console.log($scope.currentEmail);
        $http.post('http://localhost/HubServices/ChangePassword.php', {
            'email': $scope.currentEmail,
            'currentPassword': $scope.currentPassword,
            'newPassword': $scope.newPassword
        }).success(function (response) {
            $scope.passwordLoading = false;
            $scope.detailsError = false;
            $scope.detailsSuccess = false;
            if (response == 1) {
                $scope.passwordSuccess = true;
                $scope.passwordError = false;
            }
            else {
                $scope.passwordErrorMessage = "current password is incorrect!";
                $scope.passwordError = true;
                $scope.passwordSuccess = false;
            }
        })
        .error(function(data, status, headers, config) {
            $scope.passwordLoading = false;
            $scope.passwordSuccess = false;
            $scope.passwordErrorMessage = "error contacting server, try again!";
            $scope.passwordError = true;
        });
        $scope.currentPassword = null;
        $scope.newPassword = null;
        $scope.confirmPassword = null;
        $scope.editPasswordForm.$setUntouched();
    }

    $scope.$on('$locationChangeStart', function( event ) {
        $scope.detailsError = false;
        $scope.passwordError = false;
        $scope.detailsSuccess = false;
        $scope.passwordSuccess = false;
        $scope.user = {
            email: UserDetails.email,
            mobileNumber: UserDetails.mobileNumber
        }
    });


    $scope.countries = countries;
}]);

app.controller('ContactCtrl', ['$scope', '$http', 'UserDetails', '$state', function ($scope, $http, UserDetails, $state) {
    if (!UserDetails.hasUser()) {
        $state.go('SignIn');
        console.log("no user");
    }

    $scope.success = false;
    $scope.error = false;
    $scope.contactCtrl = {};
    $scope.contactCtrl.contact = function () {
        $scope.loading = true;
        $http.post('http://localhost/HubServices/Contact.php', {
                'email': UserDetails.email,
                'subject': $scope.subject.name,
                'content': $scope.content
            }).success(function (response) {
                 $scope.loading = false;
                if (response == 1) {
                    $scope.success = true;
                    $scope.error = false;
                } else {
                    $scope.errorMessage = "error contacting TEMPO!";
                    $scope.error = true;
                    $scope.success = false;
                }
            })
            .error(function(data, status, headers, config) {
                $scope.loading = false;
                $scope.errorMessage = "error contacting server, try again!";
                $scope.error = true;
                $scope.success = false;
            });
        $scope.content = null;
        $scope.contactForm.$setUntouched();
    }

    $scope.$on('$locationChangeStart', function( event ) {
        $scope.success = false;
        $scope.error = false;
        $scope.content = null;
        $scope.contactForm.$setUntouched();
    });


    $scope.subjects = subjects;
}]);

app.controller('SignOutCtrl', ['$scope', 'UserDetails', function ($scope, UserDetails) {
    $scope.signOutCtrl = {};
    $scope.signOutCtrl.signOut = function () {
        UserDetails.reset();
    }
}]);

app.controller('votingMenuCtrl', ['$scope', '$state', 'UserDetails', function($scope, $state, UserDetails){
    if (!UserDetails.hasUser()) {
        $state.go('SignIn');
        console.log("no user");
    }

    $scope.votingMenuCtrl = {};

    $scope.votingMenuCtrl.goToHome = function () {
        $state.go('mainMenu.mainPage');
    }

    $scope.votingMenuCtrl.goToCurrent = function () {
        $state.go('votingMenu.current');
    }
}]);

app.controller('CurrentCtrl', [ '$scope', '$http', 'UserDetails', '$state', 'CurrentVideo', function($scope, $http, UserDetails, $state, CurrentVideo){
    if (!UserDetails.hasUser()) {
        $state.go('SignIn');
        console.log("no user");
    }

    $scope.loading = true;
    $scope.videosAvailable = true;
    $scope.votingLoading = false;
    $scope.success = false;
    $scope.error = false;

    $scope.currentCtrl = {};
    $scope.currentVideos = [];

    $scope.currentCtrl.hasVoted = function() {
        var midnight = new Date();
        midnight.setHours(0,0,0,0);
        var lastVoted;
        if (UserDetails.lastVotedTime != null) {
            lastVoted = new Date(Date.parse(UserDetails.lastVotedTime));
        } else {
            lastVoted = 0;
        }
        return lastVoted != 0 ? lastVoted > midnight : false;
    }

    $scope.currentCtrl.vote = function() {
        $scope.votingLoading = true;
        console.log("voted for: " + $scope.currentCtrl.votedVideo.sorting);
        var timestamp = new Date().toString();
        UserDetails.setLastVotedTime(timestamp);
        console.log("vote timestamp: " + UserDetails.lastVotedTime);
        $http.post('http://localhost/HubServices/CastCCCVote.php', {
            'email': UserDetails.email,
            'timestamp': timestamp,
            'sort': $scope.currentCtrl.votedVideo.sorting
        }).success(function (response) {
            $scope.votingLoading = false;
                console.log("CastCCCVote response: " + response);
                if (response > 0) {
                    $scope.success = true;
                    $scope.error = false;
                    $scope.voted = $scope.currentCtrl.hasVoted();
                } else {
                    $scope.errorMessage = "error contacting server, try again!"
                    $scope.error = true;
                    $scope.success = false;
                }
            })
            .error(function(data, status, headers, config) {
                $scope.votingLoading = false;
                $scope.errorMessage = "error contacting server, try again!"
                $scope.error = true;
            });
    }

    $scope.totalVotes;
    $scope.currentCtrl.getTotalVotes = function () {
        $http.post('http://localhost/HubServices/GetCCCVotesCurrent.php')
            .success(function (response) {
                console.log("total votes: " + response);
                if (!isNaN(response) && response > 0) {
                    $scope.totalVotes = response;
                } else $scope.videosAvailable = false;
            })
            .error(function(data, status, headers, config) {
                $scope.videosAvailable = false;
                $scope.loading = false;
            });
    }

    $scope.currentCtrl.getVideos = function (refresh) {
        $scope.currentCtrl.getTotalVotes();
        console.log("getting current videos");
        $scope.voted = $scope.currentCtrl.hasVoted();
        console.log("voted? " + $scope.voted);

        if ($scope.videosAvailable) {
            $http.post('http://localhost/HubServices/GetCCCVotingCurrent.php')
                .success(function (response) {
                    $scope.loading = false;
                    for (var i = 0; i < response.length; i++) {
                        $scope.currentVideos[i] = {
                            sorting: response[i]['sorting'],
                            title: response[i]['title'],
                            artist: response[i]['artist'],
                            country: response[i]['country'],
                            id: response[i]['brightcove_id'],
                            video_still: response[i]['video_still_url'],
                            thumbnail: (response[i]['thumbnail_url'] != null) ?
                                response[i]['thumbnail_url'] :
                                "img/default-thumbnail.png",
                            votes: response[i]['votes'],
                            votePercentage: ((response[i]['votes'] / $scope.totalVotes) * 100).toFixed(1)
                        }
                    }
                })
                .error(function (data, status, headers, config) {
                    $scope.loading = false;
                    $scope.videosAvailable = false;
                })
                .finally(function () {
                    if (refresh) {
                        // Stop the ion-refresher from spinning
                        $scope.$broadcast('scroll.refreshComplete');
                    }
                });
        }

    }

    $scope.currentCtrl.getVideos(false);
    //$filter('orderBy')($scope.currentVideos, -votes);

    $scope.currentCtrl.goToVideo = function(video) {
        CurrentVideo.set(video.id);
        console.log(CurrentVideo.id);
        $state.go('votingMenu.single', {videoId: video.id});

    }

    $scope.doRefresh = function() {
            $scope.currentCtrl.getVideos(true);
            $scope.videosAvailable = true;
            $scope.votingLoading = false;
            $scope.success = false;
            $scope.error = false;
    };

    $scope.$on('$locationChangeStart', function( event ) {
        $scope.success = false;
        $scope.error = false;

    });
}]);

app.controller('viewVideoCtrl', ['$scope', 'CurrentVideo', function($scope, CurrentVideo){
    console.log(CurrentVideo.id);
    $scope.videoId = CurrentVideo.id;
}]);
app.controller('PreviousCtrl', ['$scope', 'UserDetails', '$state', '$http', function($scope, UserDetails, $state, $http){
    if (!UserDetails.hasUser()) {
        $state.go('SignIn');
        console.log("no user");
    }

    $scope.loading = true;
    $scope.videosAvailable = true;

    $scope.previousCtrl = {};
    $scope.previousVideos = [];

    $scope.winningVideoSort;
    $scope.spotlight = true;
    $scope.pollName;
    $scope.previousVotes;
    $scope.previousCtrl.getDetails = function () {
        $http.post('http://localhost/HubServices/GetCCCWinnerPrevious.php')
            .success(function (response) {
                console.log("previous details response: " + response);
                var details = response.split(",");
                $scope.winningVideoSort = details[0];
                if ($scope.winningVideoSort < 1) {
                    $scope.spotlight = false;
                }
                console.log("winning vid sort: " + $scope.winningVideoSort);
                $scope.pollName = details[1] + details[2];
                console.log("poll name: " + $scope.pollName);
                if (!isNaN(details[3]) && details[3] > 0) {
                    $scope.previousVotes = details[3];
                    console.log("previous total votes: " + $scope.previousVotes);
                } else $scope.videosAvailable = false;
            })
            .error(function(data, status, headers, config) {
                $scope.videosAvailable = false;
                $scope.loading = false;
            });
    }

    $scope.previousCtrl.getVideos = function () {
        if ($scope.videosAvailable) {
            $http.post('http://localhost/HubServices/GetCCCVotingPrevious.php')
                .success(function (response) {
                    $scope.loading = false;

                    for (var i = 0; i < response.length; i++) {
                        $scope.previousVideos[i] = {
                            sorting: response[i]['sorting'],
                            title: response[i]['title'],
                            artist: response[i]['artist'],
                            country: response[i]['country'],
                            id: response[i]['brightcove_id'],
                            video_still: response[i]['video_still_url'],
                            thumbnail: (response[i]['thumbnail_url'] != null) ?
                                response[i]['thumbnail_url'] :
                                "img/default-thumbnail.png",
                            votes: response[i]['votes'],
                            votePercentage: ((response[i]['votes'] / $scope.previousVotes) * 100).toFixed(1)
                        }
                        if (($scope.previousVideos[i].sorting == $scope.winningVideoSort)
                            && ($scope.previousVideos[i].video_still == null)) {
                            $scope.spotlight = false;
                        }

                    }
                })
                .error(function (data, status, headers, config) {
                    $scope.loading = false;
                    $scope.videosAvailable = false;
                });
        }

    }
    $scope.previousCtrl.getDetails();
    setTimeout($scope.previousCtrl.getVideos, 100);
}]);

app.controller('clipsCtrl', ['$scope', 'UserDetails', '$state', function($scope, UserDetails, $state){
    if (!UserDetails.hasUser()) {
        $state.go('SignIn');
        console.log("no user");
    }
}]);

var subjects = [ {name: "CCC Write-In Vote"}, {name: "Question"}, {name: "Comment"}];

var countries = [ {name: "United States"}, {name: "Israel"}, {name: "Afghanistan"}, {name: "Albania"}, {name: "Algeria"},
  { name: "AmericanSamoa"}, {name: "Andorra"}, {name: "Angola"}, {name: "Anguilla"}, {name: "Antigua and Barbuda"}, {name: "Argentina"},
  {name: "Armenia"}, {name: "Aruba"}, {name: "Australia"}, {name: "Austria"}, {name: "Azerbaijan"}, {name: "Bahamas"}, {name: "Bahrain"},
  {name: "Bangladesh"}, {name: "Barbados"}, {name: "Belarus"}, {name: "Belgium"}, {name: "Belize"}, {name: "Benin"}, {name: "Bermuda"},
  {name: "Bhutan"}, {name: "Bosnia and Herzegovina"}, {name: "Botswana"}, {name: "Brazil"}, {name: "British Indian Ocean Territory"},
  {name: "Bulgaria"}, {name: "Burkina Faso"}, {name: "Burundi"}, {name: "Cambodia"}, {name: "Cameroon"}, {name: "Canada"}, {name: "Cape Verde"},
  {name: "Cayman Islands"}, {name: "Central African Republic"}, {name: "Chad"}, {name: "Chile"}, {name: "China"}, {name: "Christmas Island"},
  {name: "Colombia"}, {name: "Comoros"}, {name: "Congo"}, {name: "Cook Islands"}, {name: "Costa Rica"}, {name: "Croatia"}, {name: "Cuba"},
  {name: "Cyprus"}, {name: "Czech Republic"}, {name: "Denmark"}, {name: "Djibouti"}, {name: "Dominica"}, {name: "Dominican Republic"},
  {name: "Ecuador"}, {name: "Egypt"}, {name: "El Salvador"}, {name: "Equatorial Guinea"}, {name: "Eritrea"}, {name: "Estonia"},
  {name: "Ethiopia"}, {name: "Faroe Islands"}, {name: "Fiji"}, {name: "Finland"}, {name: "France"}, {name: "French Guiana"},
  {name: "French Polynesia"}, {name: "Gabon"}, {name: "Gambia"}, {name: "Georgia"}, {name: "Germany"}, {name: "Ghana"}, {name: "Gibraltar"},
  {name: "Greece"}, {name: "Greenland"}, {name: "Grenada"}, {name: "Guadeloupe"}, {name: "Guam"}, {name: "Guatemala"}, {name: "Guinea"},
  {name: "Guinea-Bissau"}, {name: "Guyana"}, {name: "Haiti"}, {name: "Honduras"}, {name: "Hungary"}, {name: "Iceland"}, {name: "India"},
  {name: "Indonesia"}, {name: "Iraq"}, {name: "Ireland"}, {name: "Israel"}, {name: "Italy"}, {name: "Jamaica"}, {name: "Japan"}, {name: "Jordan"},
  {name: "Kazakhstan"}, {name: "Kenya"}, {name: "Kiribati"}, {name: "Kuwait"}, {name: "Kyrgyzstan"}, {name: "Latvia"}, {name: "Lebanon"},
  {name: "Lesotho"}, {name: "Liberia"}, {name: "Liechtenstein"}, {name: "Lithuania"}, {name: "Luxembourg"}, {name: "Madagascar"},
  {name: "Malawi"}, {name: "Malaysia"}, {name: "Maldives"}, {name: "Mali"}, {name: "Malta"}, {name: "Marshall Islands"}, {name: "Martinique"},
  {name: "Mauritania"}, {name: "Mauritius"}, {name: "Mayotte"}, {name: "Mexico"}, {name: "Monaco"}, {name: "Mongolia"}, {name: "Montenegro"},
  {name: "Montserrat"}, {name: "Morocco"}, {name: "Myanmar"}, {name: "Namibia"}, {name: "Nauru"}, {name: "Nepal"}, {name: "Netherlands"},
  {name: "Netherlands Antilles"}, {name: "New Caledonia"}, {name: "New Zealand"}, {name: "Nicaragua"}, {name: "Niger"}, {name: "Nigeria"},
  {name: "Niue"}, {name: "Norfolk Island"}, {name: "Northern Mariana Islands"}, {name: "Norway"}, {name: "Oman"}, {name: "Pakistan"},
  {name: "Palau"}, {name: "Panama"}, {name: "Papua New Guinea"}, {name: "Paraguay"}, {name: "Peru"}, {name: "Philippines"}, {name: "Poland"},
  {name: "Portugal"}, {name: "Puerto Rico"}, {name: "Qatar"}, {name: "Romania"}, {name: "Rwanda"}, {name: "Samoa"}, {name: "San Marino"},
  {name: "Saudi Arabia"}, {name: "Senegal"}, {name: "Serbia"}, {name: "Seychelles"}, {name: "Sierra Leone"}, {name: "Singapore"},
  {name: "Slovakia"}, {name: "Slovenia"}, {name: "Solomon Islands"}, {name: "South Africa"}, {name: "South Georgia and the South Sandwich Islands"},
  {name: "Spain"}, {name: "Sri Lanka"}, {name: "Sudan"}, {name: "Suriname"}, {name: "Swaziland"}, {name: "Sweden"}, {name: "Switzerland"},
  {name: "Tajikistan"}, {name: "Thailand"}, {name: "Togo"}, {name: "Tokelau"}, {name: "Tonga"}, {name: "Trinidad and Tobago"}, {name: "Tunisia"},
  {name: "Turkey"}, {name: "Turkmenistan"}, {name: "Turks and Caicos Islands"}, {name: "Tuvalu"}, {name: "Uganda"}, {name: "Ukraine"},
  {name: "United Arab Emirates"}, {name: "United Kingdom"}, {name: "Uruguay"}, {name: "Uzbekistan"}, {name: "Vanuatu"}, {name: "Wallis and Futuna"},
  {name: "Yemen"}, {name: "Zambia"}, {name: "Zimbabwe"}, {name: "land Islands"}, {name: "Antarctica"}, {name: "Bolivia, Plurinational State of"},
  {name: "Brunei Darussalam"}, {name: "Cocos (Keeling) Islands"}, {name: "Congo, The Democratic Republic of the"}, {name: "Cote d'Ivoire"}, {name: "Falkland Islands (Malvinas)"},
  {name: "Guernsey"}, {name: "Holy See (Vatican City State)"}, {name: "Hong Kong"}, {name: "Iran, Islamic Republic of"}, {name: "Isle of Man"},
  {name: "Jersey"}, {name: "Korea, Democratic People's Republic of"}, {name: "Korea, Republic of"}, {name: "Lao People's Democratic Republic"},
  {name: "Libyan Arab Jamahiriya"}, {name: "Macao"}, {name: "Macedonia, The Former Yugoslav Republic of"}, {name: "Micronesia, Federated States of"},
  {name: "Moldova, Republic of"}, {name: "Mozambique"}, {name: "Palestinian Territory, Occupied"}, {name: "Pitcairn"}, {name: "Réunion"},
  {name: "Russia"}, {name: "Saint Barthélemy"}, {name: "Saint Helena, Ascension and Tristan Da Cunha"}, {name: "Saint Kitts and Nevis"}, {name: "Saint Lucia"},
  {name: "Saint Martin"}, {name: "Saint Pierre and Miquelon"}, {name: "Saint Vincent and the Grenadines"}, {name: "Sao Tome and Principe"},
  {name: "Somalia"}, {name: "Svalbard and Jan Mayen"}, {name: "Syrian Arab Republic"}, {name: "Taiwan, Province of China"}, {name: "Tanzania, United Republic of"}, {name: "Timor-Leste"},
  {name: "Venezuela, Bolivarian Republic of"}, {name: "Viet Nam"}, {name: "Virgin Islands, British"}, {name: "Virgin Islands, U.S."}];