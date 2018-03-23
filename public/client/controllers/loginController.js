
angular.module('loginController', [])

// inject the Login service factory into our controller
.controller('mainController', ['$scope','$http','Login', '$window', function($scope, $http, Login, $window) {
    $scope.formData = {};

    // when submitting the getpi form, send the pi to the node API
    $scope.signIn = function() {
        if($scope.formData !== undefined){
            Login.signIn($scope.formData)
            .success(function(data){
                $scope.formData = {};
                if(data.error){
                    console.log('error')
                } else {
                    console.log('success')
                    $window.location.href = '/dashboard';
                }
            })
        }
    };

    $scope.signUp = function() {
        if($scope.formData !== undefined){
            Login.signUp($scope.formData)
            .success(function(data){
                $scope.formData = {};
                if(data.error){
                    console.log('error', data)
                } else {
                    console.log('success', data)
                    $window.location.href = '/dashboard';
                }
            })
        }
    };
    
}]);