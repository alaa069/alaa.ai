angular.module('nluController', [])

    .controller('mainController', ['$scope', '$http', 'NLU', '$window', function ($scope, $http, NLU, $window) {
        $scope.formData = {};
        $scope.available_models = [];
        $scope.chatText = '';
        $scope.chatModel = '';
        NLU.version()
            .success(function (data) {
                console.log('version', data)
            })

        NLU.status()
            .success(function (data) {
                console.log('status', data)
                $scope.available_models = getAvailableModels(data.available_models)
                console.log('status', $scope.available_models)
            })

        NLU.config()
            .success(function (data) {
                console.log('config', data)
            })
        $scope.executeChatRequest = function(){
            if(($scope.chatText != '')&&($scope.chatModel != '')){
                NLU.parse($scope.chatText, $scope.chatModel)
                .success(function(data){
                    $scope.chatText = '';
                    console.log(typeof(data))
                    $scope.exportdata = data;
                })
            }
        }
    }]);


function parseKawaiiModelFolderDate(folder) {
    var p = folder.substring(folder.lastIndexOf("_") + 1)
    var d = p.substring(0, 4) + '-' + p.substring(4, 6) + '-' + p.substring(6, 8) + 'T' + p.substring(9, 11) + ':' + p.substring(11, 13);
    var s = p.substring(4, 6) + '-' + p.substring(6, 8) + '-' + p.substring(0, 4);
    var t = p.substring(9, 11) + ':' + p.substring(11, 13);
    return new XDate(p.substring(0, 4), p.substring(4, 6) - 1, p.substring(6, 8), p.substring(9, 11), p.substring(11, 13))
}
function getAvailableModels(models) {
    var arrModels = [];
    for (var i = 0; i <= models.length - 1; i++) {
        var name = models[i].substring(models[i].lastIndexOf("/") + 1);
        var xdate = parseKawaiiModelFolderDate(models[i]);
        arrModels.push({ name: name, folder: models[i], xdate: xdate, date: xdate.toString("MM/dd/yy h(:mm)TT") });
    }
    arrModels.sort(function (a, b) {
        return a.xdate[0] > b.xdate[0];
    });
    return arrModels;
}