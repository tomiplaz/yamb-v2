(function() {
    'use strict';

    angular
        .module('yamb-v2.users', [])
        .controller('UsersCtrl', UsersCtrl);
    
    UsersCtrl.$inject = ['users'];
    function UsersCtrl(users) {
        var vm = this;

        activate();

        function activate() {
            vm.title = "Users";
            vm.users = users;
        }
    }
})();