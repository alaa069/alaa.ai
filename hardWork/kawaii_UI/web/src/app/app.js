var api_endpoint_v2 = '/api/v2'; //kawaii UI API = location of Nodejs server.js script running, edit this if the nodejs web front end is not running on the server instance

var api_train_v2 = '/train'

var api_webhook = '/webhooks'

var app = angular.module('app', ['ngRoute', 'chart.js', 'ngResource', 'ngTagsInput', 'jsonFormatter'])

.controller('app', function($scope, $route, $routeParams, $location) {
     $scope.$route = $route;
     $scope.$location = $location;
     $scope.$routeParams = $routeParams;

     $scope.go = function ( path ) {
       $location.path( path );
     };

     $scope.formData = {};
})
