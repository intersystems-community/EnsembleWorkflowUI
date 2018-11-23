'use strict';

// Worklist service
function WorklistSrvc(rest) {
    return {
        // save worklist object
        save:
            function (worklist, headers) {
                var config = { method: 'POST', url: window.RESTWebApp.appName + '/tasks/' + worklist._id, data: worklist };

                if (headers) {
                    config.headers = headers;
                }

                return rest.http(config);
            },

        // get worklist by id
        get:
            function (id, headers) {
                var config = { method: 'GET', url: window.RESTWebApp.appName + '/tasks/' + id };

                if (headers) {
                    config.headers = headers; // {'Authorization': baseAuthToken};
                }

                return rest.http(config);
            },

        // get all worklists for current user
        getAll:
            function (headers) {
                var config = { method: 'GET', url: window.RESTWebApp.appName + '/tasks' };

                if (headers) {
                    config.headers = headers;
                }

                return rest.http(config);
            }
    }
}

// resolving minification problems
WorklistSrvc.$inject = ['RESTSrvc'];
servicesModule.factory('WorklistSrvc', WorklistSrvc);

