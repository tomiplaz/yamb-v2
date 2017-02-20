(function() {
    'use strict';

    angular
        .module('commonServices.api', ['restangular'])
        .factory('ApiRestangular', ApiRestangular)
        .factory('apiService', apiService);
    
    ApiRestangular.$inject = ['Restangular', '$localStorage'];
    function ApiRestangular(Restangular, $localStorage) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer
                .setBaseUrl('api/v1')
                .setDefaultHeaders({
                    Authorization: 'Bearer ' + $localStorage.token
                });
        });
    }
    
    apiService.$inject = ['ApiRestangular'];
    function apiService(ApiRestangular) {
        return {
            get: get,
            create: create,
            custom: custom
        }

        function get(resource, id) {
            if (id) {
                return ApiRestangular.one(resource, id).doGET();
            } else {
                return ApiRestangular.all(resource).doGET();
            }
        }

        function create(resource, data) {
            return ApiRestangular.all(resource).post(data);
        }

        function custom(resource, id, method, route, data, params, headers) {
            var restangularObject = (id ? ApiRestangular.one(resource, id) : ApiRestangular.all(resource));
            return restangularObject.customOperation(method, route, params, headers, data);
        }
    }
})();