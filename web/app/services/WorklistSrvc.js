'use strict';

// Worklist service
function WorklistSrvc(rest) {
    return {
        // save task object
        save:
            function (task, headers) {
                var config = { method: 'POST', url: window.appConfig.restAppName + '/task/' + task.id, data: task };

                if (headers) {
                    config.headers = headers;
                }

                return rest.http(config);
            },

        // get worklist by id
        get:
            function (id, headers) {
                var config = { method: 'GET', url: window.appConfig.restAppName + '/task/' + id };

                if (headers) {
                    config.headers = headers; // {'Authorization': baseAuthToken};
                }

                return rest.http(config);
            },

        // get all worklists for current user
        getAll:
            function (headers) {
                var config = { method: 'GET', url: window.appConfig.restAppName + '/tasks' };

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

