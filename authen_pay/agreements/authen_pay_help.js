'use strict';

angular.module('myApp.authen_pay.authen_pay_help', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/authen_pay/authen_pay_help', {
            templateUrl: '/app/authen_pay/agreements/authen_pay_help.html',
            controller: 'AuthenPayHelp'
        });
    }])

    .controller('AuthenPayHelp', function($scope, $rootScope) {

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '认证支付';

    });