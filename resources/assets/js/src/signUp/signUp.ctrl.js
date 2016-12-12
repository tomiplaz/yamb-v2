(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .controller('SignUpCtrl', SignUpCtrl);
    
    SignUpCtrl.$inject = ['api'];
    function SignUpCtrl(api) {
        var vm = this;

        vm.title = "Sign Up";

        vm.confirm = confirm;

        function confirm() {
            //api.
            console.log(vm.name, vm.password);
        }
    }
})();