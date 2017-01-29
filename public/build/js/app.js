(function() {
    'use strict';

    angular
        .module('yamb-v2', [
            'ui.router',
            'services',
            'yamb-v2.home',
            'yamb-v2.register',
            'yamb-v2.login',
            'yamb-v2.users',
            'yamb-v2.play'
        ])
        .config(config)
        .run(run);

    config.$inject = ['$stateProvider', '$locationProvider']
    function config($stateProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'src/home/home.html',
                controller: 'HomeCtrl as home'
            })
            .state('register', {
                url: '/register',
                templateUrl: 'src/register/register.html',
                controller: 'RegisterCtrl as register'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'src/login/login.html',
                controller: 'LoginCtrl as login'
            })
            .state('users', {
                url: '/users',
                templateUrl: 'src/users/users.html',
                controller: 'UsersCtrl as users',
                resolve: {
                    users: function(api) {
                        return api.get('users');
                    }
                }
            })
            .state('play', {
                url: '/play',
                templateUrl: 'src/play/play.html',
                controller: 'PlayCtrl as play',
                resolve: {
                    columns: function(api) {
                        return api.get('columns');
                    },
                    rows: function(api) {
                        return api.get('rows');
                    }
                }
            });
        
        $locationProvider.html5Mode(true);
    }

    run.$inject = ['$state'];
    function run($state) {
        $state.go('register');
    }
})();
(function() {
    'use strict';

    angular
        .module('yamb-v2.home', [])
        .controller('HomeCtrl', HomeCtrl);

    HomeCtrl.$inject = [];
    function HomeCtrl() {
        var vm = this;

        vm.states = [
            {
                name: 'login',
                label: 'Login'
            },
            {
                name: 'register',
                label: 'Register'
            },
            {
                name: 'play',
                label: 'Play'
            },
            {
                name: 'users',
                label: 'Users'
            }
        ];
    }
})();
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
(function() {
    'use strict';

    angular
        .module('yamb-v2.play', [])
        .controller('PlayCtrl', PlayCtrl);

    PlayCtrl.$inject = ['columns', 'rows', '$interval', '$scope'];
    function PlayCtrl(columns, rows, $interval, $scope) {
        var vm = this;

        activate();

        vm.start = start;
        vm.roll = roll;
        vm.resetRollNumber = resetRollNumber;
        vm.setIsInputRequired = setIsInputRequired;
        vm.saveGame = saveGame;

        function activate() {
            vm.columns = columns.plain();
            vm.rows = rows.plain();
            vm.hasGameStarted = false;
            vm.rollNumber = 0;
            vm.isInputRequired = false;
            vm.isFinished = false;
        }

        function start() {
            vm.hasGameStarted = true;
            $scope.$broadcast('start');
            roll();
        }
        
        function roll() {
            incrementRollNumber();
            $scope.$broadcast('roll');

            if (vm.rollNumber === 3) {
                vm.isInputRequired = true;
            }
        }

        function incrementRollNumber() {
            ++vm.rollNumber;
        }

        function resetRollNumber() {
            vm.rollNumber = 0;
        }

        function setIsInputRequired(value) {
            vm.isInputRequired = value;
        }

        function saveGame(cells, finalResult) {
            vm.isFinished = true;
            console.log(cells, finalResult, $scope.timer);
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('yamb-v2.register', [])
        .controller('RegisterCtrl', RegisterCtrl);
    
    RegisterCtrl.$inject = ['auth', '$state'];
    function RegisterCtrl(auth, $state) {
        var vm = this;

        activate();

        function activate() {
            vm.title = "Register";
            
            vm.confirm = confirm;
        }

        function confirm() {
            auth.register(vm.input).then(function(success) {
                console.log("Success", success);
                $state.go('login');
            }, function(error) {
                console.log("Error", error);
            });
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('services', [
            'services.auth',
            'services.api'
        ]);
})();
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
(function() {
    'use strict';

    angular
        .module('yamb-v2.play')
        .factory('diceService', diceService);
    
    function diceService() {
        var service = {
            dice: {},
            getDice: getDice,
            getDiceValues: getDiceValues,
            unlockAndDisableDice: unlockAndDisableDice
        }

        return service;

        function getDice() {
            return service.dice;
        }

        function getDiceValues() {
            var diceValues = [];

            for (var i in service.dice) {
                diceValues.push(service.dice[i].value);
            }

            return diceValues;
        }

        function unlockAndDisableDice() {
            for (var i in service.dice) {
                service.dice[i].isLocked = false;
                service.dice[i].isDisabled = true;
            }
        }
    }
})();

(function() {
    'use strict';

    angular
        .module('services.api', ['restangular', 'ngStorage'])
        .factory('ApiRestangular', ApiRestangular)
        .factory('api', api);
    
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
    
    api.$inject = ['ApiRestangular'];
    function api(ApiRestangular) {
        return {
            get: get,
            create: create
        }

        function get(resource, id) {
            if (id) {
                return ApiRestangular.one(resource, id).get();
            } else {
                return ApiRestangular.all(resource).getList();
            }
        }

        function create(resource, data) {
            return ApiRestangular.all(resource).post(data);
        }
    }
})();
(function() {
    'use strict';

    angular
        .module('services.auth', ['restangular'])
        .factory('auth', auth);

    auth.$inject = ['Restangular'];
    function auth(Restangular) {
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
                isDisabled: true,
                value: getRandomValue()
            };

            diceService.dice[attrs.i] = scope.die;

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
        .directive('paper', paper);
    
    paper.$inject = ['diceService'];
    function paper(diceService) {
        return {
            link: link,
            templateUrl: 'src/play/directives/paper/paper.html',
            replace: true,
            scope: true
        };

        function link(scope, elem, attrs) {
            var rows = scope.play.rows;
            var columns = scope.play.columns;
            var playableRows = rows.filter(isPlayable);
            var sumRows = rows.filter(isSum);

            scope.cellClicked = cellClicked;

            scope.$on('roll', updateAvailableCells);

            initCells();

            function initCells() {
                scope.cells = {};
                iterateCells(initCell);

                function initCell(cellKey, row, column) {
                    scope.cells[cellKey] = {
                        rowAbbreviation: row.abbreviation,
                        columnAbbreviation: column.abbreviation,
                        isPlayable: isPlayable(row),
                        isAvailable: false,
                        value: null
                    };
                }
            }

            function cellClicked(cellKey) {
                var cell = scope.cells[cellKey];

                if (cell.isAvailable) {
                    cell.value = getCalculatedCellValue();

                    resetCellsAvailability();
                    scope.play.resetRollNumber();
                    scope.play.setIsInputRequired(false);
                    diceService.unlockAndDisableDice();

                    calculateSums();
                    calculateFinalResult();
                }

                function getCalculatedCellValue() {
                    var diceValues = diceService.getDiceValues();

                    switch (cell.rowAbbreviation) {
                        case 'str':
                            return getStraightValue();
                        case 'full':
                            return getFullHouseValue();
                        case 'quad':
                            return getQuadsValue();
                        case 'yamb':
                            return getYambValue();
                        case 'min':
                        case 'max':
                            return diceValues.reduce(sumReduction, 0);
                        default:
                            return diceValues.reduce(oneToSixReduction, 0);
                    }

                    function getStraightValue() {
                        return isStraight() ? 66 - (scope.play.rollNumber - 1) * 10 : 0;

                        function isStraight() {
                            var sortedString = diceValues.sort().join('');
                            return (sortedString.indexOf('12345') !== -1 || sortedString.indexOf('23456') !== -1);
                        }
                    }

                    function getFullHouseValue() {
                        return isFullHouse() ? diceValues.reduce(sumReduction, 30) : 0;

                        function isFullHouse() {
                            var sorted = diceValues.sort();
                            return (sorted[0] === sorted[1] && sorted[2] === sorted[4]) ||
                                (sorted[0] === sorted[2] && sorted[3] === sorted[4]);
                        }
                    }

                    function getQuadsValue() {
                        var sorted = diceValues.sort();

                        return isQuads() ? 40 + sorted[1] * 4 : 0;

                        function isQuads() {
                            return sorted[0] === sorted[3] || sorted[1] === sorted[4];
                        }
                    }

                    function getYambValue() {
                        return isYamb() ? 50 + diceValues[0] * 5 : 0;

                        function isYamb() {
                            for (var i = 1; i < diceValues.length; i++) {
                                if (diceValues[i] !== diceValues[i - 1]) {
                                    return false;
                                }
                            }
                            return true;
                        }
                    }

                    function oneToSixReduction(accumulator, value) {
                        var rowWeight = parseInt(cell.rowAbbreviation);
                        return accumulator + (value === rowWeight ? rowWeight : 0);
                    }
                }

                function calculateSums() {
                    iterateCells(calculateSum, 'sum');

                    function calculateSum(cellKey, row, column, rowIndex, columnIndex) {
                        switch (row.abbreviation) {
                            case 'usum':
                                var relevantValues = getRelevantValues(6);
                                if (relevantValues.every(hasValue)) {
                                    var sum = relevantValues.reduce(sumReduction, 0);
                                    scope.cells[cellKey].value = (sum >= 60 ? sum + 30 : sum);
                                }
                                break;
                            case 'msum':
                                var relevantValues = getRelevantValues(2);
                                if (relevantValues.every(hasValue)) {
                                    var difference = relevantValues[1] - relevantValues[0];
                                    var onesCellKey = rows[0].abbreviation + '_' + column.abbreviation;
                                    scope.cells[cellKey].value = (difference < 0 ? 0 : difference * scope.cells[onesCellKey].value);
                                }
                                break;
                            case 'lsum':
                                var relevantValues = getRelevantValues(4);
                                if (relevantValues.every(hasValue)) {
                                    scope.cells[cellKey].value = relevantValues.reduce(sumReduction, 0);
                                }
                                break;
                            default:
                        }

                        function getRelevantValues(numberOfTrailingCells) {
                            var cellKey = null;
                            var relevantValues = [];

                            for (var i = 1; i <= numberOfTrailingCells; i++) {
                                cellKey = rows[rowIndex - i].abbreviation + '_' + column.abbreviation;
                                relevantValues.push(scope.cells[cellKey].value);
                            }

                            return relevantValues;
                        }
                    }
                }

                function calculateFinalResult() {
                    var sumsValues = getSumsValues();

                    if (sumsValues.every(hasValue)) {
                        scope.finalResult = sumsValues.reduce(sumReduction, 0);
                        scope.play.saveGame(scope.cells, scope.finalResult);
                    }

                    function getSumsValues() {
                        var sumsValues = [];

                        iterateCells(pushSumValue);

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
                
                function getAvailableCellsKeys() {
                    var availableCellsKeys = [];

                    iterateCells(checkAndPushAvailableCellKey, 'playable');

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
            }

            function resetCellsAvailability() {
                iterateCells(resetCellAvailability, 'playable');

                function resetCellAvailability(cellKey) {
                    scope.cells[cellKey].isAvailable = false;
                }
            }

            function iterateCells(callbackFunction, filterRows) {
                var rowsToIterate = rows;
                if (filterRows === 'playable') rowsToIterate = playableRows;
                if (filterRows === 'sum') rowsToIterate = sumRows;

                rowsToIterate.forEach(function(row) {
                    columns.forEach(function(column) {
                        var cellKey = row.abbreviation + '_' + column.abbreviation;
                        // Create Row and Column models, so that casts can be applied
                        callbackFunction(cellKey, row, column, rowIndex, columnIndex);
                    });
                });     
            }

            function isPlayable(row) {
                return row.abbreviation.indexOf('sum') === -1;
            }

            function isSum(row) {
                return row.abbreviation.indexOf('sum') !== -1;
            }

            function sumReduction(accumulator, value) {
                return accumulator + value;
            }

            function hasValue(value) {
                return value !== null;
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
