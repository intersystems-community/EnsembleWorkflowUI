'use strict';

// TasksGrid controller
// dependency injection
function TasksGridCtrl($scope, $window, $modal, $cookies, WorklistSrvc, $rootScope) {

    // Initialize grid.
    // grid data:
    // grid title, css grid class, column names
    $scope.page.grid = {
        caption: 'Inbox Tasks',
        cssClass: 'table table-condensed table-bordered table-hover',
        columns: [{name: '', property: 'New', align: 'center'},
            {name: 'Priority', property: 'Priority'},
            {name: 'Subject', property: 'Subject'},
            {name: 'Message', property: 'Message'},
            {name: 'Role', property: 'RoleName'},
            {name: 'Assigned To', property: 'AssignedTo'},
            {name: 'Time Created', property: 'TimeCreated'},
            {name: 'Age', property: 'Age'}]
    };


    // data initialization for Worklist
    $scope.page.dataInit = function () {
        if ($scope.page.loginState) {
            $scope.page.loadTasks();
        }
    };


    $scope.page.loadSuccess = function (data) {
        $scope.page.grid.items = data.children;
        // if we get data for other user - logout
        if (!$scope.page.checkUserValidity()) {
            $scope.doExit();
        }

        var date = new Date();

        var hours = (date.getHours() > 9) ? date.getHours() : '0' + date.getHours();
        var minutes = (date.getMinutes() > 9) ? date.getMinutes() : '0' + date.getMinutes();
        var secs = (date.getSeconds() > 9) ? date.getSeconds() : '0' + date.getSeconds();

        $('#updateTime').animate({opacity: 0}, 100, function () {
            $('#updateTime').animate({opacity: 1}, 1000);
        });

        $scope.page.grid.updateTime = ' [Last Update: ' + hours;
        $scope.page.grid.updateTime += ':' + minutes + ':' + secs + ']';
    };


    // all user's tasks loading
    $scope.page.loadTasks = function () {
        $scope.page.loading = true;

        WorklistSrvc.getAll()
            .then(function (response) {
                if (response) {
                    $scope.page.loadSuccess(response.data);
                }
            })
            .catch(function (response) {
                var error = (response && response.data);
                $rootScope.addAlert({type: 'danger', msg: error || 'Data fetching failed. Please reload.'});
            })
            .finally(function () {
                $scope.page.loading = false;
            })
    };


    // load task (worklist) by id
    $scope.page.loadTask = function (id) {
        WorklistSrvc.get(id, $scope.page.authToken)
            .then(function (response) {
                if (response) {
                    $scope.page.task = response.data;
                }
            })
            .catch(function (response) {
                var error = (response && response.data);
                $rootScope.addAlert({type: 'danger', msg: error || 'Unknown error on task load'});
            });
    };

    $scope.page.save = function (action, id) {
        // nothing to do, if no id
        if (!id) return;

        // get full worklist, set action and submit worklist.
        WorklistSrvc.get(id)
            .then(function (response) {
                if (response) {
                    response.data.Task["%Action"] = action;
                    $scope.page.submit(response.data);
                }
            })
            .catch(function (response) {
                var error = (response && response.data);
                $rootScope.addAlert({type: 'danger', msg: error || 'Unknown error on task action'});
            });
    };


    // submit the worklist object
    $scope.page.submit = function (worklist) {
        // send object to server. If ok, refresh data on page.
        WorklistSrvc.save(worklist)
            .then(function () {
                $scope.page.dataInit();
            })
            .catch(function (response) {
                var error = (response && response.data);
                $rootScope.addAlert({type: 'danger', msg: error || 'Unknown error on task action'});
            }
        );
    };

    /* table section */

    // sorting table
    $scope.page.sort = function (property, isUp) {
        $scope.page.predicate = property;
        $scope.page.isUp = !isUp;
        // change sorting icon
        $scope.page.sortIcon = 'fa fa-sort-' + ($scope.page.isUp ? 'up' : 'down') + ' pull-right';
    };

    // selecting row in table
    $scope.page.select = function (item) {
        if ($scope.page.grid.selected) {
            $scope.page.grid.selected.rowCss = '';

            if ($scope.page.grid.selected == item) {
                $scope.page.grid.selected = null;
                return;
            }
        }

        $scope.page.grid.selected = item;
        // change css class to highlight the row
        $scope.page.grid.selected.rowCss = 'info';
    };

    // count currently displayed tasks
    $scope.page.totalCnt = function () {
        return $window.document.getElementById('tasksTable').getElementsByTagName('TR').length - 2;
    };


    // if AssignedTo matches with current user - return 'true'
    $scope.page.isAssigned = function (selected) {
        if (selected) {
            if (selected.AssignedTo.toLowerCase() === $cookies.get('User').toLowerCase())
                return true;
        }
        return false;
    };

    // watching for changes in 'Search' input
    // if there is change, reset the selection.
    $scope.$watch('query', function () {
        if ($scope.page.grid.selected) {
            $scope.page.select($scope.page.grid.selected);
        }
    });

    /* modal window open */

    $scope.page.modalOpen = function (size, id) {
        // if no id - nothing to do
        if (!id) return;

        // obtainig the full object by id. If ok - open modal.
        WorklistSrvc.get(id)
            .then(function (response) {
                if (!response) return;
                // see http://angular-ui.github.io/bootstrap/ for more options
                var modalInstance = $modal.open({
                    templateUrl: 'partials/task.html',
                    controller: 'TaskCtrl',
                    size: size,
                    backdrop: true,
                    resolve: {
                        task: function () {
                            return response.data;
                        },
                        submit: function () {
                            return $scope.page.submit
                        }
                    }
                });

                // onResult
                modalInstance.result.then(function (reason) {
                    if (reason === 'save') {
                        $rootScope.addAlert({type: 'success', msg: 'Task saved'});
                    }
                });
            })
            .catch(function (response) {
                var error = (response && response.data);
                $rootScope.addAlert({type: 'danger', msg: error || 'Unknown error on modal open'});
            });

    };


    /*  User's validity checking. */

    // If we get the data for other user, logout immediately
    $scope.page.checkUserValidity = function () {
        var user = $cookies.get('User');

        for (var i = 0; i < $scope.page.grid.items.length; i++) {

            if ($scope.page.grid.items[i].AssignedTo && (user.toLowerCase() !== $scope.page.grid.items[i].AssignedTo.toLowerCase())) {
                return false;
            }
            else if ($scope.page.grid.items[i].AssignedTo && (user.toLowerCase() == $scope.page.grid.items[i].AssignedTo.toLowerCase())) {
                return true;
            }
        }

        return true;
    };


    /* Initialize */

    // sort table (by Age, asc)
    // to change sorting column change 'columns[<index>]'
    $scope.page.sort($scope.page.grid.columns[7].property, true);

    $scope.page.dataInit();
}

// resolving minification problems
TasksGridCtrl.$inject = ['$scope', '$window', '$modal', '$cookies', 'WorklistSrvc', '$rootScope'];
controllersModule.controller('TasksGridCtrl', TasksGridCtrl);


