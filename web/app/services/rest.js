'use strict';

function RESTSrvc($http, $q) {
     return {
        http:
        function (config, isCancellable) {
            if (config) {
                config.headers = config.headers || {};
                config.headers["Content-Type"] = "application/json; charset=UTF-8";
                config.headers["Accept"] = "application/json;charset=utf-8";

                if (angular.isUndefined(config.data)) {
                    config.data = '';
                }
            }

            var canceller = $q.defer();
 
            var cancel = function() {
                canceller.resolve("cancelled");
            };

            config.timeout = canceller.promise;

            var deferred = $q.defer();

            if (window.cspSessionTimer) {
                clearTimeout(cspSessionTimer);
                cspSessionTimerReset();
            }

            $http(config).then(
                function(response) {
                    deferred.resolve(response.data);
                },
                function(data, status, headers, config) {
                    deferred.reject(data, status, headers, config);
                }
            );

            if (isCancellable) {
                return {
                    promise: deferred.promise,
                    cancel: cancel
                };
            }

            return deferred.promise;
        }
    }
};

// resolving minification problems
RESTSrvc.$inject = ['$http', '$q'];
servicesModule.factory('RESTSrvc', RESTSrvc);
