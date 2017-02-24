(function() {
    'use strict';

    angular
        .module('yamb-v2.services')
        .factory('modalService', modalService);
    
    modalService.$inject = ['$uibModal'];
    function modalService($uibModal) {
        var service = {
            MODALS: {
                USER_INFO: 'userInfoModal',
                GAME_INFO: 'gameInfoModal'
            },
            getModalInstance: getModalInstance
        };

        return service;

        function getModalInstance(modalName, data) {
            var modalInstance = $uibModal.open({
                animation: true,
                component: modalName,
                resolve: getResolveObject(modalName, data)
            });

            modalInstance.result.then(dullFunction, dullFunction);

            return modalInstance;

            function getResolveObject(modalName, data) {
                switch (modalName) {
                    case service.MODALS.USER_INFO:
                        return {
                            user: function() {
                                return data.user;
                            }
                        };
                    default:
                        return null;
                }
            }
            
            function dullFunction() {
                return;
            }
        }
    }
})();