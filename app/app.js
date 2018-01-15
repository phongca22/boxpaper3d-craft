(function () {
    'use strict';

    angular.module(APP_CONF.module, ['ui.router',
            'oc.lazyLoad',
            'ngMaterial',
            'ngAnimate',
            'ngAria',
            'ngSanitize',
            'ngMessages',
            'angular-toasty',
            'LocalStorageModule',
            'http-auth-interceptor',
            'angular-loading-bar',
            'mdColorPicker'
        ])
        .config(configToasty)
        .config(configTheme)
        .config(configLocalStorage)
        .config(httpConfig)
        .config(loadingBar)
        .run(runApp);

    function loadingBar(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }

    function httpConfig($httpProvider) {
        // $httpProvider.interceptors.push('authInterceptor');
    }

    function configLocalStorage(localStorageServiceProvider) {
        localStorageServiceProvider
        .setPrefix(APP_CONF.module)
        .setNotify(true, true);
    }

    function configTheme($mdThemingProvider, $provide) {
        APP_CONF.theme = "default";

        $mdThemingProvider.theme(APP_CONF.theme)
            .primaryPalette(APP_CONF.primaryPalette)
            .accentPalette(APP_CONF.accentPalette);

        $provide.value('themeProvider', $mdThemingProvider);
    }

    function configToasty(toastyConfigProvider) {
        toastyConfigProvider.setConfig({
            timeout: 4000,
            theme: "material"
        });
    }

    function runApp($rootScope, ThemeService, toasty,
        $mdPanel) {
        // stateHandler.initialize();
        // httpHandler.initialize();
        AlertUtil.config(toasty);
        PanelUtil.config($mdPanel);

        $rootScope.getImageResource = getImageResource;
    }
})();
