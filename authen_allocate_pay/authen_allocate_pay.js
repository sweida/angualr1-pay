'use strict';

angular.module('myApp.authen_allocate_pay', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/CERTIFICATION_PAY_LEDGER', {
        templateUrl: '/app/authen_allocate_pay/authen_allocate_pay.html',
        controller: 'AuthenAllocatePay'
      });
    }])

    .controller('AuthenAllocatePay', function($scope, $http, $rootScope, $location) {

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '认证支付';

        $scope.productName = "";
        $scope.amount = 0;
        $scope.merchantName = "";
        $scope.agreement = true;

        //获取订单信息

        $http.post('/payment_plugin/mobile/payData.do', {
        }).success(function (result) {
            if (result && 'BP0000000' == result.errorCode) {
                var data = result.signMsg;
                var prodInfo = result.productInfo.replace(/&quot;/g,'"');
                var prodInfoDic;
                try{
                    prodInfoDic = angular.fromJson(prodInfo);
                }
                catch(e){
                    console.log('productInfo json parse error!' + e.message);
                }

                if(prodInfoDic){
                    $scope.productName = prodInfoDic.prodName;
                }
                $scope.amount = result.orderAmount;
                $scope.merchantName = result.merchantName;
                if(data)
                {
                    $scope.phoneNo = data.mobile;
                    $scope.cardNo = data.bankCardNo;
                    $scope.cardHolder = data.bankCardName;
                    $scope.idCardNo = data.certNo;
                }
            }else if(result && 'ARP02880003' == result.errorCode)
            {
                var prodInfo = result.productInfo.replace(/&quot;/g,'"');
                var prodInfoDic;
                try{
                    prodInfoDic = angular.fromJson(prodInfo);
                }
                catch(e){
                    console.log('productInfo json parse error!' + e.message);
                }
                if(prodInfoDic){
                    $scope.productName = prodInfoDic.prodName;
                }

                $scope.amount = result.orderAmount;
                $scope.merchantName = result.merchantName;
            }
            else{
                console.log('error' + result.errorMsg);
                $rootScope.alertBox.show('提  示',result.errorMsg,0);

            }
        }).error(function (data) {
            console.log('error:' + data);
            $rootScope.alertBox.show('提  示','网络异常,请稍后再试.',0);
        });

        $rootScope.smsTimeOut = 60;

        $scope.time = function (btn) {
            if ($rootScope.smsTimeOut == 0) {
                btn.removeAttribute('disabled');
                btn.innerText = '获取验证码';
                $rootScope.smsTimeOut = 60;
            }
            else {
                btn.setAttribute('disabled', true);
                if(btn.innerText == undefined) {
                    btn.textContent = '重新发送(' + $rootScope.smsTimeOut + 's)';
                }
                else{
                    btn.innerText = '重新发送(' + $rootScope.smsTimeOut + 's)';
                }

                $rootScope.smsTimeOut--;
                setTimeout(
                    function () {
                        $scope.time(btn);
                    },
                    1000
                 );
            }
        };

        $scope.getVerifySMS = function () {
            //调短信接口
            var btn = document.getElementById('verify_button');
            if($scope.checkALL(1))
            {
                $http.post('/payment_plugin/mobile/sendMsg.do', {
                    mobile: $scope.phoneNo,         //手机号
                    account: $scope.cardNo,         //银行卡号
                    accountName: $scope.cardHolder,  //账户名
                    certNo: $scope.idCardNo         //证件号，身份证
                })
                    .success(function (data) {
                        console.log('success:' + data);
                        if(data.result){
                            $scope.time(btn);
                            var verifyCodeInputText = document.getElementById('VerifyCode');
                            verifyCodeInputText.value = '';
                            // verifyCodeInputText.focus();
                        }
                        else{
                            $rootScope.alertBox.show('提  示', data.errorMsg,0);
                        }
                    })
                    .error(function (data, status, headers, config) {
                        console.log('error:' + data);
                        $rootScope.alertBox.show('提  示','网络异常,请稍后重试.',0);
                    });

            }
        };
        //同意协议复选框
        $scope.clickOnAgreement = function () {
            $scope.agreement = !$scope.agreement;
        };

        //确认支付
        $scope.confirmToPay = function () {
            if(!$scope.agreement)
            {
                $rootScope.alertBox.show('温馨提示','请仔细阅读翼支付<代扣授权>',0);
                return;
            }

            if(!$scope.checkALL(0))
            {
                return;
            }
            var btn = document.getElementById('confirm_button');
            btn.setAttribute('disabled', true);

            $http.post('/payment_plugin/mobile/certifyPayAllocate.do?dt='+ new Date().getTime(), {
                mobile: $scope.phoneNo,         //手机号
                accountCode: $scope.cardNo,         //银行卡号
                accountName: $scope.cardHolder,  //账户名
                certNo: $scope.idCardNo,       //证件号，身份证
                msgCode:$scope.verifyCode     //验证码

            })
                .success(function (data, status, headers, config) {
                    console.log('success:' + data);
                    if('FCA31000000' == data.errorCode || 'FCA31880004' == data.errorCode) {
                        $rootScope.payResult = data.result||{};
                        $rootScope.payResult.productName = $scope.productName;
                        $location.path('pay_result');
                    }
                    else if('PEC05668996' == data.errorCode || 'PEC05668995' == data.errorCode){
                        $location.path('/pay_result');
                    }
                    else{
                        $rootScope.alertBox.show('交易失败',data.errorMsg,0);
                    }
                })
                .error(function (data, status, headers, config) {
                    console.log('error:' + data);
                    $rootScope.alertBox.show('提  示','网络异常,请稍后重试.',0);
                    btn.removeAttribute('disabled');
                });
        };

        $scope.checkALL = function (flag) {

            var btn = document.getElementById("confirm_button");

            btn.setAttribute("disabled",true);

            var cardNoInputText = document.getElementById("CardNoInputText");
            var cardNoRegx = new RegExp("^[0-9]{6,25}$");
            if(!cardNoInputText.value || !cardNoRegx.test(cardNoInputText.value))
            {
                $rootScope.showWarning("请输入正确的银行卡号");
                cardNoInputText.style.outline = '2px solid red';
                return false;
            }
            else
            {
                cardNoInputText.style.outline = '';
            }

            var cardHolderInputText = document.getElementById("CardHolderInputText");
            if(cardHolderInputText.value.length < 1 || cardHolderInputText.value.length > 32)
            {
                $rootScope.showWarning("请输入正确的姓名");
                cardHolderInputText.style.outline = '2px solid red';
                return false;
            }
            else
            {
                cardHolderInputText.style.outline = '';
            }

            var idCardInputText = document.getElementById("IDCardInputText");
            if(!IdentityCodeValid(idCardInputText.value))
            {
                $rootScope.showWarning("请正确输入您的身份证号码");
                idCardInputText.style.outline = '2px solid red';
                return false;
            }
            else
            {
                idCardInputText.style.outline = '';
            }

            var phoneNoInputText = document.getElementById("PhoneNoInputText");
            var phoneNoRegx = new RegExp("^1[0-9]{10}$");
            if(!phoneNoInputText.value || !phoneNoRegx.test(phoneNoInputText.value))
            {
                $rootScope.showWarning("请输入正确的手机号");
                phoneNoInputText.style.outline = '2px solid red';
                return false;
            }
            else
            {
                phoneNoInputText.style.outline = '';
            }

            if(!flag){
                var verifyCodeInputText = document.getElementById("VerifyCode");
                var verifyCodeRegx = new RegExp("^[0-9]{6}$");
                if(!verifyCodeInputText.value || !verifyCodeRegx.test(verifyCodeInputText.value)) {
                    $rootScope.showWarning("请输入正确的验证码");
                    verifyCodeInputText.style.outline = '2px solid red';
                    return false;
                }
                else
                {
                    verifyCodeInputText.style.outline = '';
                }
                btn.removeAttribute('disabled');
            }


            $rootScope.showWarning("");
            return true;
        }

        function IdentityCodeValid(code) {
            var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
            var tip = "";
            var pass= true;

            if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)){
                pass = false;
            }
            else if(!city[code.substr(0,2)]){
                pass = false;
            }
            else{
                //18位身份证需要验证最后一位校验位
                if(code.length == 18){
                    code = code.split('');
                    //∑(ai×Wi)(mod 11)
                    //加权因子
                    var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
                    //校验位
                    var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
                    var sum = 0;
                    var ai = 0;
                    var wi = 0;
                    for (var i = 0; i < 17; i++)
                    {
                        ai = code[i];
                        wi = factor[i];
                        sum += ai * wi;
                    }
                    var last = parity[sum % 11];
                    if(parity[sum % 11] != code[17]){
                        pass =false;
                    }
                }
            }
            return pass;
        }


    });