(function() {
    'use strict';

    angular
        .module('yamb-v2', ['ui.router', 'restangular'])
        .config(config)
        .run(run);
    
    config.$inject = ['$stateProvider', 'RestangularProvider']
    function config($stateProvider, RestangularProvider) {
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
            })

        RestangularProvider
            .setBaseUrl('api/v1');
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
    
    SignUpCtrl.$inject = [];
    function SignUpCtrl() {
        var vm = this;

        vm.title = "Sign Up";

        vm.confirm = confirm;

        function confirm() {
            console.log(vm.name, vm.password);
        }
    }
})();