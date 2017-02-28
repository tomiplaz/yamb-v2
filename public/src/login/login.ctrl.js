(function() {
    'use strict';

    angular
        .module('yamb-v2.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['authService', '$localStorage', '$state', '$rootScope', 'toastr'];
    function LoginCtrl(authService, $localStorage, $state, $rootScope, toastr) {
        var vm = this;

        activate();

        vm.confirm = confirm;

        function activate() {
            vm.title = "Login";
        }

        function confirm() {
            authService.login(vm.input).then(function(success) {
                $localStorage.token = success.token;
                $rootScope.user = success.user;
                $state.go('root.play');
            }, function(error) {
                if (error.status === 401) {
                    toastr.error("Invalid credentials!", "Error");
                } else {
                    toastr.error("Something went wrong.", "Error");
                }
            });
        }
    }
})();