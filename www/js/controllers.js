var app = angular.module('TempoHub.controllers', ['ionic'])


app.controller('Controller', ['$scope', '$ionicPopup', '$state', '$http', function($scope, $location, $state, $ionicPopup, $timeout, $http){
  $scope.controller ={};
  $scope.controller.forgotPassword = function() {
    console.log("forgotPassword() Called");
    $state.go('ForgotPassword');
  };

}]);

app.controller('SignInCtrl', ['$scope', '$http','$state', 'UserDetails', function($scope, $http, $state, UserDetails) {
  console.log("Welcome to the SignIn state!");
  $scope.signInCtrl = {};

  $scope.signInCtrl.signIn = function() {

    $http.post('http://localhost/HubServices/SignIn.php', { 'email': $scope.email, 'pw': $scope.pw}).success(function(response) {
      console.log("login response: " + response);
      if (response == 1) {
        alert("logged in!");
		//UserEmail = $scope.email;
		UserDetails.email = $scope.email;
		console.log(UserDetails.email);
		//console.log($scope.UserEmail);
        $scope.email = null;
        $scope.pw = null;
        $state.go('mainMenu.mainPage');
      } else {
        alert ("email/password combination incorrect");
        $scope.pw = null;
      }
    });
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
        'device': $scope.device
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

app.controller('clipsCtrl', ['$scope', '$state', function($scope, $state){
}]);

app.controller('mainMenuCtrl', ['$scope', '$state', function($scope, $state){

  console.log("Welcome To the main menu state!");
  $scope.mainMenuCtrl ={};
  $scope.mainMenuCtrl.voting = function() {
    $state.go('votingMenu.current');
  }

  $scope.mainMenuCtrl.clips = function() {
    $state.go('clipsMenu');
  }
}]);


app.controller('currentCtrl', function($scope){
  $scope.currentVideos = [
    { title: 'name 1', id: 1 },
    { title: 'name 2', id: 2 },
    { title: 'name 3', id: 3 },
    { title: 'name 4', id: 4 },
    { title: 'name 5', id: 5 },
    { title: 'name 6', id: 6 }
  ];
});

app.controller('videoCtrl', function($scope, $stateParams) {
});


app.controller('previousCtrl', function($scope){
  console.log('previousCtrl');
});



app.controller('EditDetailsCtrl', ['$scope', 'UserDetails', '$http', function ($scope, UserDetails, $http){
  $scope.editDetailsCtrl = {};
  console.log(UserDetails.email);
    $scope.editDetailsCtrl.editDetails = function(){
	    console.log(UserDetails.email);
	    $scope.oldEmail = UserDetails.email;
        $http.post('http://localhost/HubServices/EditDetails.php', {
            'oldEmail' : $scope.oldEmail,
            'email': $scope.email,
            'mobileNumber': $scope.mobileNumber,
            'country': $scope.country.name,
            'marketingOptIn': "0"
        })
    }
  $scope.editDetailsCtrl.changePassword = function(){
      $scope.currentEmail = UserDetails.email;
      console.log($scope.currentEmail);
      console.log("changePassword Called with new password = " + $scope.newPassword);
      $http.post('http://localhost/HubServices/changePassword.php', {
          'email' : $scope.currentEmail,
          'currentPassword' : $scope.currentPassword,
          'newPassword' : $scope.newPassword
      })
          .success(function (response) {
              if (response == 1) {
                  console.log(response);
                  alert("Password Update Successful");
                  $state.go('mainMenu');
              }
              else {
                  console.log(response);
                  alert("Password Update Failed");
              }
          }
      )
  }

  $scope.countries = countries;
}]);

UserEmail = "default";

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