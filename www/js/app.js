
var app = angular.module('TempoHub', ['ionic'])//, 'TempoHub.controllers', 'TempoHub.services'])

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
                url: '/signIn.html',
                templateUrl: 'views/signIn.html'
            })
            .state('SignUp', {
                url: '/signUp.html',
                templateUrl: 'views/signUp.html'
            })
            .state('ForgotPassword', {
                url: '/forgotPassword.html',
                templateUrl: 'views/forgotPassword.html'
            })
			.state('SecurityQuestion', {
                url: '/securityQuestion.html',
                templateUrl: 'views/securityQuestion.html'
            })
            .state('EditDetails', {
                url: '/EditDetails',
                templateUrl: 'views/editDetails.html'
            })

    $urlRouterProvider.otherwise('/signIn.html');
    });

app.controller('Controller', ['$scope', '$ionicPopup', '$state', '$http', function($scope, $location, $state, $ionicPopup, $timeout, $http){
    $scope.controller ={};
    $scope.controller.forgotPassword = function() {
        console.log("forgotPassword() Called");
        $state.go('ForgotPassword');
    };
    
}]);

app.controller('SignInCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Welcome To the signin state!");
    $scope.signInCtrl = {};
    $scope.signInCtrl.signIn = function() {
        console.log("Username: " + $scope.email +  ", I should not log passwords but here it is: " + $scope.password);
        $http.post('http://localhost/dbtest.php', { email: '$scope.email', pw: '$scope.password' }).success(function(response) {
            console.log("login response: " + response);
        });

    };


}]);

app.controller('ForgotPasswordCtrl', ['$scope', '$state', function($scope, $state){
	
    console.log("Welcome To the forgot Password state!");
    $scope.forgotPasswordCtrl = {};
	$scope.forgotPasswordCtrl.resetPassword = function(){
		if($scope.email != undefined){
		    $state.go('SecurityQuestion');
		}
		else
			console.log("Enter a valid email.");
	};
    
}]);

app.controller('SecurityQuestionCtrl',['$scope', function($scope){
	$scope.securityQuestionCtrl = {};
	$scope.securityQuestionCtrl.answer = function(){
		console.log("Your answer was " + $scope.answer);
	};
	$scope.question = "What was the name of your first pet?";
}]);
app.controller('EditDetailsCtrl', ['$scope', function ($scope){
	$scope.editDetailsCtrl = {};

    //these countries should be declared somewhere and referenced both times rather than this
	$scope.countries = [ {name: "country"}, {name: "United States"}, {name: "Israel"}, {name: "Afghanistan"}, {name: "Albania"}, {name: "Algeria"},
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
}]);



app.controller('SignUpCtrl', ['$scope', function($scope) {
	
	$scope.signUpCtrl = {};
	$scope.signUpCtrl.signUp = function() {
		if($scope.password == $scope.confirmPassword && $scope.email != undefined && $scope.mobileNumber != undefined && $scope){
			console.log("hi!");
		};
	};

    $scope.countries = [ {name: "country"}, {name: "United States"}, {name: "Israel"}, {name: "Afghanistan"}, {name: "Albania"}, {name: "Algeria"},
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
        {name: "Venezuela, Bolivarian Republic of"}, {name: "Viet Nam"}, {name: "Virgin Islands, British"}, {name: "Virgin Islands, U.S."} ];
}]);
