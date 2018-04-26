'use strict';

// Session service
function SessionSrvc(RESTSrvc) {    
  return {
    // save worklist object
    logout: 
      function(baseAuthToken) {
        return RESTSrvc.getPromise( {method: 'GET', url: RESTWebApp.appName + '/logout', headers: {'Authorization' : baseAuthToken} });
      }
  }
};

// resolving minification problems
SessionSrvc.$inject = ['RESTSrvc'];
servicesModule.factory('SessionSrvc', SessionSrvc);

