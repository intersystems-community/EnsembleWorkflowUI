'use strict';

// Task controller
// dependency injection
function TaskCtrl($scope, $modalInstance, task, submit) {
  $scope.page = {};
  $scope.page.task = task || {};
  $scope.page.task.actions = $scope.page.task.actions ? $scope.page.task.actions.split(',') : [];

  // dismiss modal
  $scope.page.cancel = function () {
    $modalInstance.dismiss('cancel');
  };

  // perform a specified action
  $scope.page.doAction = function(action) {
    $scope.page.task.action = action;

    submit($scope.page.task);
    $modalInstance.close(action);
  }

}

// resolving minification problems
TaskCtrl.$inject = ['$scope', '$modalInstance', 'task', 'submit'];
controllersModule.controller('TaskCtrl', TaskCtrl);


