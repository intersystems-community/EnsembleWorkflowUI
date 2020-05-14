'use strict';
var servicesModule = angular.module('servicesModule',[]);
var controllersModule = angular.module('controllersModule', []);
var app = angular.module('app', ['ngRoute', 'ui.bootstrap', 'servicesModule', 'controllersModule']);

app.config([ '$routeProvider', function( $routeProvider ) {
  $routeProvider.when( '/tasks',     {templateUrl: 'app/partials/tasks.html'} );
  $routeProvider.when( '/tasks/:id', {templateUrl: 'app/partials/task.html',  controller: 'TaskCtrl'} );

  $routeProvider.otherwise( {redirectTo: '/tasks'} );
}]);