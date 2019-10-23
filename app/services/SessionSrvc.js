'use strict';

// Session service
function SessionSrvc(rest) {
  return {
    logout:
      function() {
        return rest.http({ method: 'GET', url: appConfig.restAppName + '/logout' });
      }
  }
};

// resolving minification problems
SessionSrvc.$inject = ['RESTSrvc'];
servicesModule.factory('SessionSrvc', SessionSrvc);

