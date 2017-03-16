(function() {
    'use strict';

    angular
        .module('yamb-v2', [
            'ui.router',
            'ui.bootstrap',
            'ngAnimate',
            'ngTouch',
            'angular-jwt',
            'ngStorage',
            'toastr',
            'ngMessages',
            'commonServices',
            'yamb-v2.services',
            'yamb-v2.filters',
            'yamb-v2.root',
            'yamb-v2.home',
            'yamb-v2.register',
            'yamb-v2.login',
            'yamb-v2.play',
            'yamb-v2.statistics',
            'yamb-v2.leaderboard',
            'yamb-v2.rules',
            'yamb-v2.about'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$locationProvider']
    function config($locationProvider) {        
        $locationProvider.html5Mode(true);
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('root.home');
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.about', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.about', {
                url: 'about',
                templateUrl: 'src/about/about.html'
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.home', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.home', {
                url: 'home',
                templateUrl: 'src/home/home.html',
                controller: 'HomeCtrl as home',
                resolve: {
                    lastGame: function(apiService) {
                        return apiService.custom('games', null, 'get', 'last-game');
                    }
                }
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.home')
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = ['lastGame'];
    function HomeCtrl(lastGame) {
        var vm = this;

        vm.lastGame = (lastGame ? lastGame.plain() : lastGame);
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.leaderboard', {
                url: 'leaderboard',
                templateUrl: 'src/leaderboard/leaderboard.html',
                controller: 'LeaderboardCtrl as leaderboard',
                resolve: {
                    users: function(apiService) {
                        return apiService.get('users');
                    }
                }
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .controller('LeaderboardCtrl', LeaderboardCtrl);
    
    LeaderboardCtrl.$inject = ['users', 'helperService', 'apiService', 'modalService'];
    function LeaderboardCtrl(users, helperService, apiService, modalService) {
        var vm = this;

        activate();

        vm.setSelected = setSelected;
        vm.userClicked = userClicked;
        vm.bestResultClicked = bestResultClicked;

        function activate() {
            vm.options = {
                dice: helperService.getDiceOptions(),
                type: helperService.getTypeOptions('leaderboard')
            };

            vm.users = (users ? users.plain() : users);

            vm.selected = {
                dice: vm.options.dice[0],
                type: vm.options.type[0]
            };

            onSelectedChanged();
        }

        function onSelectedChanged() {
            vm.orderByPredicate = getOrderByPredicate(
                vm.selected.type.key,
                vm.selected.dice.key
            );

            function getOrderByPredicate() {
                var args = arguments;

                return function(item) {
                    return item[args[0]][args[1]];
                }
            }
        }

        function setSelected(key, item) {
            vm.selected[key] = item;
            onSelectedChanged();
        }

        function userClicked(user) {
            var modal = modalService.getModalInstance(
                modalService.MODALS.USER_INFO,
                {user: user}
            );
        }

        function bestResultClicked(user, diceKey) {
            if (vm.selected.type.key === 'best_results') {
                var modal = modalService.getModalInstance(
                    modalService.MODALS.GAME_INFO,
                    {user: user, diceKey: diceKey}
                );
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.login', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.login', {
                url: 'login',
                templateUrl: 'src/login/login.html',
                controller: 'LoginCtrl as login'
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.login')
        .controller('LoginCtrl', LoginCtrl);

    LoginCtrl.$inject = ['authService', '$localStorage', '$state', '$rootScope', 'toastr'];
    function LoginCtrl(authService, $localStorage, $state, $rootScope, toastr) {
        var vm = this;

        activate();

        vm.confirm = confirm;

        function activate() {
            vm.title = "Login";
        }

        function confirm() {
            authService.login(vm.input).then(function(success) {
                $localStorage.token = success.token;
                $rootScope.user = success.user;
                $state.go('root.play');
            }, function(error) {
                if (error.status === 401) {
                    toastr.error("Invalid credentials!", "Error");
                } else {
                    toastr.error("Something went wrong.", "Error");
                }
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.register', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.register', {
                url: 'register',
                templateUrl: 'src/register/register.html',
                controller: 'RegisterCtrl as register'
            });
    }
})();
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
(function() {
    'use strict';

    angular
        .module('yamb-v2.play', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.play', {
                url: 'play',
                templateUrl: 'src/play/play.html',
                controller: 'PlayCtrl as play'
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['$scope', 'apiService', 'userService', 'toastr', 'helperService', 'modalService', '$state'];
    function PlayCtrl($scope, apiService, userService, toastr, helperService, modalService, $state) {
        var vm = this;

        var userId = userService.getUserId();

        activate();

        vm.setSelectedDiceOption = setSelectedDiceOption;
        vm.startGame = startGame;
        vm.roll = roll;
        vm.undo = undo;
        vm.setRollNumber = setRollNumber;
        vm.setIsInputRequired = setIsInputRequired;
        vm.setIsAnnouncementRequired = setIsAnnouncementRequired;
        vm.setIsUndoDisabled = setIsUndoDisabled;
        vm.handleFinishedGame = handleFinishedGame;

        function activate() {
            vm.diceOptions = helperService.getDiceOptions();
            setSelectedDiceOption(vm.diceOptions[0]);

            vm.rollNumber = 0;
            vm.hasGameStarted = false;
            vm.isInputRequired = false;
            vm.isAnnouncementRequired = false;
            vm.isUndoDisabled = true;
        }

        function setSelectedDiceOption(diceOption) {
            vm.selectedDiceOption = diceOption;
        }

        function startGame() {
            vm.hasGameStarted = true;
            vm.diceIndices = getDiceIndices(vm.selectedDiceOption.value);

            apiService.custom('games', null, 'post', 'game-started', {
                user_id: userId,
                number_of_dice: vm.selectedDiceOption.value.toString()
            });

            $scope.$broadcast('start');
            roll();
        }
        
        function roll() {
            incrementRollNumber();
            setIsUndoDisabled(true);

            $scope.$broadcast('roll');

            if (vm.rollNumber === 3) {
                setIsInputRequired(true);
            }
        }

        function undo() {
            $scope.$broadcast('undo');
        }

        function getDiceIndices(numberOfDice) {
            var diceIndices = [];

            for (var i = 0; i < numberOfDice; i++) {
                diceIndices.push(i);
            }

            return diceIndices;
        }

        function incrementRollNumber() {
            ++vm.rollNumber;
        }

        function setRollNumber(value) {
            vm.rollNumber = value;
        }

        function setIsInputRequired(value) {
            vm.isInputRequired = value;
        }

        function setIsAnnouncementRequired(value) {
            vm.isAnnouncementRequired = value;
        }

        function setIsUndoDisabled(value) {
            vm.isUndoDisabled = value;
        }

        function handleFinishedGame(cells, finalResult) {
            $scope.$broadcast('stop');
            
            displayGame();
            saveGame();

            function displayGame() {
                var recentGame = {
                    result: finalResult,
                    duration: $scope.timer.value,
                    cells: cells
                };

                var modal = modalService.getModalInstance(
                    modalService.MODALS.GAME_INFO,
                    {
                        user: userService.getUser(),
                        recentGame: recentGame,
                        diceKey: vm.selectedDiceOption.key
                    }
                );
            }

            function saveGame() {
                var data = {
                    game: {
                        user_id: userId,
                        number_of_dice: vm.selectedDiceOption.value.toString(),
                        result: finalResult,
                        duration: $scope.timer.value
                    },
                    cells: getMappedCells(cells)
                };

                apiService
                    .create('games', data)
                    .then(successCallback, errorCallback)
                    .finally(finallyCallback);

                function getMappedCells(cells) {
                    var mappedCells = [];

                    for (var cellKey in cells) {
                        mappedCells.push({
                            row_id: cells[cellKey].row.id,
                            column_id: cells[cellKey].column.id,
                            value: cells[cellKey].value,
                            input_turn: cells[cellKey].inputTurn
                        });
                    }

                    return mappedCells;
                }

                function successCallback(response) {
                    toastr.success("Game saved.");
                }

                function errorCallback(response) {
                    toastr.error("Game not saved.");
                }

                function finallyCallback() {
                    $state.reload();
                }
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('yamb-v2.root', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root', {
                url: '/',
                abstract: true,
                templateUrl: 'src/root/root.html',
                controller: 'RootCtrl as root',
                resolve: {
                    rows: function(apiService) {
                        return apiService.get('rows');
                    },
                    columns: function(apiService) {
                        return apiService.get('columns');
                    },
                    user: function(userService) {
                        return userService.getUser();
                    }
                }
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.root')
        .controller('RootCtrl', RootCtrl);
    
    RootCtrl.$inject = ['rows', 'columns', 'user', '$localStorage', '$state', '$rootScope'];
    function RootCtrl(rows, columns, user, $localStorage, $state, $rootScope) {
        var vm = this;

        activate();

        vm.logout = logout;

        function activate() {
            $rootScope.user = (user ? user.plain() : user);
            $rootScope.rows = rows.plain();
            $rootScope.columns = columns.plain();

            vm.isNavCollapsed = true;

            vm.leftStates = [
                {
                    name: 'root.play',
                    label: 'Play'
                },
                {
                    name: 'root.rules',
                    label: 'Rules'
                },
                {
                    name: 'root.leaderboard',
                    label: 'Leaderboard'
                },
                {
                    name: 'root.statistics',
                    label: 'Statistics'
                },
                {
                    name: 'root.about',
                    label: 'About'
                }
            ];

            vm.rightStates = [
                {
                    name: 'root.register',
                    label: 'Register'
                },
                {
                    name: 'root.login',
                    label: 'Login'
                }
            ];
        }

        function logout() {
            delete $localStorage.token;
            $rootScope.user = null;
            vm.isNavCollapsed = true;
            $state.go('root.home');
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.rules', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.rules', {
                url: 'rules',
                templateUrl: 'src/rules/rules.html',
                controller: 'RulesCtrl as rules'
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.rules')
        .controller('RulesCtrl', RulesCtrl);
    
    RulesCtrl.$inject = [];
    function RulesCtrl() {
        var vm = this;

        activate();

        function activate() {
            //
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics', [])
        .config(config);
    
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('root.statistics', {
                url: 'statistics',
                templateUrl: 'src/statistics/statistics.html',
                controller: 'StatisticsCtrl as statistics',
                resolve: {
                    worldwide: function(apiService) {
                        return apiService.get('statistics');
                    },
                    personal: function(apiService, userService) {
                        var userId = userService.getUserId();
                        if (userId) {
                            return apiService.get('statistics', userId);
                        } else {
                            return null;
                        }
                    }
                }
            });
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics')
        .controller('StatisticsCtrl', StatisticsCtrl);
    
    StatisticsCtrl.$inject = ['worldwide', 'personal', 'helperService'];
    function StatisticsCtrl(worldwide, personal, helperService) {
        var vm = this;

        activate();

        vm.setSelected = setSelected;

        function activate() {
            vm.options = {
                dice: helperService.getDiceOptions(),
                scope: helperService.getScopeOptions(),
                type: helperService.getTypeOptions('statistics')
            };

            vm.cells = null;
            vm.other = null;

            vm.worldwide = worldwide;
            vm.personal = personal;

            vm.selected = {
                dice: vm.options.dice[0],
                scope: vm.options.scope[0],
                type: vm.options.type[0]
            };

            onSelectedChanged();
        }

        function onSelectedChanged() {
            if (vm.selected.type.key === 'other') {
                vm.cells = null;
                vm.other = vm[vm.selected.scope.key].other_stats;
            } else {
                vm.other = null;
                vm.cells = vm[vm.selected.scope.key].cells_averages[vm.selected.dice.key];
            }
        }

        function setSelected(key, item) {
            vm.selected[key] = item;
            onSelectedChanged();
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.filters', []);
})();
(function() {
    'use strict';

    angular
        .module('commonServices', [
            'commonServices.auth',
            'commonServices.api'
        ]);
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.services', ['angular-jwt']);
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .factory('calculationService', calculationService);
    
    function calculationService() {
        return {
            getStraightValue: getStraightValue,
            getFullHouseValue: getFullHouseValue,
            getQuadsValue: getQuadsValue,
            getYambValue: getYambValue,
            getMinValue: getMinValue,
            getMaxValue: getMaxValue,
            getOneToSixValue: getOneToSixValue,
            getCalculateSum: getCalculateSum,
            getFinalResult: getFinalResult
        }

        function getStraightValue(rollNumber, diceValues) {
            return isStraight() ? 66 - (rollNumber - 1) * 10 : 0;

            function isStraight() {                
                return [1, 2, 3, 4, 5].every(isAmongDiceValues) || [2, 3, 4, 5, 6].every(isAmongDiceValues);
                
                function isAmongDiceValues(number) {
                    return diceValues.indexOf(number) !== -1;
                }
            }
        }

        function getFullHouseValue(diceValues) {
            var fullHouse = getFullHouse();

            return fullHouse.every(hasValue) ? fullHouse[0] * 3 + fullHouse[1] * 2 + 30 : 0;

            function getFullHouse() {
                var diceCount = getDiceCount();

                return [getFullHouseMember(2), getFullHouseMember(1)];

                function getDiceCount() {
                    var diceCount = {};

                    [1, 2, 3, 4, 5, 6].forEach(initDiceCount);
                    diceValues.forEach(incrementCount);

                    return diceCount;

                    function initDiceCount(value) {
                        diceCount[value] = 0;
                    }

                    function incrementCount(dieValue) {
                        diceCount[dieValue]++;
                    }
                }
                
                function getFullHouseMember(count) {
                    for (var i = 6; i > 0; i--) {
                        if (diceCount[i] > count) {
                            delete diceCount[i];
                            return i;
                        }
                    }
                }
            }
        }

        function getQuadsValue(diceValues) {
            var sorted = diceValues.sort();

            return isQuads() ? 40 + sorted[2] * 4 : 0;

            function isQuads() {
                for (var i = sorted.length - 1; i >= 3; i--) {
                    if (sorted[i] === sorted[i - 3]) return true;
                }
                return false;
            }
        }

        function getYambValue(diceValues) {
            var sorted = diceValues.sort();

            return isYamb() ? 50 + sorted[1] * 5 : 0;

            function isYamb() {
                for (var i = sorted.length - 1; i >= 4; i--) {
                    if (sorted[i] === sorted[i - 4]) return true;
                }
                return false;
            }
        }

        function getMinValue(diceValues) {
            var sorted = diceValues.sort();
            sorted.length = 5;

            return sorted.reduce(sumReduction, 0);
        }

        function getMaxValue(diceValues) {
            var sorted = diceValues.sort().reverse();
            sorted.length = 5;

            return sorted.reduce(sumReduction, 0);
        }

        function getMinMaxValue(diceValues) {
            return diceValues.reduce(sumReduction, 0);
        }

        function getOneToSixValue(cell, diceValues) {
            var count = 0;
            var rowWeight = parseInt(cell.row.abbreviation);

            diceValues.forEach(incrementCountIfValid);

            return (count > 5 ? 5 : count) * rowWeight;

            function incrementCountIfValid(dieValue) {
                if (dieValue === rowWeight) count++;
            }
        }

        function getCalculateSum(rows, cells) {
            return function(cellKey, row, column) {
                switch (row.abbreviation) {
                    case 'usum':
                        var relevantValues = getRelevantValues(6);
                        if (relevantValues.every(hasValue)) {
                            var sum = relevantValues.reduce(sumReduction, 0);
                            cells[cellKey].value = (sum >= 60 ? sum + 30 : sum);
                        } else {
                            cells[cellKey].value = null;
                        }
                        break;
                    case 'msum':
                        var relevantValues = getRelevantValues(2);
                        var onesCellKey = rows[0].abbreviation + '_' + column.abbreviation;
                        if (relevantValues.every(hasValue) && cells[onesCellKey].value !== null) {
                            var difference = relevantValues[1] - relevantValues[0];
                            cells[cellKey].value = (difference < 0 ? 0 : difference * cells[onesCellKey].value);
                        } else {
                            cells[cellKey].value = null;
                        }
                        break;
                    case 'lsum':
                        var relevantValues = getRelevantValues(4);
                        if (relevantValues.every(hasValue)) {
                            cells[cellKey].value = relevantValues.reduce(sumReduction, 0);
                        } else {
                            cells[cellKey].value = null;
                        }
                        break;
                    default:
                }

                function getRelevantValues(numberOfTrailingCells) {
                    var cellKey = null;
                    var relevantValues = [];

                    for (var i = 1; i <= numberOfTrailingCells; i++) {
                        cellKey = rows[row.id - 1 - i].abbreviation + '_' + column.abbreviation;
                        relevantValues.push(cells[cellKey].value);
                    }

                    return relevantValues;
                }
            };
        }

        function getFinalResult(sumsValues) {
            return sumsValues.reduce(sumReduction, 0);
        }

        function hasValue(value) {
            return value !== null && value !== undefined;
        }

        function sumReduction(accumulator, value) {
            return accumulator + value;
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .factory('diceService', diceService);
    
    function diceService() {
        var service = {
            dice: [],
            getDice: getDice,
            getDiceValues: getDiceValues,
            unlockAndDisableDice: unlockAndDisableDice,
            enableDice: enableDice
        };

        return service;

        function getDice() {
            return service.dice;
        }

        function getDiceValues() {
            return service.dice.map(dieValue);

            function dieValue(die) {
                return die.value;
            }
        }

        function unlockAndDisableDice() {
            service.dice.forEach(unlockAndDisableDie);

            function unlockAndDisableDie(die) {
                die.isLocked = false;
                die.isDisabled = true;
            }
        }

        function enableDice() {
            service.dice.forEach(enableDie);

            function enableDie(die) {
                die.isDisabled = false;
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('yamb-v2.filters')
        .filter('formatValue', formatValue);
    
    function formatValue() {
        return function(value, key) {
            switch (key) {
                case 'duration':
                case 'average_duration':
                    if (typeof value !== 'number' || isNaN(value) || value === 0) {
                        return '-';
                    } else {
                        var seconds = Math.floor(value / 1000);
                        var minutes = Math.floor(seconds / 60);
                        return formatTimeValue(minutes) + ':' + formatTimeValue(seconds - minutes * 60);
                    }
                case 'games_played':
                case 'games_unfinished':
                    return value;
                default:
                    return (value ? value : '-');
            }

            function formatTimeValue(value) {
                if (value < 10) {
                    return '0' + value;
                } else {
                    return value;
                }
            }
        };
    }
})();
(function() {
    'use strict';

    angular
        .module('commonServices.api', ['restangular'])
        .factory('ApiRestangular', ApiRestangular)
        .factory('apiService', apiService);
    
    ApiRestangular.$inject = ['Restangular', '$localStorage'];
    function ApiRestangular(Restangular, $localStorage) {
        return Restangular.withConfig(function(RestangularConfigurer) {
            RestangularConfigurer
                .setBaseUrl('api/v1')
                .setDefaultHeaders({
                    Authorization: 'Bearer ' + $localStorage.token
                });
        });
    }
    
    apiService.$inject = ['ApiRestangular'];
    function apiService(ApiRestangular) {
        return {
            get: get,
            create: create,
            custom: custom
        }

        function get(resource, id) {
            if (id) {
                return ApiRestangular.one(resource, id).doGET();
            } else {
                return ApiRestangular.all(resource).doGET();
            }
        }

        function create(resource, data) {
            return ApiRestangular.all(resource).post(data);
        }

        function custom(resource, id, method, route, data, params, headers) {
            var restangularObject = (id ? ApiRestangular.one(resource, id) : ApiRestangular.all(resource));
            return restangularObject.customOperation(method, route, params, headers, data);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('commonServices.auth', ['restangular'])
        .factory('authService', authService);

    authService.$inject = ['Restangular'];
    function authService(Restangular) {
        return {
            register: register,
            login: login
        }

        function register(data) {
            return Restangular.all('register').post(data);
        }

        function login(data) {
            return Restangular.all('login').post(data);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.services')
        .factory('helperService', helperService);
    
    helperService.$inject = [];
    function helperService() {
        return {
            getDiceOptions: getDiceOptions,
            getScopeOptions: getScopeOptions,
            getTypeOptions: getTypeOptions,
            getStatKeys: getStatKeys
        };

        function getDiceOptions() {
            return [5, 6].map(mapDiceOption);

            function mapDiceOption(value) {
                return {
                    key: value + '_dice',
                    label: value + ' Dice',
                    value: value
                };
            }
        }

        function getScopeOptions() {
            return ['Worldwide', 'Personal'].map(mapItem);
        }

        function getTypeOptions(state) {
            return getOptions(state);

            function getOptions(state) {
                if (state === 'statistics') {
                    return ['Value', 'Input Turn', 'Other'].map(mapItem);
                } else if (state === 'leaderboard') {
                    return ['Best', 'Average', 'Played'].map(mapLeaderboardTypeOption);
                } else {
                    return [];
                }
            }

            function mapLeaderboardTypeOption(item) {
                return {
                    key: getKeyLabel(item).toLowerCase().replace(' ', '_'),
                    label: item,
                };

                function getKeyLabel(item) {
                    if (item === 'Played') {
                        return ('Games ' + item)
                    } else {
                        return (item + ' Results')
                    }
                }
            }
        }

        function getStatKeys() {
            var labels = [
                'Last game', 'Best result', 'Average result', 'Average duration', 'Games played', 'Games unfinished'
            ];

            return labels.map(mapStatKey);

            function mapStatKey(label) {
                return {
                    key: getKey(label),
                    label: label
                };

                function getKey(label) {
                    if (label.indexOf('Last') !== -1) {
                        label += '_timestamp';
                    }
                    if (label.indexOf('result') !== -1) {
                        label += 's';
                    }

                    return label.replace(' ', '_').toLowerCase();
                }
            }
        }

        function mapItem(item) {
            return {
                key: item.toLowerCase().replace(' ', '_'),
                label: item
            };
        }
    }
})();
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
                                if (!data.recentGame) {
                                    return apiService.custom('users', data.user.id, 'get', 'best-games');
                                } else {
                                    return null;
                                }
                            },
                            recentGame: function() {
                                if (data.recentGame) {
                                    return data.recentGame;
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
(function() {
    'use strict';

    angular
        .module('yamb-v2.services')
        .factory('userService', userService);
    
    userService.$inject = ['$localStorage', 'jwtHelper', 'apiService', '$rootScope'];
    function userService($localStorage, jwtHelper, apiService, $rootScope) {
        return {
            getUserId: getUserId,
            getUser: getUser
        };

        function getUserId() {
            if ($localStorage.token) {
                var decodedToken = jwtHelper.decodeToken($localStorage.token);
                return parseInt(decodedToken.sub);
            } else {
                return null;
            }
        }

        function getUser() {
            if ($localStorage.token) {
                var decodedToken = jwtHelper.decodeToken($localStorage.token);
                return apiService.get('users', decodedToken.sub);
            } else {
                return null;
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .component('gameInfoModal', {
            templateUrl: 'src/leaderboard/components/gameInfoModal/gameInfoModal.component.html',
            bindings: {
                resolve: '<'
            },
            controller: controller
        });
    
    function controller() {
        var $ctrl = this;

        $ctrl.$onInit = onInit;

        function onInit() {
            $ctrl.user = $ctrl.resolve.user;
            $ctrl.cells = {};

            if ($ctrl.resolve.bestGames) {
                $ctrl.game = $ctrl.resolve.bestGames[$ctrl.resolve.diceKey];
                $ctrl.game.cells.forEach(setCellProperty);
            } else {
                $ctrl.game = $ctrl.resolve.recentGame;
                $ctrl.cells = $ctrl.game.cells;
                $ctrl.isRecentGame = true;
            }
            
            function setCellProperty(cell) {
                $ctrl.cells[cell.cell_key] = {
                    value: cell.value
                };
            }
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.leaderboard')
        .component('userInfoModal', {
            templateUrl: 'src/leaderboard/components/userInfoModal/userInfoModal.component.html',
            bindings: {
                resolve: '<'
            },
            controller: controller
        });
    
    controller.$inject = ['helperService'];
    function controller(helperService) {
        var $ctrl = this;

        $ctrl.$onInit = onInit;
        $ctrl.setSelectedDiceOption = setSelectedDiceOption;

        function onInit() {
            $ctrl.statKeys = helperService.getStatKeys();
            $ctrl.diceOptions = helperService.getDiceOptions();

            $ctrl.user = $ctrl.resolve.user;

            setSelectedDiceOption($ctrl.diceOptions[0]);
        }

        function setSelectedDiceOption(diceOption) {
            $ctrl.selectedDiceOption = diceOption;
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('die', die);
    
    die.$inject = ['diceService'];
    function die(diceService) {
        return {
            link: link,
            templateUrl: 'src/play/directives/die/die.html',
            replace: true,
            scope: true
        };

        function link(scope, elem, attrs) {
            scope.die = {
                isLocked: false,
                isDisabled: false,
                value: getRandomValue()
            };

            diceService.dice[parseInt(attrs.index)] = scope.die;

            scope.toggleDieLock = toggleDieLock;

            scope.$on('roll', rollHandler);

            function getRandomValue() {
                return Math.round(Math.random() * 5 + 1);
            }

            function toggleDieLock() {
                scope.die.isLocked = !scope.die.isLocked;
            }

            function rollHandler() {
                if (!scope.die.isLocked) {
                    scope.die.value = getRandomValue();
                }

                if (scope.play.rollNumber === 3) {
                    scope.die.isLocked = false;
                    scope.die.isDisabled = true;
                }

                if (scope.play.rollNumber === 1) {
                    scope.die.isDisabled = false;
                }
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('paperPlay', paperPlay);
    
    paperPlay.$inject = ['diceService', 'calculationService', '$rootScope'];
    function paperPlay(diceService, calculationService, $rootScope) {
        return {
            link: link,
            templateUrl: 'src/play/directives/paperPlay/paperPlay.html',
            replace: true,
            scope: true
        };

        function link(scope) {
            var rows = $rootScope.rows;
            var columns = $rootScope.columns;
            var playableRows = rows.filter(isPlayable);
            var sumRows = rows.filter(isSum);
            var turnNumber = 0;
            var announcedCellKey = null;
            var savedState = null;

            scope.cellClicked = cellClicked;

            scope.$on('roll', updateAvailableCells);

            scope.$on('undo', handleUndo);

            initCells();

            /**
             * Initializes all cells.
             */
            function initCells() {
                scope.cells = {};

                iterateCells(initCell);

                /**
                 * Initializes a single cell.
                 * @param {string} cellKey - The cell's key.
                 * @param {object} row - The row of a cell.
                 * @param {object} column - The column of a cell.
                 */
                function initCell(cellKey, row, column) {
                    scope.cells[cellKey] = {
                        row: row,
                        column: column,
                        isPlayable: isPlayable(row),
                        isAvailable: false,
                        value: null,
                        inputTurn: null
                    };
                }
            }

            function cellClicked(cellKey) {
                var cell = scope.cells[cellKey];

                updateSavedState(cellKey);

                if (cell.isAvailable) {
                    if (cell.column.abbreviation === 'ann' && !announcedCellKey) {
                        resetCellsAvailability();
                        announcedCellKey = cellKey;
                        scope.play.setIsAnnouncementRequired(false);
                        cell.isAvailable = true;
                    } else {
                        cell.value = getCalculatedCellValue();
                        cell.inputTurn = ++turnNumber;

                        announcedCellKey = null;
                        resetCellsAvailability();
                        scope.play.setRollNumber(0);
                        scope.play.setIsInputRequired(false);
                        diceService.unlockAndDisableDice();

                        calculateSums();
                        calculateFinalResult();
                    }

                    scope.play.setIsUndoDisabled(false);
                }

                function getCalculatedCellValue() {
                    var diceValues = diceService.getDiceValues();

                    switch (cell.row.abbreviation) {
                        case 'str':
                            return calculationService.getStraightValue(scope.play.rollNumber, diceValues);
                        case 'full':
                            return calculationService.getFullHouseValue(diceValues);
                        case 'quad':
                            return calculationService.getQuadsValue(diceValues);
                        case 'yamb':
                            return calculationService.getYambValue(diceValues);
                        case 'min':
                            return calculationService.getMinValue(diceValues);
                        case 'max':
                            return calculationService.getMaxValue(diceValues);
                        default:
                            return calculationService.getOneToSixValue(cell, diceValues);
                    }
                }

                function calculateFinalResult() {
                    var sumsValues = getSumsValues();

                    if (sumsValues.every(hasValue)) {
                        scope.finalResult = calculationService.getFinalResult(sumsValues);
                        scope.play.handleFinishedGame(scope.cells, scope.finalResult);
                    }

                    function getSumsValues() {
                        var sumsValues = [];

                        iterateCells(pushSumValue, 'sum');

                        return sumsValues;

                        function pushSumValue(cellKey) {
                            sumsValues.push(scope.cells[cellKey].value);
                        }
                    }
                }
            }

            function updateAvailableCells() {
                resetCellsAvailability();

                getAvailableCellsKeys().forEach(setCellToAvailable);

                if (isAnnouncementColumnTheOnlyOneLeft() && !announcedCellKey) {
                    scope.play.setIsAnnouncementRequired(true);
                } else {
                    scope.play.setIsAnnouncementRequired(false);
                }
                
                function getAvailableCellsKeys() {
                    var availableCellsKeys = [];

                    if (!announcedCellKey) {
                        iterateCells(checkAndPushAvailableCellKey, 'playable');
                    } else {
                        availableCellsKeys.push(announcedCellKey);
                    }

                    return availableCellsKeys;

                    function checkAndPushAvailableCellKey(cellKey, row, column, rowIndex, columnIndex) {
                        if (!isCellEmpty(cellKey)) return;

                        switch (column.abbreviation) {
                            case 'dwn':
                                if (row.abbreviation === '1') {
                                    availableCellsKeys.push(cellKey);
                                } else {
                                    var previousPlayableCellKey = getPlayableCellKey(rowIndex - 1, columnIndex);
                                    if (!isCellEmpty(previousPlayableCellKey)) {
                                        availableCellsKeys.push(cellKey);
                                    }
                                }
                                return;
                            case 'any':
                                availableCellsKeys.push(cellKey);
                                return;
                            case 'up':
                                if (row.abbreviation === 'yamb') {
                                    availableCellsKeys.push(cellKey);
                                } else {
                                    var nextPlayableCellKey = getPlayableCellKey(rowIndex + 1, columnIndex);
                                    if (!isCellEmpty(nextPlayableCellKey)) {
                                        availableCellsKeys.push(cellKey);
                                    }
                                }
                                return;
                            case 'ann':
                                if (scope.play.rollNumber === 1) {
                                    availableCellsKeys.push(cellKey);
                                    return;
                                }
                            default:
                                return;
                        }

                        function isCellEmpty(cellKey) {
                            return (scope.cells[cellKey].value === null);
                        }

                        function getPlayableCellKey(rowIndex, columnIndex) {
                            return playableRows[rowIndex].abbreviation + '_' + columns[columnIndex].abbreviation;
                        }
                    }
                }

                function setCellToAvailable(cellKey) {
                    scope.cells[cellKey].isAvailable = true;
                }

                function isAnnouncementColumnTheOnlyOneLeft() {
                    var cellKey = null;

                    for (var i = 0; i < sumRows.length; i++) {
                        for (var j = 0; j < columns.length; j++) {
                            cellKey = sumRows[i].abbreviation + '_' + columns[j].abbreviation;
                            if (columns[j].abbreviation !== 'ann' && scope.cells[cellKey].value === null) {
                                return false;
                            }
                        }
                    }

                    return true;
                }
            }

            /**
             * Iterates through all sum cells and sets their value.
             */
            function calculateSums() {
                iterateCells(calculationService.getCalculateSum(rows, scope.cells), 'sum');
            }

            /**
             * Reverts back to paper's previous state.
             */
            function handleUndo() {
                scope.play.setIsUndoDisabled(true);
                scope.cells[savedState.cellKey] = savedState.cell;

                if (!announcedCellKey) {
                    turnNumber--;
                    scope.play.setRollNumber(savedState.rollNumber);
                    scope.play.setIsInputRequired(savedState.isInputRequired);
                    diceService.enableDice();
                    calculateSums();
                }

                announcedCellKey = savedState.announcedCellKey;
                updateAvailableCells();
            }

            /**
             * Updates savedState object with latest values.
             * @param {string} cellKey - The last clicked cell's key.
             */
            function updateSavedState(cellKey) {
                savedState = {
                    cellKey: cellKey,
                    cell: angular.copy(scope.cells[cellKey]),
                    announcedCellKey: angular.copy(announcedCellKey),
                    rollNumber: angular.copy(scope.play.rollNumber),
                    isInputRequired: angular.copy(scope.play.isInputRequired)
                };
            }

            /**
             * Makes all playable cells unavailable.
             */
            function resetCellsAvailability() {
                iterateCells(resetCellAvailability, 'playable');

                /**
                 * Makes a single cell unavailable.
                 * @param {string} cellKey - The cell's key.
                 */
                function resetCellAvailability(cellKey) {
                    scope.cells[cellKey].isAvailable = false;
                }
            }

            /**
             * Iterates through cells and calls a function for each cell.
             * @callback iteratorCallback
             * @param {string} cellKey - The cell's key.
             * @param {object} row - Iteration's current row.
             * @param {object} column - Iteration's current column.
             * @param {number} rowIndex - Iteration's current row's index.
             * @param {number} columnIndex - Iteration's current column's index.
             */

            /**
             * Iterates through rows and columns and calls a function for each instance.
             * @param {iteratorCallback} callbackFunction - Function called for each iteration instance.
             * @param {string} filterRows - A string defining which rows should be iterated.
             */
            function iterateCells(callbackFunction, filterRows) {
                var rowsToIterate = rows;
                if (filterRows === 'playable') rowsToIterate = playableRows;
                if (filterRows === 'sum') rowsToIterate = sumRows;

                rowsToIterate.forEach(function(row, rowIndex) {
                    columns.forEach(function(column, columnIndex) {
                        var cellKey = row.abbreviation + '_' + column.abbreviation;
                        callbackFunction(cellKey, row, column, rowIndex, columnIndex);
                    });
                });     
            }

            /**
             * Returns true if row is playable, otherwise false.
             * @param {object} row - The row that is evaluated.
             * @return {boolean}
             */
            function isPlayable(row) {
                return row.abbreviation.indexOf('sum') === -1;
            }

            /**
             * Returns true if row is a sum row, otherwise false.
             * @param {object} row - The row that is evaluated.
             * @return {boolean}
             */
            function isSum(row) {
                return row.abbreviation.indexOf('sum') !== -1;
            }

            /**
             * Returns true if value is defined and not null, otherwise false.
             * @param {int} value - The value that is evaluated.
             * @return {boolean}
             */
            function hasValue(value) {
                return value !== null && value !== undefined;
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .directive('timer', timer);
    
    timer.$inject = ['$interval'];
    function timer($interval) {
        return {
            link: link,
            templateUrl: 'src/play/directives/timer/timer.html',
            replace: true,
            scope: false
        };

        function link(scope, elem, attrs) {
            var startTime, timerInterval, timeDiff, days, hours, minutes, seconds, miliseconds;

            scope.timer = {
                value: 0,
                display: "00:00"
            };

            scope.$on('start', start);
            scope.$on('stop', stop);

            elem.on('$destroy', onDestroy);

            function start() {
                startTime = Date.now();
                timerInterval = $interval(updateTimer, 1);
            }

            function stop() {
                $interval.cancel(timerInterval);
            }

            function onDestroy() {
                if (timerInterval) stop();
            }

            function updateTimer() {
                timeDiff = Date.now() - startTime;
                days = Math.floor(timeDiff / 1000 / 60 / 60 / 24);
                hours = Math.floor((timeDiff - days * 24 * 60 * 60 * 1000) / 1000 / 60 / 60);
                minutes = Math.floor((timeDiff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000) / 1000 / 60);
                seconds = Math.floor((timeDiff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000) / 1000);
                miliseconds = timeDiff - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000;

                scope.timer.value = timeDiff;
                scope.timer.display = formatTimerValue(minutes) + ":" + formatTimerValue(seconds);

                function formatTimerValue(value) {
                    return (value < 10 ? "0" + value : value);
                }
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('yamb-v2.statistics')
        .directive('paperStatic', paperStatic);
    
    paperStatic.$inject = ['$rootScope'];
    function paperStatic($rootScope) {
        return {
            link: link,
            templateUrl: 'src/statistics/directives/paperStatic/paperStatic.html',
            replace: true,
            scope: {
                cells: '=',
                key: '='
            }
        };

        function link(scope) {
            scope.rows = $rootScope.rows;
            scope.columns = $rootScope.columns;
            
            scope.isPlayable = isPlayable;

            function isPlayable(row) {
                return row.abbreviation.indexOf('sum') === -1;
            }
        }
    }
})();
