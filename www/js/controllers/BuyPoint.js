angular.module('starter.controllers')
.controller('BuyPointCtrl',['$scope', '$ionicLoading','global','$http','config','$ionicHistory', function($scope, $ionicLoading, global, $http,config,$ionicHistory, $cordovaToast) {
  		$scope.buyAdFree = function(point) {
			if(!point) return false;
			$scope.point = point;	
			console.log(point);		
			//inappbilling.init(successHandler, errorHandler, {showLog:true});
			inappbilling.buy(successHandler, errorHandler, point);
		}
		    
			
			function successHandler (result) {
                var strResult = "";
				
				$scope.pointData = {};
				
				   if($scope.point == 'points_50'){
					  $scope.pointData.point    = 50;
				   }
				   else if($scope.point == 'points_120'){
					   $scope.pointData.point    = 120;
				   }
				   else if($scope.point == 'points_250'){
					   $scope.pointData.point    = 250;
				   }
				   else if($scope.point == 'points_500'){
					   $scope.pointData.point    = 500;
				   }
			   
				
				 $scope.pointData.memberId = config.userProfile.member_id;
 				 
					if($scope.pointData.point > 0 ){
						$http.post(config.apiUrl+'/purchasePoint', { 'pointData' :  $scope.pointData }).
							success(function(response) {
								if(response.status == 'ok'){
									global.popup(response.message);
								}
						}). error(function(data) {
							 $scope.NoPoints = "Server Error..";
							 global.popup();
							 global.hideloader();
						});
					}
            }

            function errorHandler (error) {
				global.popup(error);		
            }
			
		
		$scope.goBack = function(){
			$ionicHistory.goBack();
		};
	
}]);