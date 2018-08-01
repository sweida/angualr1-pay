'use strict';

angular.module('myApp.signin_result', ['ngRoute'])
    .controller('signinResult', function($scope, $http, $rootScope, $location){

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '翼支付收银台';

        $scope.availableMoney = 12000
        $scope.payMoney = 8000
 
        // $scope.canvasImg = function(){
        //     canvasImg();
        // };

        $scope.confirmToPay = function(){
            $location.path('/company_payment');
        }


        // //获取订单信息
        // reSetQRCode();

        // //查询支付结果
        // $scope.queryQROrderResult = function(){
        //     $location.path("pay_result");
        // };

        // // 重新获取二维码
        // $scope.reSetQRCode = function(){
        //     reSetQRCode();
        // };
        

        // function reSetQRCode(){
        //     $http.post('/payment_plugin/mobile/payQRData.do', {}).success(function(result){
        //         if(result && 'BP0000000' === result.errorCode){
        //             var prodInfo = result.productInfo.replace(/&quot;/g, '"');
        //             var prodInfoDic;
        //             try{
        //                 prodInfoDic = angular.fromJson(prodInfo);
        //             }catch(e){
        //                 console.log('productInfo json parse error!' + e.message);
        //             }

        //             if(prodInfoDic){
        //                 $scope.productName = prodInfoDic.prodName;
        //             }
        //             $scope.amount = result.orderAmount;
        //             $scope.codeImg = result.codeImg;
        //             // todo 待删除
        //             if(result.simulation === "01"){
        //                 var element = document.getElementById('testUrl');
        //                 element.style.display = "inline";
        //                 $scope.url = result.url;
        //             }

        //         }else{
        //             console.log('error' + result.errorMsg);
        //             $rootScope.alertBox.show('提  示', result.errorMsg, 0);
        //         }
        //     }).error(function(data){
        //         console.log('error:' + data);
        //         $rootScope.alertBox.show('提  示', '网络异常,请稍后再试.', 0);
        //     });
        // }
    });