(function() {
    'use strict';

    angular
        .module('services.api', ['restangular', 'ngStorage'])
        .factory('ApiRestangular', ApiRestangular)
        .factory('api', api);
    
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
    
    api.$inject = ['ApiRestangular'];
    function api(ApiRestangular) {
        return {
            get: get,
            create: create
        }

        function get(resource, id) {
            if (id) {
                return ApiRestangular.one(resource, id).get();
            } else {
                return ApiRestangular.all(resource).getList();
            }
        }

        function create(resource, data) {
            return ApiRestangular.all(resource).post(data);
        }
    }
})();