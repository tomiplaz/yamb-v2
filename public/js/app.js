(function() {
    'use strict';

    angular
        .module('yamb-v2', ['ui.router', 'restangular'])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider']
    function config($stateProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'home.html',
                controller: 'HomeCtrl as home'
            })
            .state('signUp', {
                url: 'sign-up/',
                templateUrl: 'signUp.html',
                controller: 'SignUpCtrl as signUp'
            });
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('signUp');
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [];
    function HomeCtrl() {
        var vm = this;

        vm.title = "This is home";
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .controller('SignUpCtrl', SignUpCtrl);
    
    SignUpCtrl.$inject = ['auth'];
    function SignUpCtrl(auth) {
        var vm = this;

        vm.title = "Sign Up";

        vm.confirm = confirm;

        function confirm() {
            auth.register(vm.input).then(function(success) {
                console.log("Success", success);
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();
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
(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .factory('auth', auth);

    auth.$inject = ['Restangular'];
    function auth(Restangular) {
        return {
            register: register,
            login: login
        }

        function register(data) {
            return Restangular.all('register').post(data);
        }

        function login(data) {
            return Restangular.all('login').post(data);
        }
    }
})();