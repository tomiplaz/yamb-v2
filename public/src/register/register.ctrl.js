(function() {
    'use strict';

    angular
        .module('yamb-v2.register')
        .controller('RegisterCtrl', RegisterCtrl);
    
    RegisterCtrl.$inject = ['authService', '$state', 'toastr'];
    function RegisterCtrl(authService, $state, toastr) {
        var vm = this;

        vm.confirm = confirm;

        function confirm() {
            authService.register(vm.input).then(function(success) {
                toastr.success("You have registered successfully! Please log in.", "Success");
                $state.go('root.login');
            }, function(error) {
                toastr.error("Something went wrong.", "Error");
            });
        }
    }
})();