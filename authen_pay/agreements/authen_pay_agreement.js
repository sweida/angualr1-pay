'use strict';

angular.module('myApp.authen_pay.authen_pay_agreement', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/authen_pay/authen_pay_agreement', {
            templateUrl: '/app/authen_pay/agreements/authen_pay_agreement.html',
            controller: 'AuthenPayAgreement'
        });
    }])

    .controller('AuthenPayAgreement', function($scope, $rootScope) {

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '认证支付';
    });