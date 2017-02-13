(function() {
    'use strict';

    angular
        .module('yamb-v2.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['authService', '$localStorage', '$state', 'userService'];
    function LoginCtrl(authService, $localStorage, $state, userService) {
        var vm = this;

        activate();

        vm.confirm = confirm;

        function activate() {
            vm.title = "Login";
        }

        function confirm() {
            authService.login(vm.input).then(function(success) {
                $localStorage.token = success.token;
                userService.updateUser();
                $state.go('root.play');
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();