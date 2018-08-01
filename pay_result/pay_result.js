/**
 * Created by silence on 16/11/9.
 */
'use strict';

angular.module('myApp.pay_result', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/pay_result', {
            templateUrl: 'pay_result/pay_result.html',
            controller: 'PayResult'
        });
    }])
    .controller('PayResult', function($scope, $http, $rootScope, $routeParams, $sce) {

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '支付结果';

        $scope.payResult = $rootScope.payResult;

        if(!$scope.payResult) {
            $http.post( "/payment_plugin/mobile/orderInfo.do")
                .success(function (data, status, headers, config) {
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
                    $scope.payResult = payResult;
                    showResult();
                } else {
                    $rootScope.alertBox.show('提示',data.ERRORMSG,0);
                }
            }).error(function (data, status, headers, config) {
                $rootScope.alertBox.show('提  示','网络异常,请稍后重试.',0);
                console.log(data);
            });

        } else {
            showResult();
        }


        function showResult(){

            if($scope.payResult.orderModel.orderStatus == '1')
            {
                $scope.imgPath = 'success';
                $scope.desc = '交易成功';
            }
            else if($scope.payResult.orderModel.orderStatus == '-1')
            {
                $scope.imgPath = 'processing';
                $scope.desc = '交易处理中,请稍后查询订单状态';
            }
            else if($scope.payResult.orderModel.orderStatus == '0')
            {
                $scope.imgPath = 'fail';
                $scope.desc = '交易失败';
            } else {
                $scope.imgPath = 'fail';
                $scope.desc = '未支付';
            }
            // $scope.merchantName = $scope.payResult.acctName;
            $scope.productName = $routeParams.product;
            // $scope.amount = $scope.payResult.orderModel.orderAmount;
            // $scope.orderNo = $scope.payResult.transSeq; $sce.trustAsResourceUrl('/users/' + user.id);

            var url = $scope.payResult.orderModel.synnoticeurl || $scope.payResult.orderModel.synurl;

            $scope.synUrl = $sce.trustAsResourceUrl(url);

            var signStr = $scope.payResult.signStr || $scope.payResult.orderModel.signStr;
            $scope.signStr = signStr;

            var transTime = $scope.payResult.orderModel.modifyTimeStr || $scope.payResult.orderModel.transTime;
            $scope.transTime = transTime;
        }



    });