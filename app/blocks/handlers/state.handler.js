(function() {
    'use strict';

    angular
        .module(APP_CONF.module)
        .config(stateManagement);
        // .factory('stateHandler', stateSecurity);

    // stateSecurity.$inject = ['$transitions', '$rootScope', 'AuthService',
    //     '$q', 'localStorageService', '$state'];
    //
    // function stateSecurity ($transitions, $rootScope, AuthService,
    //     $q, localStorageService, $state) {
    //     var service = {
    //         initialize: initialize
    //     };
    //
    //     function initialize() {
    //         $transitions.onSuccess({}, function ($transitions) {
    //             $rootScope.$emit("transition.onSuccess", $transitions.$to());
    //         });
    //
    //         $transitions.onStart({}, function ($transitions) {
    //             var from = $transitions.$from();
    //             var to = $transitions.$to();
    //             var token = localStorageService.get(APP_CONF.token);
    //             if (!AuthService.isVerified) {
    //                 AuthService.isVerified = true;
    //                 var defer = $q.defer();
    //                 AuthService.redirect = to;
    //                 AuthService.verifyToken(function(){
    //                     if (AuthService.redirect && AuthService.redirect.name == APP_STATE.LOGIN._id) {
    //                         $state.go(APP_CONF.home);
    //                     } else {
    //                         defer.resolve();
    //                     }
    //                 }, function(){
    //                 });
    //
    //                 return defer.promise;
    //             } else {
    //                 var defer = $q.defer();
    //                 if (AuthService.isAuthenticated && to.name == APP_STATE.LOGIN._id) {
    //                     return defer.promise;
    //                 } else if (!AuthService.isAuthenticated && from.name && to.name != APP_STATE.LOGIN._id) {
    //                     return defer.promise;
    //                 }
    //             }
    //         });
    //     }
    //
    //     return service;
    // }

    stateManagement.$inject = ['$stateProvider', '$urlRouterProvider'];
    function stateManagement($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state(APP_STATE.prefix, {
                url: "/" + APP_STATE.prefix,
                views: {
                    'main': {
                        templateUrl: getResourceUrl("main/main.html")
                    }
                },
                resolve: {
                    loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'controller',
                            files: [getResourceUrl("main/main-controller.js")]
                        });

                    }]
                }
            })
            .state(APP_STATE.COLLABORATION.getState(), {
                url: "/" + APP_STATE.COLLABORATION.id,
                views: {
                    'content': {
                        templateUrl: getResourceUrl("component/user/collaboration/collaboration.html")
                    }
                },
                resolve: {
                    loadMyService: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            name: 'controller',
                            files: [getResourceUrl("component/user/collaboration/collaboration.controller.js")]
                        });
                    }]
                }
            });

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get("$state");
            $state.go(APP_CONF.home);
        });
    }
})();
