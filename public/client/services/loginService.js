
angular.module('loginService', [])

// super simple service
// each function returns a promise object 
.factory('Login', ['$http',function($http) {
    return {
        signIn : function(data) {
            return $http.post('/api/signin', data);
        },
        signUp : function(data) {
            return $http.post('/api/signup', data);
        },
    }
}]);