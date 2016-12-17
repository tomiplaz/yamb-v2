(function() {
    'use strict';

    angular
        .module('yamb-v2')
        .controller('SignUpCtrl', SignUpCtrl);
    
    SignUpCtrl.$inject = ['auth'];
    function SignUpCtrl(auth) {
        var vm = this;

        vm.title = "Sign Up";

        vm.confirm = confirm;

        function confirm() {
            auth.register(vm.input).then(function(success) {
                console.log("Success", success);
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();