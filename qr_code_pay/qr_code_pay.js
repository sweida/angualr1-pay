'use strict';

angular.module('myApp.qr_code_pay', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/qr_code_pay/:systemKey/:payCode', {
            templateUrl:'/app/qr_code_pay/qr_code_pay.html',
            controller:'QRCodePay'
        });
    }])

    .controller('QRCodePay', function($scope, $http, $rootScope, $location, $routeParams){

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '二维码支付';

        $scope.systemKey = $routeParams.systemKey;
        $scope.payCode = $routeParams.payCode;
        $scope.productName = "";
        $scope.amount = 0;
        $scope.tradeNo = "";


        var userAgent = navigator.userAgent;
        var host = window.location.host;
        var protocol = window.location.protocol;
        if($scope.payCode === "0"){
            toErrorPage("请使用微信或支付宝客户端扫码！")
        }else if($scope.payCode === "1"){
            // 查询商户报备信息 无报备/报备失败/报备失效都不行  报备成功且有效才能正常跳转
            $http.post('/payment_plugin/mobile/queryMerchantInfo.do', {
                systemKey:$scope.systemKey
            }).success(function(data){
                if("BP0000000" === data.errorCode){
                    var indexHtml = document.getElementById('indexHtml');
                    indexHtml.style.display = "none";
                    window.location.href = protocol + "//" + host + "/payment_plugin/mobile/redirectPayCode.do?systemKey=" + $scope.systemKey;
                }else{
                    toErrorPage("[" + data.errorCode + "]" + data.errorMsg);
                }
            }).error(function(data){
                console.log('error:' + data);
                $rootScope.alertBox.show('提  示', '网络异常,请稍后重试...', 0);
            });
        }else{
            if(userAgent.indexOf("Alipay") !== -1){
                getZFBUserid();
            }
        }


        //去支付  获取浏览器是微信还是支付宝再做调起对应收银台代码
        $scope.goToPay = function(){
            if(userAgent.indexOf("Alipay") !== -1){
                AliPay();
            }
        };

        // 支付宝支付
        function AliPay(){
            $http.post('/payment_plugin/mobile/qrCodePay.do?dt=' + new Date().getTime(), {
                systemKey:$scope.systemKey,
                openid:$scope.openid,
                orderTitle:$scope.productName
            })
                .success(function(data){
                    if(data && 'BP0000000' === data.errorCode){
                        var tradeNo = data.tradeNo;
                        if(tradeNo){
                            $scope.tradeNo = tradeNo;
                            AliPayReady();
                        }
                    }else{
                        toErrorPage(data.errorMsg);
                    }
                })
                .error(function(data){
                    console.log('error:' + data);
                    $rootScope.alertBox.show('提  示', '网络异常,请稍后重试...', 0);
                });
        }

        // 调起支付宝收银台
        function AliPayReady(){
            AlipayJSBridge.call("tradePay", {
                tradeNO:$scope.tradeNo
            }, function(result){
                if(result){
                    try{
                        var resultData = angular.fromJson(result);
                        var resultCode = resultData.resultCode;
                        if("9000" === resultCode){
                            //支付成功 跳转到支付成功页面
                            window.location.href = protocol + "//" + host + "/app/index.html#!/qr_pay_result/" + $scope.systemKey;
                        }else{
                            window.location.href = protocol + "//" + host + "/app/index.html#!/qr_pay_result/" + $scope.systemKey;
                        }
                    }catch(e){
                        console.log('openidStr json parse error!' + e.message);
                    }
                }else{
                    alert("支付失败！")
                }
            });
        }

        // 获取支付宝user_id
        function getZFBUserid(){
            $http.post('/payment_plugin/mobile/getOpenid.do', {
                code:$scope.payCode
            }).success(function(data){
                if(data.userId){
                    $scope.openid = data.userId;
                    $http.post('/payment_plugin/mobile/terminalOrderId.do', {
                        systemKey:$scope.systemKey
                    }).success(function(data){
                        if(data && 'BP0000000' === data.errorCode){
                            // 显示商品信息页面
                            var element = document.getElementById('normalPage');
                            element.style.display = "inline";

                            var prodInfo = data.productInfo.replace(/&quot;/g, '"');
                            var prodInfoDic;
                            try{
                                prodInfoDic = angular.fromJson(prodInfo);
                            }catch(e){
                                console.log('productInfo json parse error!' + e.message);
                            }
                            if(prodInfoDic){
                                $scope.productName = prodInfoDic.prodName;
                                $scope.address = prodInfoDic.address;
                                $scope.paymentDays = prodInfoDic.paymentDays;
                                $scope.userName = prodInfoDic.userName;
                                $scope.householder = prodInfoDic.householder;
                            }
                            $scope.amount = data.orderAmount;
                            $scope.orderId = data.orderId;

                        }else if(data && 'BP3000091' === data.errorCode || data && 'BP3000092' === data.errorCode){
                            toErrorPage(data.errorMsg);
                        }else{
                            console.log('error' + data.errorMsg);
                            $rootScope.alertBox.show('提  示', data.errorMsg, 0);
                        }
                    }).error(function(data){
                        console.log('error:' + data);
                        $rootScope.alertBox.show('提  示', '网络异常,请稍后再试...', 0);
                    });
                }else{
                    toErrorPage(data.errorMsg);
                }
            }).error(function(data, status, headers, config){
                console.log('error:' + data);
                $rootScope.alertBox.show('提  示', '网络异常,请稍后再试...', 0);
            });
        }

        // 显示错误页面
        function toErrorPage(errorMsg){
            var element = document.getElementById('normalPage');
            element.style.display = "none";
            var element2 = document.getElementById('errorPage');
            element2.style.display = "inline";
            $scope.qrErrorMsg = errorMsg;
        }
    });