(function() {
    'use strict';

    angular
        .module('yamb-v2.register')
        .controller('RegisterCtrl', RegisterCtrl);
    
    RegisterCtrl.$inject = ['authService', '$state'];
    function RegisterCtrl(authService, $state) {
        var vm = this;

        activate();

        function activate() {
            vm.title = "Register";
            
            vm.confirm = confirm;
        }

        function confirm() {
            authService.register(vm.input).then(function(success) {
                console.log("Success", success);
                $state.go('login');
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();