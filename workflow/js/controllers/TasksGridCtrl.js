'use strict';

// TasksGrid controller
// dependency injection
function TasksGridCtrl($scope, $window, $modal, WorklistSrvc, $rootScope, $filter) {

    // Initialize grid.
    // grid data:
    // grid title, css grid class, column names
    $scope.page.grid = {
        caption: 'Inbox Tasks',
        cssClass: 'table table-condensed table-bordered table-hover',
        columns: [
            {name: '', property: 'New', align: 'center', width: 60},
            {name: 'Priority', property: 'priority', align: 'right', width: 100},
            {name: 'Subject', property: 'subject'},
            {name: 'Message', property: 'message'},
            {name: 'Role', property: 'role'},
            {name: 'Time Created', property: 'timeCreated', align: 'center', width: 140}
        ]
    };


    // data initialization for Worklist
    $scope.page.dataInit = function () {
        if ($scope.page.loginState) {
            $scope.page.loadTasks();
        }
    };


    $scope.page.loadSuccess = function (tasks) {
        $scope.page.grid.items = tasks;

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
            .then(function (tasks) {
                tasks.forEach(function(task) { task.timeCreated = $filter('date')(task.timeCreated.replace(' ', 'T'), window.appConfig.dateTimeFormat) })
                $scope.page.loadSuccess(tasks || []);
            })
            .catch(function (response) {
                $rootScope.addAlert({type: 'danger', msg: response || 'Data fetching failed. Please reload.'});
            })
            .finally(function () {
                $scope.page.loading = false;
            })
    };


    // load task (worklist) by id
    $scope.page.loadTask = function (id) {
        WorklistSrvc.get(id, $scope.page.authToken)
            .then(function (task) {
                if (task) {
                    $scope.page.task = task;
                }
            })
            .catch(function (response) {
                $rootScope.addAlert({type: 'danger', msg: response || 'Unknown error on task load'});
            });
    };

    $scope.page.save = function (action, id) {
        // nothing to do, if no id
        if (!id) return;

        // get full worklist, set action and submit worklist.
        WorklistSrvc.get(id)
            .then(function (task) {
                if (task) {
                    task.action = action;
                    $scope.page.submit(task);
                }
            })
            .catch(function (response) {
                $rootScope.addAlert({type: 'danger', msg: response || 'Unknown error on task action'});
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
                $rootScope.addAlert({type: 'danger', msg: response || 'Unknown error on task action'});
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

    // count currently displayed tasks
    $scope.page.totalCnt = function () {
        return $window.document.getElementById('tasksTable').getElementsByTagName('TR').length - 2;
    };

    /* modal window open */
    $scope.page.modalOpen = function (size, id) {
        // if no id - nothing to do
        if (!id) return;

        // obtaining the full object by id. If ok - open modal.
        WorklistSrvc.get(id)
            .then(function (task) {
                if (!task) return;

                task.timeCreated = $filter('date')(task.timeCreated.replace(' ', 'T'), window.appConfig.dateTimeFormat);

                // see http://angular-ui.github.io/bootstrap/ for more options
                var modalInstance = $modal.open({
                    templateUrl: 'partials/task.html',
                    controller: 'TaskCtrl',
                    size: size,
                    backdrop: true,
                    resolve: {
                        task: function () {
                            return task;
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
                $rootScope.addAlert({type: 'danger', msg: response || 'Unknown error on modal open'});
            });

    };

    /* Initialize */

    // sort table (by time, desc)
    // to change sorting column change 'columns[<index>]'
    $scope.page.sort($scope.page.grid.columns[5].property, false);

    $scope.page.dataInit();
}

// resolving minification problems
TasksGridCtrl.$inject = ['$scope', '$window', '$modal', 'WorklistSrvc', '$rootScope', '$filter'];
controllersModule.controller('TasksGridCtrl', TasksGridCtrl);


