var app = angular.module('TempoHub.controllers', ['ionic'])


app.controller('Controller', ['$scope', '$ionicPopup', '$state', '$http', function($scope, $location, $state, $ionicPopup, $timeout, $http){
  $scope.controller ={};
  $scope.controller.forgotPassword = function() {
    $state.go('ForgotPassword');
  };

}]);

app.controller('SignInCtrl', ['$scope', '$http','$state', 'UserDetails', function($scope, $http, $state, UserDetails) {
    if(UserDetails.hasUser()) {
        $state.go('mainMenu.mainPage');
    }

    $scope.signInCtrl = {};

  $scope.signInCtrl.signIn = function() {
      var email = $scope.email;
      var pw = $scope.pw;

    $http.post('http://localhost/HubServices/SignIn.php', { 'email': email, 'pw': pw}).success(function(response) {
      if (response == 1) {
          $http.post('http://localhost/HubServices/GetUser.php', { 'email': email}).success(function(response) {
              UserDetails.set(email, response.mobile, response.vote_ts);
          });
          $scope.email = null;
          $state.go('mainMenu.mainPage');
      } else {
        alert ("email/password combination incorrect");
      }
    });
      $scope.pw = null;
  };

}]);

app.controller('SignUpCtrl', ['$scope', '$http', '$state', function($scope, $http, $state) {

  $scope.signUpCtrl = {};
  $scope.signUpCtrl.signUp = function() {

    if (true) {//$scope.password == $scope.confirmPassword && $scope.email != undefined && $scope.mobileNumber != undefined){
      console.log("Trying to log in now!" + " You have chosen " + $scope.marketingOptIn);
      $scope.marketingOptIn = $scope.marketingOptIn ==  undefined || $scope.marketingOptIn == 0 ? 0 : 1;

      var userDevice = ionic.Platform.platform();
      $scope.userDevice = userDevice;

      console.log($scope.email + ' ' + $scope.password + ' ' + $scope.mobileNumber + ' ' + $scope.mobileNumber + ' ' +
      $scope.question + ' ' + $scope.answer + ' ' + $scope.country.name + ' ' + $scope.marketingOptIn + ' ' + $scope.userDevice)

      console.log($scope.marketingOptIn);
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
            if (response == 1) {
              console.log(response);
              alert("Account Creation Successful");
              $state.go('SignIn');
            }
            else {
              console.log(response);
              alert("Account Creation Failed");
            }
          }
      )
    }
    ;
  };
  $scope.countries = countries;
}]);

app.controller('ForgotPasswordCtrl', ['$scope', '$state', '$http', 'UserQuestion', function($scope, $state, $http, UserQuestion){
  console.log(UserQuestion.question);
  console.log("Welcome to the forgot Password state!");
  $scope.forgotPasswordCtrl = {};
  $scope.forgotPasswordCtrl.getQuestion = function() {
    if ($scope.email != undefined) {
      $http.post('http://localhost/HubServices/GetSecurityQuestion.php', { 'email': $scope.email}).success(function(response) {
        if(response.length > 0){
          console.log('service response: ' + response);
          UserQuestion.question = response;
          UserQuestion.email = $scope.email;
          console.log('question is: ' + UserQuestion.question);
          $state.go('SecurityQuestion');
          $scope.email = null;
        }
        else
          alert("No account found for that email!");
      });
    } else {
      alert("Enter a valid email!")
    }

  };
}]);

app.controller('SecurityQuestionCtrl',['$state', '$scope', 'UserQuestion', '$http', function($state,$scope, UserQuestion, $http){
  $scope.securityQuestionCtrl = {};
  $scope.question = UserQuestion.question;
  $scope.securityQuestionCtrl.answerQuestion = function(){
    if ($scope.answer != undefined) {
      console.log("Your answer was " + $scope.answer);
      console.log("stored email is: " + UserQuestion.email);

      $http.post('http://localhost/HubServices/AnswerSecurityQuestion.php', { 'email': UserQuestion.email, 'answer': $scope.answer}).success(function(response) {
        console.log("reset service response: " + response);
        if (response == 1) $state.go('ResetPassword');
        else alert ("answer is incorrect");
        $scope.answer = null;
      });
    } else {
      console.log("no answer entered");
    }
  };
}]);

app.controller('ResetPasswordCtrl',['$state', '$scope', 'UserQuestion', '$http', function($state,$scope, UserQuestion, $http){
  $scope.resetPasswordCtrl = {};

  $scope.resetPasswordCtrl.resetPassword = function() {
    console.log("new password entered: " + $scope.newPassword);
    if ($scope.newPassword != undefined) { // better validation to go here
      console.log("new password: " + $scope.newPassword);

      $http.post('http://localhost/HubServices/ResetPassword.php', { 'email': UserQuestion.email, 'pw': $scope.newPassword}).success(function(response) {
        console.log("reset password service response: " + response);

        if (response == 1) {
          alert("password reset");
          $state.go('SignIn');

        }
        else alert ("error when resetting password");
        $scope.newPassword = null;
      });
    } else {
      console.log("enter a valid password"); //this actually needs to be part of the post method otherwise it doesn't run!
    }
  }
}]);



app.controller('mainMenuCtrl', ['$scope', '$state', function($scope, $state){

  console.log("Welcome To the main menu state!");
  $scope.mainMenuCtrl ={};
  $scope.mainMenuCtrl.voting = function() {
    $state.go('votingMenu.current');
  }

  $scope.mainMenuCtrl.clips = function() {
    $state.go('clipsMenu.clips');
  }
}]);

app.controller('EditDetailsCtrl', ['$scope', 'UserDetails', '$http', function ($scope, UserDetails, $http){
    $scope.editDetailsCtrl = {};
    $scope.user = {
        email: UserDetails.email,
        mobileNumber: UserDetails.mobileNumber
    }

    $scope.editDetailsCtrl.editDetails = function(){
        console.log("email in input: " + $scope.user.email);
        $scope.oldEmail = UserDetails.email;

        if ($scope.user.email != undefined && $scope.user.email != null &&  $scope.user.mobileNumber != undefined && $scope.user.mobileNumber != null && $scope.country.name != undefined && $scope.country.name != "country") {
            $http.post('http://localhost/HubServices/EditDetails.php', {
                'oldEmail': $scope.oldEmail,
                'email': $scope.user.email,
                'mobileNumber': $scope.user.mobileNumber,
                'country': $scope.country.name
            }).success(function (response) {
                console.log("reset service response: " + response);
                if (response > 0) {
                    alert("details changed!");
                    if (UserDetails.email != $scope.user.email) {
                        if (response != 2) UserDetails.setEmail($scope.user.email);
                    }
                    UserDetails.setMobileNumber($scope.user.mobileNumber);
                    if (response > 1) alert("email not changed, already exists");
                } else alert("not changed");
            });
        } else alert ("fill in all the fields!");
    }

    $scope.editDetailsCtrl.changePassword = function(){
        $scope.currentEmail = UserDetails.email;
        console.log($scope.currentEmail);
        if (($scope.newPassword == $scope.confirmPassword) && $scope.currentPassword != null && $scope.currentPassword != undefined && $scope.newPassword != null && $scope.newPassword != undefined && $scope.confirmPassword != null && $scope.confirmPassword != undefined) {
            console.log("changePassword Called with new password = " + $scope.newPassword);
            $http.post('http://localhost/HubServices/ChangePassword.php', {
                'email': $scope.currentEmail,
                'currentPassword': $scope.currentPassword,
                'newPassword': $scope.newPassword
            }).success(function (response) {
                if (response == 1) {
                    console.log(response);
                    alert("Password Update Successful");
                    //$state.go('mainMenu');
                }
                else {
                    console.log(response);
                    alert("Password Update Failed");
                }
            });
            $scope.currentPassword = null;
            $scope.newPassword = null;
            $scope.confirmPassword = null;
        } else alert ("fill in all the fields");
    }

    $scope.countries = countries;
}]);

app.controller('ContactCtrl', ['$scope', '$http', 'UserDetails', function ($scope, $http, UserDetails) {
    $scope.contactCtrl = {};
    $scope.contactCtrl.contact = function () {
        if ($scope.subject != "subject" && $scope.content != null && $scope.content!= undefined) {
            console.log("contacting tempo...");
            $http.post('http://localhost/HubServices/Contact.php', {
                'email': UserDetails.email,
                'subject': $scope.subject.name,
                'content': $scope.content
            }).success(function (response) {
                console.log(response);
                if (response == 1) {
                    alert ("contacted!");
                } else alert ("error contacting tempo");
            });
        } else alert ("fill in all the fields!")
    }
    $scope.subjects = subjects;
}]);

app.controller('SignOutCtrl', ['$scope', 'UserDetails', function ($scope, UserDetails) {
    $scope.signOutCtrl = {};
    $scope.signOutCtrl.signOut = function () {
        UserDetails.reset();
    }

}]);

app.controller('currentCtrl', [ '$scope', '$http', function($scope,$http){
    $scope.currentCtrl = {};
    $scope.currentVideos = [];
        $http.post('http://localhost/HubServices/GetCCCDetails.php')
       .success(function (response) {
         console.log("GetCCCDetails service response: " + response[0]['title']);
         for(i = 0; i < response.length; i++)
         $scope.currentVideos[i]={title: response[i]['title'], artist:response[i]['artist'], id: response[i]['brightcove_id']}; //

       });



}]);

app.controller('videoCtrl', function($scope, $stateParams) {
});

app.controller('previousCtrl', function($scope){
  console.log('previousCtrl');
});

app.controller('clipsCtrl', ['$scope', '$state', function($scope, $state){
}]);

var subjects = [ {name: "subject"}, {name: "CCC Write-In Vote"}, {name: "Question"}, {name: "Comment"}];

var countries = [ {name: "country"}, {name: "United States"}, {name: "Israel"}, {name: "Afghanistan"}, {name: "Albania"}, {name: "Algeria"},
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