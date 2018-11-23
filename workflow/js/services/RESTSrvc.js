'use strict';

function RESTSrvc($http, $root) {
  return {
    http:
      function(config) {
        return $http(config)
            .catch(function (response) {
                if (response.status === 403 || response.status === 404) {
                    $root.doExit(false);
                }

                throw {data: 'Login unsuccessful'};
            });
      }
    }
};

// resolving minification problems
RESTSrvc.$inject = ['$http', '$rootScope'];
servicesModule.factory('RESTSrvc', RESTSrvc);
  
