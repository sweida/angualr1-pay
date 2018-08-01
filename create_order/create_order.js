'use strict';

angular.module('myApp.create_order', ['ngRoute'])
    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/create_order', {
            templateUrl:'/app/create_order/create_order.html',
            controller:'createOrder'
        });
    }])
    .controller('createOrder', function ($scope, $interval, $location, $rootScope, $http, $timeout) {
        $rootScope.navigationBar.title = '签署借款合同';
        $scope.bgImgUrl = '/app/img/MOBILE_COMPOSITE_PAY.png'
        $scope.loading = true
        $scope.persent = '1%'
        $scope.barObj = {
            'width': '1%'
        }
        $interval(function() {
            let num = Math.floor(Math.random()*4)
            if (parseInt($scope.barObj.width) > 90) {
                return false
            }
            $scope.barObj.width = parseInt($scope.barObj.width) + num + "%"
            $scope.persent = parseInt($scope.barObj.width) + "%"
        }, 500)

        $timeout(function () {          
            // 这里请求
            $http.get("http://www.runoob.com/try/angularjs/data/sites.php").then(function (response) {
                // $scope.names = response.data.sites;
                $scope.barObj.width = '100%'
                $scope.persent = '100%'
                $scope.loading = false
            })
            // $http.get('http://192.168.4.31:889/users').success(function(data){
            //     console.log(data)
            //     $scope.barObj.width = '100%'
            //     $scope.persent = '100%'
            //     $scope.loading = false
            //     // persentage.textContent = '100%'
            // }).error(function(data){
            //     console.log('error:' + data);
            //     $rootScope.alertBox.show('提  示', '网络异常,请稍后重试...', 0);
            // })
        }, 5000)


    })

 