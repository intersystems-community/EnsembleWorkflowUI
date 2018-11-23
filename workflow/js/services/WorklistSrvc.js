'use strict';

// Worklist service
function WorklistSrvc(rest) {
    return {
        // save worklist object
        save:
            function (worklist, baseAuthToken) {
                var config = { method: 'POST', url: window.RESTWebApp.appName + '/tasks/' + worklist._id, data: worklist };

                if (baseAuthToken) {
                    config.headers = {'Authorization': baseAuthToken};
                }

                return rest.http(config);
            },

        // get worklist by id
        get:
            function (id, baseAuthToken) {
                var config = { method: 'GET', url: window.RESTWebApp.appName + '/tasks/' + id };

                if (baseAuthToken) {
                    config.headers = {'Authorization': baseAuthToken};
                }

                return rest.http(config);
            },

        // get all worklists for current user
        getAll:
            function (baseAuthToken) {
                var config = { method: 'GET', url: window.RESTWebApp.appName + '/tasks' };

                if (baseAuthToken) {
                    config.headers = {'Authorization': baseAuthToken};
                }

                return rest.http(config);
            }
    }
}

// resolving minification problems
WorklistSrvc.$inject = ['RESTSrvc'];
servicesModule.factory('WorklistSrvc', WorklistSrvc);

