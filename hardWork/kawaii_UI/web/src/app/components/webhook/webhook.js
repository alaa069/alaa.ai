angular
    .module('app')
    .controller('WebHookController', WebHookController)

function WebHookController($scope, $rootScope, $interval, $http, Agent, Intents, Expressions, ExpressionParameters, WebHook, WebHookRM) {
    
    loadWebHook()

    $scope.inte = function (params) {
    }

    $scope.choiceSet = {
        choices: []
    };
    $scope.quest = {};
    $scope.choiceSet.choices = [];
    $scope.addNewChoice = function() {
        $scope.choiceSet.choices.push('');
    };
    $scope.removeChoice = function(z) {
        $scope.choiceSet.choices.splice(z, 1);
    };

    Agent.query(function (data) {
        $scope.agentList = data;
    });

    $scope.update = function(agent_id) {
        Intents.query({agent_id: agent_id}, function(data) {
            $scope.intentList = data;
        });
    }

    function loadWebHook() {
        WebHook.query(function(data) {
            $scope.webhookList = data;
        });
    }
    $scope.addwebhook = function (params) {
        this.formData.response_type = 1;//DEFAULT type
        this.formData.response_text = 'yes';//DEFAULT response
        if(this.formData.username == undefined) this.formData.username = ''
        if(this.formData.password == undefined) this.formData.password = ''
        if(this.formData.key0 == undefined) this.formData.key0 = ''
        if(this.formData.value0 == undefined) this.formData.value0 = ''
        if(this.formData.key1 == undefined) this.formData.key1 = ''
        if(this.formData.value1 == undefined) this.formData.value1 = ''
        if(this.formData.key2 == undefined) this.formData.key2 = ''
        if(this.formData.value2 == undefined) this.formData.value2 = ''
        $http({
            method: 'POST',
            url: api_endpoint_v2 + "/webhook",
            data: JSON.stringify(this.formData)
        })
        .then(function (success) {
            console.log(success);
            loadWebHook();
        }, function (error) {
            console.log(error.data);
            loadWebHook();
        });
    }

    $scope.removeWebHookl = function (response_id) {
        WebHookRM.remove({response_id: response_id}).$promise.then(function(resp) {
            loadWebHook();
        });
    }
}