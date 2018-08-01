var appRoutes = angular.module('AppRoutes', ["ngRoute"])

appRoutes.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix('!');
    $routeProvider
        .otherwise({
            redirectTo: '/select_pay_route'
        })
        .when('/select_pay_route', {
            templateUrl: '/app/select_pay_route/select_pay_route.html',
            controller: 'selectPayRouteViewCtrl'
        })
        .when('/QR_CODE_CONLLECTION', {
            templateUrl: '/app/create_qr_code/create_qr_code.html',
            controller: 'CreateQRCode'
        })
        .when("/MOBILE_COMPOSITE_PAY", {
            templateUrl: "/app/company_white_bar/company_white_bar.html",
            controller: "CompanyBar"
        })
        .when('/signin_result', {
            templateUrl: '/app/signin_result/signin_result.html',
            controller: 'signinResult'
        })
        .when('/company_payment', {
            templateUrl: '/app/company_payment/company_payment.html',
            controller: 'CompanyPayment'
        })
        .when('/create_order', {
            templateUrl: '/app/create_order/create_order.html',
            controller: 'createOrder'
        })
}])
