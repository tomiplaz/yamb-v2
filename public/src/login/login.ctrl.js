(function() {
    'use strict';

    angular
        .module('yamb-v2.login', [])
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['authService', '$localStorage'];
    function LoginCtrl(authService, $localStorage) {
        var vm = this;

        activate();

        function activate() {
            vm.title = "Login";

            vm.confirm = confirm;
        }

        function confirm() {
            authService.login(vm.input).then(function(success) {
                $localStorage.token = success.token;
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();