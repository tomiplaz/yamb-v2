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