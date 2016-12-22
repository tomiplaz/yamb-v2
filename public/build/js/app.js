(function() {
    'use strict';

    angular
        .module('yamb-v2', [
            'ui.router',
            'services',
            'yamb-v2.home',
            'yamb-v2.register',
            'yamb-v2.login',
            'yamb-v2.users',
            'yamb-v2.play'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$locationProvider']
    function config($stateProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/home/home.html',
                controller: 'HomeCtrl as home'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'src/register/register.html',
                controller: 'RegisterCtrl as register'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'src/login/login.html',
                controller: 'LoginCtrl as login'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'src/users/users.html',
                controller: 'UsersCtrl as users',
                resolve: {
                    users: function(api) {
                        return api.get('users');
                    }
                }
            })
            .state('play', {
                url: '/play',
                templateUrl: 'src/play/play.html',
                controller: 'PlayCtrl as play',
                resolve: {
                    columns: function(api) {
                        return api.get('columns');
                    },
                    rows: function(api) {
                        return api.get('rows');
                    }
                }
            });
        
        $locationProvider.html5Mode(true);
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('register');
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.home', [])
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [];
    function HomeCtrl() {
        var vm = this;

        vm.states = [
            {
                name: 'login',
                label: 'Login'
            },
            {
                name: 'register',
                label: 'Register'
            },
            {
                name: 'play',
                label: 'Play'
            },
            {
                name: 'users',
                label: 'Users'
            }
        ];
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.login', [])
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['auth', '$localStorage'];
    function LoginCtrl(auth, $localStorage) {
        var vm = this;

        activate();

        function activate() {
            vm.title = "Login";

            vm.confirm = confirm;
        }

        function confirm() {
            auth.login(vm.input).then(function(success) {
                console.log("Success", success);
                $localStorage.token = success.token;
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.play', [])
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['columns', 'rows'];
    function PlayCtrl(columns, rows) {
        var vm = this;

        activate();

        function activate() {
            vm.columns = columns;
            vm.rows = rows;

            vm.bla = {
                red: true
            };
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.register', [])
        .controller('RegisterCtrl', RegisterCtrl);
    
    RegisterCtrl.$inject = ['auth', '$state'];
    function RegisterCtrl(auth, $state) {
        var vm = this;

        activate();

        function activate() {
            vm.title = "Register";
            
            vm.confirm = confirm;
        }

        function confirm() {
            auth.register(vm.input).then(function(success) {
                console.log("Success", success);
                $state.go('login');
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('services', [
            'services.auth',
            'services.api'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.users', [])
        .controller('UsersCtrl', UsersCtrl);
    
    UsersCtrl.$inject = ['users'];
    function UsersCtrl(users) {
        var vm = this;

        activate();

        function activate() {
            vm.title = "Users";
            vm.users = users;
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('die', die);
    
    die.$inject = [];
    function die() {
        return {
            link: link,
            templateUrl: 'src/play/directives/die.html',
            replace: true,
            scope: {}
        };

        function link(scope, elem, attrs) {
            scope.value = getRandomValue();

            function getRandomValue() {
                return Math.round(Math.random() * 5 + 1);
            }
        }
    }
})();
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
(function() {
    'use strict';

    angular
        .module('services.auth', ['restangular'])
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