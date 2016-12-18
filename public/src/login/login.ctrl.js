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