(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .factory('ApiRestangular', ApiRestangular)
        .factory('api', api);
    
    ApiRestangular.$inject = ['Restangular'];
    function ApiRestangular(Restangular) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl('api/v1');
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