'use strict';

// Main controller
// Controls the authentication. Loads all the worklists for user.
function MainCtrl($scope, WorklistSrvc, UtilSrvc, $rootScope, $filter, $window) {
    $scope.page = {};
    $scope.page.alerts = [];
    $scope.utils = UtilSrvc;
    $scope.page.loading = false;
    $scope.User = $window.User;

    $scope.page.closeAlert = function (index) {
        if ($scope.page.alerts.length) {
            $('.alert:nth-child(' + (index + 1) + ')').animate({opacity: 0, top: "-=150"}, 400, function () {
                $scope.page.alerts.splice(index, 1);
                $scope.$apply();
            });
        }
    };

    $rootScope.addAlert = function (alert) {
        $scope.page.alerts.push(alert);

        if ($scope.page.alerts.length > 5) {
            $scope.page.closeAlert(0);
        }
    };

    /* Authentication section */
    $scope.page.makeBaseAuth = function (user, password) {
        var token = user + ':' + password;
        var hash = Base64.encode(token);
        return "Basic " + hash;
    };

    // login
    $scope.page.doLogin = function (login, password) {
        var authToken = $scope.page.makeBaseAuth(login, password);
        $scope.page.loading = true;

        var headers = { 'Authorization': authToken };

        WorklistSrvc.getAll(headers)
            .then(function (tasks) {
                $scope.page.alerts = [];

                // refresh the data on page
                tasks.forEach(function(task) { task.timeCreated = $filter('date')(task.timeCreated.replace(' ', 'T'), window.appConfig.dateTimeFormat) })
                $scope.page.loadSuccess(tasks || []);
            })
            .catch(function (response) {
                $rootScope.addAlert({type: 'danger', msg: response || 'Login unsuccessful'});
            })
            .finally(function () {
                $scope.page.loading = false;
            })
    };

    // logout
    $rootScope.doExit = function () {
        $window.location.href = '?CacheLogout=1';
    };

}

// resolving minification problems
MainCtrl.$inject = ['$scope', 'WorklistSrvc', 'UtilSrvc', '$rootScope', '$filter', '$window'];
controllersModule.controller('MainCtrl', MainCtrl);

