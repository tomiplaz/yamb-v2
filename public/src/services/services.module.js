(function() {
    'use strict';

    angular
        .module('services', [
            'services.auth',
            'services.api',
            'services.user',
            'services.helper'
        ]);
})();