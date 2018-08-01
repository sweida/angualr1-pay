'use strict';

angular.module('myApp.company_payment', ['ngRoute'])
    .controller('CompanyPayment', function($scope, $http, $rootScope, $location){

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '登陆翼支付企业账户';

        $scope.productName = "";
        $scope.amount = 0;
        $scope.codeImg = "";
        // todo 待删除
        $scope.url = "";

        $scope.confirmToPay = function(){           
            $location.path('/create_order');
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

        // canvasImg()
        // // 点击图片重新绘制
        // $scope.handleDraw = function(){
        //     canvasImg()
        // }
        // $scope.confirmToPay = function(){
        //     console.log(3335)
        //     $location.path('/signin_result');
        // }

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