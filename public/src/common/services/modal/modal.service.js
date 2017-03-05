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
                    case service.MODALS.GAME_INFO:
                        return {
                            user: function() {
                                return data.user;
                            },
                            bestGames: function(apiService) {
                                if (!data.game) {
                                    return apiService.custom('users', data.user.id, 'get', 'best-games');
                                } else {
                                    return null;
                                }
                            },
                            game: function() {
                                if (data.game) {
                                    return data.game;
                                } else {
                                    return null;
                                }
                            },
                            diceKey: function() {
                                return data.diceKey;
                            }
                        }
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