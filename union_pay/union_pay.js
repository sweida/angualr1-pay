'use strict';

angular.module('myApp.union_pay', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/MOBILE_UNION_PAY', {
        templateUrl: '/app/union_pay/union_pay.html',
        controller: 'UnionPay'
      });
    }])
    .controller('UnionPay', function($scope, $http, $rootScope, $location) {

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '银联支付';

        $scope.submitResult = false;
        $http({
            method: 'post',
            params: {},
            url: "/payment_plugin/mobile/unionWapPay.do"
        }).success(function (data, status, headers, config) {
            if(data && data.SUCCESS == '1') {
                $scope.submitResult = true;
                $scope.UNIQUEID = data.UNIQUEID;
                var jsonDate = angular.fromJson(data.JSONDATA);
                var tempForm = document.createElement("form");
                document.body.appendChild(tempForm);
                tempForm.action = data.BANKURL;
                tempForm.method = "post";
                for(var key in jsonDate){
                    var i = document.createElement("input");
                    i.type = "hidden";
                    i.name = key;
                    i.value = jsonDate[key];
                    tempForm.appendChild(i);
                }
                tempForm.submit();
            } else {
                $rootScope.alertBox.show('提  示', data.errorMsg || data.ERRORMSG, -1);
            }
        }).error(function (data, status, headers, config) {
            $rootScope.alertBox.show('提  示', '网络异常,请稍后重试.', -1);
        });

        $scope.viewResult = function (id) {
            $http.post( "/payment_plugin/mobile/orderInfo.do", {uniqueId : id}
            ).success(function (data, status, headers, config) {
                if(data && data.orderModel){
                    var payResult = {};
                    payResult.orderModel = data.orderModel;
                    payResult.acctName = data.orderModel.merchantName;
                    $scope.productName = "";
                    try {
                        var prodInfoDic = payResult.orderModel.productInfo;
                        if(prodInfoDic) {
                            prodInfoDic = angular.fromJson(prodInfoDic.replace(/&quot;/g,'"'));
                            payResult.productName = prodInfoDic.prodName;
                        }
                    } catch (e) {

                    }
                    $rootScope.payResult = payResult;
                    $location.path('/pay_result');
                } else {
                    $rootScope.alertBox.show('提  示', data.errorMsg?data.errorMsg:data.ERRORMSG, 0);
                }
            }).error(function (data, status, headers, config) {
                $rootScope.alertBox.show('提  示', '网络异常,请稍后重试.', 0);
            });
        }


    });