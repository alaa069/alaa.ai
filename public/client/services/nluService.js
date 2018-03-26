
angular.module('nluService', [])

.factory('NLU', ['$http',function($http) {
    return {
        version : function() {
            return $http.get('/api/v2/nlu/version');
        },
        status : function() {
            return $http.get('/api/v2/nlu/status');
        },
        config : function() {
            return $http.get('/api/v2/nlu/config');
        },
        parse : function(q, model) {
            return $http.get('/api/v2/nlu/parse?q=' + q + '&model=' + model);
        }
    }
}]);