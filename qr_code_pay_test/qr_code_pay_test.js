'use strict';

angular.module('myApp.qr_code_pay_test', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider){
        $routeProvider.when('/qr_code_pay_test/:systemKey/:payCode', {
            templateUrl:'/app/qr_code_pay_test/qr_code_pay_test.html',
            controller:'QRCodePayTest'
        });
    }])

    .controller('QRCodePayTest', function($scope, $http, $rootScope, $location, $routeParams){

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '二维码支付';

        $scope.systemKey = $routeParams.systemKey;
        $scope.payCode = $routeParams.payCode;
        $scope.productName = "";
        $scope.amount = 0;
        $scope.jsApi = "";
        var ua = navigator.userAgent;
        var host = window.location.host;
        var protocol = window.location.protocol;
        console.log(ua + "-----------" + protocol + "--------" + host);
        if($scope.payCode === "0"){
            toErrorPage("请使用微信或支付宝客户端扫码！");
        }else if($scope.payCode === "1"){
            var indexHtml = document.getElementById('indexHtml');
            indexHtml.style.display = "none";
            window.location.href = protocol + "//" + host + "/payment_plugin/mobile/redirectPayCode.do?systemKey=" + $scope.systemKey;
        }else{
            if(ua.indexOf("MicroMessenger") !== -1){
                getWeiXinOpenid();
            }else if(ua.indexOf("Alipay") !== -1){
                getZFBUserid();
            }
        }

        // todo 获取openid
        $scope.getOpenid = function(){
            var code = document.getElementById('code');
            $http.post('/payment_plugin/mobile/getOpenid.do', {
                code:code.value
            }).success(function(data){
                var openidStr;
                try{
                    console.log("含Openid 对象---->>>>" + data.openidStr);
                    openidStr = angular.fromJson(data.openidStr);
                    console.log("含Openid Json---->>>>" + data.openidStr);
                }catch(e){
                    console.log('openidStr json parse error!' + e.message);
                }
                if(openidStr.openid){
                    console.log("Openid---->>>>" + openidStr.openid);
                    $scope.openid = openidStr.openid;
                }else{
                    $scope.openid = "";
                }
            }).error(function(data){
                // 请求失败执行代码
                $rootScope.alertBox.show('提  示', '网络异常,请稍后再试...getOpenid-..', 0)
            });
        };


        // TODO 模拟下单
        $scope.weixinOrder = function(){
            var openid = document.getElementById('openid').value;
            $http.post('/payment_plugin/mobile/qrCodePay.do?dt=' + new Date().getTime(), {
                systemKey:$scope.systemKey,
                openid:openid,
                orderTitle:"华为Mate10"
            }).success(function(data){
                if(data && 'BP0000000' === data.errorCode){
                    alert(data.jsApi);
                    $scope.jsApi = data.jsApi;
                    if(jsApi){
                        onBridgeReady();
                    }
                }else{
                    toErrorPage(data.errorMsg);
                }
            }).error(function(data){
                console.log('error:' + data);
                $rootScope.alertBox.show('提  示', '网络异常,请稍后重试....WeiXinPay..', 0);
            });
        };


        //去支付 todo 获取浏览器是微信还是支付宝再做调起对应收银台代码
        $scope.goToPay = function(){
            if(ua.indexOf("MicroMessenger") !== -1){
                WeiXinPay();
            }else if(ua.indexOf("Alipay") !== -1){
                AliPay();
            }
        };

        // 微信支付
        function WeiXinPay(){
            $http.post('/payment_plugin/mobile/qrCodePay.do?dt=' + new Date().getTime(), {
                systemKey:$scope.systemKey,
                openid:$scope.openid,
                orderTitle:$scope.productName
            }).success(function(data){
                if(data && 'BP0000000' === data.errorCode){
                    alert(data.jsApi);
                    $scope.jsApi = data.jsApi;
                    if(jsApi){
                        onBridgeReady(jsApi);
                    }
                }else{
                    toErrorPage(data.errorMsg);
                }
            }).error(function(data){
                console.log('error:' + data);
                $rootScope.alertBox.show('提  示', '网络异常,请稍后重试....WeiXinPay..', 0);
            });
        }

        // 支付宝支付
        function AliPay(){
            $http.post('/payment_plugin/mobile/qrCodePay.do?dt=' + new Date().getTime(), {
                systemKey:$scope.systemKey,
                openid:$scope.openid
            })
                .success(function(data){
                    if("PFS11880004" === data.errorCode){
                        $rootScope.alertBox.show('提  示', data.errorCode + data.errorMsg, 0);
                    }
                    AliPayReady();
                })
                .error(function(data){
                    console.log('error:' + data);
                    $rootScope.alertBox.show('提  示', '网络异常,请稍后重试...AliPay...', 0);
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

        // 调起微信收银台
        function onBridgeReady(){
            host = window.location.host;
            protocol = window.location.protocol;
            alert(appId + "------" + timeStamp + "------" + nonceStr + "------" + wxPackage + "------" + paySign);
            WeixinJSBridge.invoke('getBrandWCPayRequest', $scope.jsApi,
                function(res){
                    console.log(res);
                    if(res.err_msg === "get_brand_wcpay_request:ok"){
                        alert(res.err_msg + "----支付成功！");
                        window.location.href = protocol + "//" + host + "/app/index.html#!/qr_pay_result/" + systemKey;
                    }else{
                        //这里支付失败和支付取消统一处理
                        alert(res.err_msg + "----支付失败！" + protocol + "//" + host + "/app/index.html#!/qr_pay_result/" + systemKey);
                        window.location.href = protocol + "//" + host + "/app/index.html#!/qr_pay_result/" + systemKey;
                    }
                });
        }


        // 获取微信openid
        function getWeiXinOpenid(){
            $http.post('/payment_plugin/mobile/terminalOrderId.do', {
                systemKey:$scope.systemKey
            }).success(function(result){
                if(result && 'BP0000000' === result.errorCode){
                    var prodInfo = result.productInfo.replace(/&quot;/g, '"');
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
                    $scope.amount = result.orderAmount;
                    $scope.orderId = result.orderId;
                }else if(result && 'BP3000091' === result.errorCode || result && 'BP3000092' === result.errorCode){
                    toErrorPage(result.errorMsg);
                }else{
                    console.log('error' + result.errorMsg);
                    $rootScope.alertBox.show('提  示', result.errorMsg, 0);
                }
            }).error(function(data){
                console.log('error:' + data);
                $rootScope.alertBox.show('提  示', '网络异常,请稍后再试...getWeiXinOpenid--terminalOrderId1...', 0);
            });
        }

        // 获取支付宝user_id
        function getZFBUserid(){
            $http.post('/payment_plugin/mobile/terminalOrderId.do', {
                systemKey:$scope.systemKey
            }).success(function(data){
                if(data && 'BP0000000' === data.errorCode){
                    var prodInfo = data.productInfo.replace(/&quot;/g, '"');
                    var prodInfoDic;
                    try{
                        prodInfoDic = angular.fromJson(prodInfo);
                    }catch(e){
                        console.log('productInfo json parse error!' + e.message);
                    }
                    if(prodInfoDic){
                        $scope.productName = prodInfoDic.prodName;
                        $scope.remark = prodInfoDic.remark;
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
                $rootScope.alertBox.show('提  示', '网络异常,请稍后再试...getZFBUserid--terminalOrderId3..', 0);
            });
        }

        // 跳转到错误页面
        function toErrorPage(errorMsg){
            var element = document.getElementById('normalPage');
            element.style.display = "none";
            var element2 = document.getElementById('errorPage');
            element2.style.display = "inline";
            $scope.qrErrorMsg = errorMsg;
        }
    });