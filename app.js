'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'angular-loading-bar',
    'ngAnimate',
    'myApp.select_pay_route',
    'myApp.authen_pay',
    'myApp.union_pay',
    'myApp.version',
    'myApp.pay_result',
    'myApp.authen_pay.authen_pay_agreement',
    'myApp.authen_pay.authen_pay_help',
    'myApp.authen_allocate_pay',
    'myApp.create_qr_code',
    'myApp.qr_code_pay',
    'myApp.qr_code_pay_test',
    'myApp.qr_pay_result',
    'myApp.company_white_bar',
    'myApp.signin_result',
    'myApp.company_payment',
    'myApp.create_order'
])

    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider){
        $locationProvider.hashPrefix('!');
        $routeProvider.otherwise({redirectTo:'/select_pay_route'});  //设置默认路由
    }])
    .config(['$httpProvider', function($httpProvider){

        $httpProvider.interceptors.push(function($q, $rootScope, $location){
            return {
                request:function(req){
                    var reqTime = new Date().getTime();
                    req.params = req.params || {};
                    if(!req.params.reqTime){
                        req.params.reqTime = reqTime;
                    }
                    return req;
                },
                requestError:function(err){
                    return $q.reject(err);
                },
                response:function(res){
                    return res;
                },
                responseError:function(err){
                    if(-1 === err.status){
                        $rootScope.alertBox.show('提  示', '网络异常,请稍后重试.', -1);
                        // 远程服务器无响应
                    }
                    return $q.reject(err);
                }
            };
        });

        $httpProvider.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded';
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function(data){
            /**
             * The workhorse; converts an object to x-www-form-urlencoded serialization.
             * @param {Object} obj
             * @return {String}
             */
            var param = function(obj){
                var query = '';
                var name, value, fullSubName, subName, subValue, innerObj, i;

                for(name in obj){
                    value = obj[name];

                    if(value instanceof Array){
                        for(i = 0; i < value.length; ++i){
                            subValue = value[i];
                            //fullSubName = '' + i + '';
                            fullSubName = name + '[' + i + ']';
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }else if(value instanceof Object){
                        for(subName in value){
                            subValue = value[subName];
                            fullSubName = subName;
                            innerObj = {};
                            innerObj[fullSubName] = subValue;
                            query += param(innerObj) + '&';
                        }
                    }else if(value !== undefined && value !== null){
                        query += encodeURIComponent(name) + '='
                            + encodeURIComponent(value) + '&';
                    }
                }
                return query.length ? query.substr(0, query.length - 1) : query;
            };
            return angular.isObject(data) && String(data) !== '[object File]'
                ? param(data)
                : data;
        }];
    }])
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider){
        cfpLoadingBarProvider.includeBar = true;
        cfpLoadingBarProvider.includeSpinner = true;
        cfpLoadingBarProvider.parentSelector = '#loading-bar-container';
        cfpLoadingBarProvider.spinnerTemplate = '<div id="loading_spinner_bg"><div id="loading_spinner"><img src="img/loading.png">&nbsp;&nbsp;<span class="fa fa-spinner" style="font-size: 16px">加载中,请耐心等待...</div></div>';
        // cfpLoadingBarProvider.latencyThreshold = 500;  //响应时间小于500毫秒 不显示loading
    }])
    .directive('navigationController', function(){ //导航栏指令
        return {
            restrict:'A',
            replace:true,
            scope:{
                navBar:'=navBar'
            },
            templateUrl:'template/NavigationBarTemplate.html'
        }
    })
    .directive('alertBoxController', function(){
        return {
            restrict:'A',
            replace:true,
            scope:true,
            templateUrl:'template/AlertBoxTemplate.html'
        }
    })
    .controller('CahAPP', function($scope, $rootScope, $location){

        $rootScope.navigationBar = {
            leftBarItem:{
                title:'',
                action:function(){
                    console.log('leftItemBack');
                    history.back();
                }
            },
            title:''
        };

        $rootScope.alertBox = {
            hide:true,
            title:'',
            content:'',
            style:0,
            dismiss:function(){
                $rootScope.alertBox.hide = true;
                $rootScope.alertBox.title = '';
                $rootScope.alertBox.content = '';
                $rootScope.alertBox.style = 0;

            },
            show:function(alertTitle, alertContent, alertStyle){
                $rootScope.alertBox.title = alertTitle;
                $rootScope.alertBox.content = alertContent;
                $rootScope.alertBox.style = alertStyle;
                $rootScope.alertBox.hide = false;
            },
            userCallBack:function(){
                console.log('default callBack');
                history.back();
                //history.go(-1);
                $rootScope.alertBox.dismiss();
            }
        };


        $rootScope.showWarning = function(msg){
            var element = document.getElementById('warning-bar');
            if(msg){
                element.innerHTML = '<span style="color: white;font-size: 16px; line-height: 30px">' + msg + '</span>';
                setTimeout(
                    function(){
                        $rootScope.showWarning();
                    },
                    5000
                );
            }
            else{
                element.innerHTML = '';
            }

        };

    });


