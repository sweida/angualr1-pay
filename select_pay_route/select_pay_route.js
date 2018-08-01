'use strict';

angular.module('myApp.select_pay_route', ['ngRoute','ui.bootstrap','ngSanitize','ngAnimate'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/select_pay_route', {
            templateUrl: '/app/select_pay_route/select_pay_route.html',
            controller: 'selectPayRouteViewCtrl'
        });
    }])

    .controller('selectPayRouteViewCtrl', function ($scope, $location, $rootScope, $http) {
        var dataList = [];

        $rootScope.navigationBar.leftBarItem.title = '';
        $rootScope.navigationBar.title = '选择渠道';

        let data2 = [
            {"privId":42016,"privCode":"MOBILE_SMS_PAY","privName":"认证支付","privType":"1","parentPriv":0,"showSeq":0,"appName":"H5","remark":"REMARK","createTime":1479447475000,"updateTime":1479447475000,"isvalid":"Y","parentPrivName":null,"isTransactionType":"Y","privPath":null,"isDefault":null},
            {"privId":42018,"privCode":"MOBILE_UNION_PAY","privName":"银联支付","privType":"1","parentPriv":0,"showSeq":1,"appName":"H5","remark":"REMARK","createTime":1479779135000,"updateTime":1479779135000,"isvalid":"Y","parentPrivName":null,"isTransactionType":"Y","privPath":null,"isDefault":null},
            {"privId":55011,"privCode":"QR_CODE_CONLLECTION","privName":"通用二维码支付","privType":"1","parentPriv":0,"showSeq":2,"appName":"H5","remark":"REMARK","createTime":1502679750000,"updateTime":1502679750000,"isvalid":"Y","parentPrivName":null,"isTransactionType":"Y","privPath":null,"isDefault":null},
            {"privId":40025,"privCode":"MOBILE_COMPOSITE_PAY","privName":"企业白条支付","privType":"1","parentPriv":0,"showSeq":3,"appName":"H5","remark":"企业白条支付","createTime":1532338168000,"updateTime":1532338168000,"isvalid":"Y","parentPrivName":null,"isTransactionType":"Y","privPath":null,"isDefault":null}
        ]
        angular.forEach(data2, function(item){
            var imgUrl = '/app/img/' + item.privCode + '.png';
            dataList.push({
                name: item.privName,
                imageUrl: imgUrl,
                selected: false,
                channelID:item.privCode
            });
        })
        $scope.data = dataList
        //请求支付渠道列表
        // $http({
        //     method: 'post',
        //     params: {},
        //     url: "/payment_plugin/mobile/platPayTypeData.do"
        // }).success(function (data, status, headers, config) {

        //     if(data && data.result.length > 0) {
        //         angular.forEach(data.result, function(temp){
        //             var imgUrl = '/app/img/' + temp.privCode + '.png';
        //             dataList.push({
        //                 name: temp.privName,
        //                 imageUrl: imgUrl,
        //                 selected: false,
        //                 channelID:temp.privCode
        //             });
        //         });
        //         dataList[0].selected = true;
        //         $scope.data = dataList;
        //     }else if(data && data.result.length == 0){
        //         $rootScope.alertBox.show('交易请求失败','未开通对应的支付权限,请联系翼支付申请开通',0);
        //     }else{
        //         $rootScope.alertBox.show('提  示','请求参数错误' + data.errorMsg,0);
        //     }
        // }).error(function (data, status, headers, config) {
        //     // 当响应以错误状态返回时调用
        //     $rootScope.alertBox.show('提  示','系统异常,请稍后重试.',0);
        // });

        //点击列表触发
        $scope.clickOnTableRow = function (item) {
            for(var i = 0;i < $scope.data.length; i++){
                if($scope.data[i] == item){
                    $scope.data[i].selected = true;
                }else{
                    $scope.data[i].selected = false;
                }
            }

        };
        //确认支付按钮
        $scope.goToPay = function () {
            var channel = getSelectedChannel();
            $location.path('/' + channel.channelID);
        };


        function getSelectedChannel() {
            for(var i = 0; i < $scope.data.length; i++){
                if($scope.data[i].selected){
                    return $scope.data[i];
                }
            }
            return null;
        };

    });