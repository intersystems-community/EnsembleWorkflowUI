'use strict';

// Main controller
// Controls the authentication. Loads all the worklists for user.
function MainCtrl($scope, $location, $cookies, WorklistSrvc, SessionSrvc, UtilSrvc, $rootScope, $timeout, $filter) {
    $scope.page = {};
    $scope.page.alerts = [];
    $scope.utils = UtilSrvc;
    $scope.page.loading = false;
    $scope.page.loginState = $cookies.get('User') ? 1 : 0;

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
                $scope.page.loginState = 1;
                // set cookie to restore loginState after page reload
                $cookies.put('User', login.toLowerCase());

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
    $rootScope.doExit = function (isSession) {
        var promise;

        if (isSession) {
            promise = SessionSrvc.logout()
        } else {
            promise = $timeout(function() {}, 10);
        }

        promise
            .then(function () {
                $scope.page.loginState = 0;
                $scope.page.grid.items = null;
                $scope.page.loading = false;
                // clear cookies
                $cookies.remove('User');
            })
            .catch(function (error) {
                $rootScope.addAlert({type: 'danger', msg: error || 'Unknown error on logout'});
            });
    };

}

// resolving minification problems
MainCtrl.$inject = ['$scope', '$location', '$cookies', 'WorklistSrvc', 'SessionSrvc', 'UtilSrvc', '$rootScope', '$timeout', '$filter'];
controllersModule.controller('MainCtrl', MainCtrl);

