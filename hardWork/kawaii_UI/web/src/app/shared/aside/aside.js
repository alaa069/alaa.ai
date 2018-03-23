angular
.module('app')
.controller('AsideController', AsideController)

function AsideController($scope, $rootScope, $interval, Kawaii_Parse, Kawaii_Config, Kawaii_Version, Settings, Kawaii_Status, IntentResponse) {
  $scope.test_text = 'I want italian food in new york';
  $scope.test_text_response = {};
  $rootScope.config = {}; //Initilize in case server is not online at startup
  var configcheck;

  Kawaii_Version.get().$promise.then(function(data) {
    $rootScope.kawaii_version = data.version;
  });

  Settings.query(function(data) {
      $rootScope.settings = data;

      for(var key in data) {
        $rootScope.settings[data[key]['setting_name']] = data[key]['setting_value'];
      }

      if ($rootScope.settings['refresh_time'] !== "-1" && $rootScope.settings['refresh_time'] !== undefined) {
        configcheck = $interval(getKawaiiConfig, parseInt($rootScope.settings['refresh_time']));
      }

      getKawaiiConfig();
  });

  $scope.$on('executeTestRequest', function(event, expression_text) {
    $scope.test_text = expression_text;
    $scope.executeTestRequest();
  });

  $scope.$on("$destroy", function(){
    $interval.cancel(configcheck);
  });

  function getKawaiiConfig() {
    // Add a status param to config and set to 0 if server is offline
    Kawaii_Status.get(function(statusdata) {
      Kawaii_Config.get().$promise.then(function(data) {
        $rootScope.config = data.toJSON();
        $rootScope.config.isonline = 1;
        $rootScope.config.server_model_dirs_array = getAvailableModels(statusdata.available_models);
        if ($rootScope.config.server_model_dirs_array.length > 0) {
          $rootScope.modelname = $rootScope.config.server_model_dirs_array[0].name;
        } else {
          $rootScope.modelname = "Default";
        }
      }, function(error) {
        // error handler
        $rootScope.config.isonline = 0;
      });
    });
  }

  $scope.executeTestRequest = function() {
    $scope.response_text=''
    $scope.response_text_post=''
    var options = {};
    var model = '';
    if ($scope.modelname !== 'Default') {
      model = $scope.modelname;
    }
    options = {query: $scope.test_text, model: model};
    Kawaii_Parse.get(options, function(data) {
      $scope.test_text_response = data.toJSON();
      $scope.response_text = $scope.test_text_response.response_text;
      $scope.response_text_post = $scope.test_text_response.response_text_post;
    });
  }
}
