angular
.module('app')
.controller('KawaiiConfigController', KawaiiConfigController)

function KawaiiConfigController($scope, $rootScope, Kawaii_Config) {
  loadConfig();

  function loadConfig() {
    Kawaii_Config.get().$promise.then(function(data) {
      $scope.config = data.toJSON();
    });
  }
  /* TODO: Future feature
  $scope.updateConfigParam = function(param_name) {
    var param_value = $('#' + param_name).val();
    Set_Kawaii_Config.get( {key: param_name, value: param_value} ).$promise.then(function(data) {
      loadConfig();
    });
  }
  */
}
