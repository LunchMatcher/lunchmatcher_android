angular.module('starter.controllers')
.controller('AppCtrl',['$scope', '$ionicLoading','global','$http','config', function($scope, $ionicLoading, global, $http,config) {
  		$scope.loginData = {};
		
		$scope.errorShare = function(msg){
						console.log("Fail");
						console.log(msg);
		}
		$scope.successShare = function(msg){
							console.log("Success");
							console.log(msg);
							/*if(msg == true)
								global.popup('Successully shared!'); 
							else
								 global.popup('Error: Sharing failed. Please try later!');*/
	
		}
	
	
		$scope.share = function(){
			$http.post(config.apiUrl+'/getShare').   //temp code 
				success(function(response) {
					if(response.status == 'success'){
					window.plugins.socialsharing.share(response.shareDesc, null, null, response.shareURL
					,$scope.successShare , $scope.errorShare );
					}
					else{
						global.popup();
					}
					
				});
		}
		
	
}]);