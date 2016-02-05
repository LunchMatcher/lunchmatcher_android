// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
var starter 	= angular.module('starter', ['ionic', 'starter.controllers', 'ngCordova', 'ngMessages', 'uiSlider', 'google.places'])
.filter('myDate', function($filter) {    
    var angularDateFilter = $filter('date');
    return function(theDate) {
       return angularDateFilter(theDate, 'MM DD, YYYY');
    }
})

.run(function($ionicPlatform,$cordovaSplashscreen, $timeout, $cordovaPush, $rootScope, $http, $location,global,$templateCache,$ionicSideMenuDelegate,$cordovaDevice,config,$state) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
	 
	 	/*$timeout(function() {
      $cordovaSplashscreen.hide();
    }, 5000);*/
/*	$ionicPlatform.registerBackButtonAction(function (event) {
                    event.preventDefault();
            }, 100);*/
			
	$ionicPlatform.registerBackButtonAction(function (event) {
			return false;
		}, 100);
 		
	$ionicPlatform.ready(function() {
										var config = {
										  "senderID": "118408065389",
										};		
										$cordovaPush.register(config).then(function(result) {
																					
										}, function(err) {
											
										})
								  }); 
	$rootScope.$on('$viewContentLoaded', function() {
      $templateCache.removeAll();
   });
	$rootScope.$on('$cordovaPush:notificationReceived', function(event, notification) {																 
		  switch(notification.event) {
			case 'registered':
			  if (notification.regid.length > 0 ) {
				//console.log('registration ID = ' + notification.regid);
				localStorage.setItem("deviceToken",notification.regid);
				localStorage.setItem("devicePlatform",'Android');
					document.addEventListener("deviceready", function () {
					deviceDetails = {};
					deviceDetails.deviceToken =  localStorage.getItem('deviceToken');
					deviceDetails.devicePlatform =  localStorage.getItem('devicePlatform');
					deviceDetails.deviceId 	= $cordovaDevice.getUUID();
					//$http.post(config.apiUrl+'/saveDeviceToken', { 'deviceDetails' : deviceDetails });
					$http({
						method: 'POST',
						url: config.apiUrl+'/saveDeviceToken',
						data: { 'deviceDetails' : deviceDetails }
					}).success(function(response) { return ;
					});
				  },false);
			  	}
			  break;
			case 'message':          
			 // $location.path(notification.payload.anchor);
			//console.log(notification);
			 if(notification.foreground == true)
			 		{
			 	 		var anchorString = notification.payload.anchor;
						var popup;
						popup = global.popup(notification.payload.message);				
						//popup.then(function(res) {
								// if(res) {
									// alert($ionicSideMenuDelegate.isOpen());
								if($ionicSideMenuDelegate.isOpen())
									 $ionicSideMenuDelegate.toggleLeft();
								$location.path(notification.payload.anchor);
							//	 } 
					//	 });
					}
				else
				{
					 if(notification.coldstart == false)
					{
						$ionicSideMenuDelegate.toggleLeft($ionicSideMenuDelegate.isOpen());
						$location.path(notification.payload.anchor);
					}						
					 else{
					 	localStorage.setItem("pushreceived",notification.payload.anchor);
					 }
				}			 		
			  break;	
			case 'error':
			  alert('GCM error = ' + notification.msg);
			  break;
	
			default:
			  alert('An unknown GCM event has occurred');
			  break;
		  }
		});
//********** ON RESUME ******************
	document.addEventListener("resume", function() {
				if($state.current.name !=  'app.feedbackshare' && $state.current.name !=  'app.profilereview' && $state.current.name !=  'app.tutorial' && $state.current.name !=  'app.matchhistory' && $state.current.name !=  'app.scorepoints' && $state.current.name !=  'app.buypoints'){
										deviceDetails = {};
										deviceDetails.device_token 	= localStorage.getItem("deviceToken");
										deviceDetails.device_platform = localStorage.getItem("devicePlatform");										
										deviceDetails.device_id	   = $cordovaDevice.getUUID();										
										localStorage.setItem("deviceId",deviceDetails.device_id);
										global.loader();			
										$http({
											method: 'POST',
											url: config.apiUrl+'/getProfile/',
											dataType: 'json',
											data: { 'deviceDetails' : deviceDetails}
										}).success(function(response) {
																						
													global.hideloader();
													
													if(response.result){
														config.userProfile = response.result;
													}
													localStorage.setItem("lmUserProfile", JSON.stringify(response.result));
													if(localStorage.getItem("pushreceived")){
														var pushrecieved = localStorage.getItem("pushreceived");
														localStorage.removeItem("pushreceived");
														$location.path(pushrecieved);
														return false;
													}
													else{
														if(response.status == 'nouser'){
															
															if(localStorage.getItem("first_user")!=0)
															{
																$location.path("/inital_tutorial");
															}
															else{
																$location.path("/login");
															}
														}
														else if(response.status == 'trashed' || response.status == 'blocked'){
															global.popup(response.message);
															$location.path("/login");
														}
														else if(response.status == 'nocontact'){
															$location.path("/app/registration");
														}
														else if(response.status == 'setavailability'){
															$location.path("/app/availability");
														}
														else if(response.status == 'nomatches'){
															global.popup(response.message);
															$location.path("/app/availability");	
														}
														else if(response.status == 'matchprofile'){
															$location.path("/app/matchprofile/"+response.result.tempLog.log_id+"/"+response.result.tempLog.matchuser_id);
														}
														else if(response.status == 'viewmatch'){
															global.addTemp('availabilityInfo',response.result.availability);																			
															$location.path("/app/matchdetail/"+response.result.availability.schedule_id+"/"+response.result.availability.matches);
														}
														else if(response.status == 'setreview'){
															$location.path("/app/profilereview/"+response.result.availability.schedule_id+"/"+response.result.availability.matches);
														}
														else{
															
															$location.path("/app/availability");	
														}
													}
										}).error(function(data) {
											global.popup();
											global.hideloader();
										});
									}
	});
							
//**************************
//# Payment code #############################
		if((window.device && device.platform == "Android") && typeof inappbilling !== "undefined") {
			inappbilling.init(function(resultInit) {
				//console.log("IAB Initialized");
			},
			function(errorInit) {
				//console.log("ERROR -> " + errorInit);
			}, 
			{showLog: true},
			["points_50","points_120","points_250","points_500"]);
		}
		inappbilling.getPurchases(function(result) {
			//console.log("PURCHASES -> " + JSON.stringify(result));
		},
		function(errorPurchases) {
			//console.log("PURCHASE ERROR -> " + errorPurchases);
		});

//# END: Payment code ########################

  });
})
.config(['$httpProvider', function($httpProvider) {
  delete $httpProvider.defaults.headers.post['Content-type']
   // delete $httpProvider.defaults.headers.common["X-Requested-With"];
}])
.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

	.state('app', {
		url: "/app",
		abstract: true,
		templateUrl: "templates/menu.html",
		/*controller: 'AppCtrl'*/
	})
	.state('home', {
		url: "/home",
		templateUrl: "templates/home.html",
		controller: 'HomeCtrl' 
	})
	.state('login', {
		url: "/login",
		templateUrl: "templates/login.html",
		controller: 'LoginCtrl'
	})
	.state('inital_tutorial', {
		url: "/inital_tutorial",
		templateUrl: "templates/tutorial.html",
		controller: 'TutorialCtrl'
	})
	.state('app.registration', {
		cache: false, 
		url: "/registration",
		views: {
		  'menuContent': {
			templateUrl: "templates/registration.html",
			controller: 'LoginCtrl' 
		  }, 
		}
	})
	.state('companies', {
		cache: false, 
		url: "/companies",
		templateUrl: "templates/companies.html",
		controller: 'CompaniesCtrl'
	})
	.state('app.availability', {
		url: "/availability",		
		views: {
		  'menuContent': {
			templateUrl: "templates/availability.html",
			 controller: 'AvailabilityCtrl' 
		  },
		}
	})
	.state('app.tutorial', {
		url: "/tutorial",		
		views: {
		  'menuContent': {
			templateUrl: "templates/tutorial.html"
		  },
		}
	})
	.state('app.buypoints', {
		url: "/buypoints",		
		views: {
		  'menuContent': {
			templateUrl: "templates/buypoints.html",
			controller: 'BuyPointCtrl' 
		  },
		}
	})
	.state('app.venues', {
		cache: false,
		url: "/venues",
		views: {
		  'menuContent': {
			templateUrl: "templates/venues.html",
			 controller: 'venuesCtrl' 
		  },
		}
	})
	.state('venuedetails', {
		cache: false,
		url: "/venuedetails",
		templateUrl: "templates/venuedetails.html",
		controller: 'venueDetailsCtrl'
	})
	.state('app.matchprofile', {
		cache: false, 
		url: "/matchprofile/:logid/:toid",
		views: {
		  'menuContent': {
			templateUrl: "templates/matchprofile.html",
			 controller: 'matchCtrl' 
		  },
		}
	})
	.state('app.profilereview', {
		cache: false,   
		url: "/profilereview/:logid/:toid",
		views: {
		  'menuContent': {
			templateUrl: "templates/profilereview.html",
			 controller: 'reviewCtrl' 
		  },
		}
	})
	.state('app.matchhistory', {
		cache: false,   
		url: "/matchhistory",
		views: {
		  'menuContent': {
			templateUrl: "templates/matchhistory.html",
			controller : 'matchHistoryCtrl'
		  },
		}
	})
	.state('app.scorepoints', {
		cache: false,   
		url: "/scorepoints",
		views: {
		  'menuContent': {
			templateUrl: "templates/scorepoints.html",
			controller: 'pointCtrl' 
		  },
		}
	})
	.state('app.matchdetail', {
		cache: false,   
		url: "/matchdetail/:logid/:toid",
		views: {
		  'menuContent': {
			templateUrl: "templates/matchdetail.html",
			 controller: 'matchdetailCtrl' 
		  },
		}
	})
	.state('app.feedbackshare', {
		cache: false,   
		url: "/feedbackshare",
		views: {
		  'menuContent': {
			templateUrl: "templates/feedbackshare.html",
			 controller: 'feedbackCtrl' 
		  },
		}
	})	
	
	
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('home');
});
starter.factory('config', function() {
		return {
			appName		: 'Lunch Matcher',
			appVersion	 : 1.0,
			apiUrl	     : 'http://newagesme.com/lunch_matcher/api',
			baseUrl		: 'http://newagesme.com/lunch_matcher',
			noImageLink    : 'http://newagesme.com/lunch_matcher/assets/images/detail_thumb.png',
			/*apiUrl		 : 'http://www.lunchmatcher.com/api',
			baseUrl		: 'http://www.lunchmatcher.com',*/
			/*apiUrl	     : 'http://192.168.1.254/lunch_matcher/api',
			baseUrl		: 'http://192.168.1.254/lunch_matcher',*/
			ldinClientId   : '75j6543f18uofs',
			ldinSecret 	 : 'U86ACYVpqeAPcLKq',
			ldinScope 	  : ['r_basicprofile','r_emailaddress'],
			ldinState 	  : 'hllyshtentsmmo',
			accessToken 	: '',
			noImage		: 'img/no_image.png',	
			noImageSmall   : 'img/small_no_image.png',	
			noVenuImage    : 'img/thumb.png',
			lmUserInfo	 : {accessToken : ''},
			userProfile	: '',
			messageAfetSetAvl : 'Congrats..!, Your availability set up for next lunch slot has been completed.',
			noMatchMessage : 'Sorry, we could not find any matches Today for you. Please change your availability time, radius or venues to get more suitable matches.'		  
			};
});
starter.factory('global', function($ionicLoading, $ionicPopup, $http, $ionicScrollDelegate,$cordovaToast) {
		var tempVariables= {};								   
        return {
            loader: function(text) {
				 text = typeof text !== 'undefined' ? text : 'Loading..';
                $ionicLoading.show({
				  	template: '<i class="icon ion-loading-d" style="font-size: 32px"></i><br>'+text,
				});
			},
			scrollBottom: function(){
				$ionicScrollDelegate.scrollBottom();
			},
			scrollTop: function(){
				$ionicScrollDelegate.scrollTop();
			},
			hideloader: function(text) {
				 $ionicLoading.hide();
			},
			toTitleCase: function(str) {
				if(str)
				 	return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
				else 
					return null;
			},
			popup: function(message,title) {
					message = typeof message !== 'undefined' ? message : 'LunchMatcher requires an internet connection. Please ensure you are connected to the internet.';
					title = typeof title !== 'undefined' ? title : 'Lunch Matcher';
					
					$cordovaToast.show(message, 'long', 'center');	
					/*var popup = $ionicPopup.alert({
								  title: title,
								  template: '<span class="text-center">'+message+'</span>'
								});*/
					
					//return popup;
				},
			confirm: function(message,title){
					message = typeof message !== 'undefined' ? message : 'Are you sure!';
					title = typeof title !== 'undefined' ? title : 'Lunch Matcher';
					
					var confirmPopup = $ionicPopup.confirm({
							 title: title,
							 template: '<span class="text-center">'+message+'</span>'
						   });
					
					return confirmPopup;
				},	
			addTemp	: function(name, value) { 
					tempVariables[name] = value ;
					//console.log('Temp var added');
					//console.log(tempVariables);
			 },
			 removeTemp	: function(name, value) {
					delete tempVariables[name];
					///console.log('Temp var deleted');
			 },
			getTemp	: function(){
				  return tempVariables;
			  },
			getTempVal : function(val){
					//console.log(tempVariables[val]);
				  return tempVariables[val];
			  },		            			
        };
    });
starter.factory('venues', function($http,config) {
			this.venueDetails = [];
			this.selectedVenues = [];
			this.venue = {};
		this.toggleVenue = function (venue) {
			
			var tf = (venue.selected === 'true') ? 'false' : 'true';
			venue.selected = tf;
		  
			if(venue.selected === 'true'){
				this.selectedVenues.push(venue.place_id);
			}
			else{
				  var i = this.selectedVenues.indexOf(venue.place_id);
					if(i != -1) {
						this.selectedVenues.splice(i, 1);
					}
			}
			
		};
		this.toggleFav = function (venue) {  
		
		 // this.toggleVenue(venue);		  
		  var tf = (venue.favourite === true) ? false : true;
		  venue.favourite = tf;
		  if(venue.favourite == true){	
			venue.selected = 'true';
			this.selectedVenues.push(venue.place_id);
		  }
				
		  
				
		  $http.post(config.apiUrl+'/saveFav', { 'venue_id' : venue.place_id , 'selected' : venue.selected , 'favourite' : venue.favourite , 'member_id'  : config.userProfile.member_id });
		};
		return this;
});
starter.factory('matches', function(global, $http, config, $location) {
		this.matchedUser = {};
		self 		 	= this;
		this.getMatchDetails = function (logId,tomatchLogId,userId,status) {
			global.loader();
			//alert("hi");
			var promise = $http.post(config.apiUrl+'/getMatchDetails', { 'logId' : logId , 'tomatchLogId'  : tomatchLogId , 'userId'  : userId ,
						 'status' :status }).
						  error(function(data) {
										var confirmpromise = global.confirm("Server Error !");										
										confirmpromise.then(function(res){
											$location.path('/app/availability');
									});
								});
				return promise;
		};
		this.getMatchReviewDetails = function (logId,matcherId) {
			
			global.loader();
			var promise = $http.post(config.apiUrl+'/getMatchReviewDetails', { 'logId' : logId , 'matcherId'  : matcherId ,'memberId' : config.userProfile.member_id }).
						success(function(response) {										
										global.hideloader();
							  	}).
						  error(function(data) {
										 global.popup();
								});
			return promise;
		};
		return this;
});
starter.factory('availability', function(global, $http, config,$location) {
			 this.getLogDetailsFromTemp = function (match_logid)
			 {
				 var getlogpromise = $http.post(config.apiUrl+'/getLogDetailsFromTemp', { 'match_logid' : match_logid , 'user_id' : config.userProfile.member_id });
						getlogpromise.success(function(response){
													  var from =  global.getTempVal('from');
													  global.removeTemp('from');
													  var acceptStatus = '';
													  var matchuser = response.result.matchuser_id;
													  if(response.result.no_matches){
														    $location.path("/app/nomatches"); 
													  }
													  else if(response.result){
														  
														  if(response.result.my_status == 'Y'  && response.result.matchuser_status == ''){
																acceptStatus = 'accepted';
																global.addTemp('status',acceptStatus);
																$location.path("/app/matchprofile/"+response.result.log_id+"/"+matchuser);
																
														  }
														  else if(response.result.my_status == 'N'){
														  		acceptStatus = 'currentUserRejected'; 
																global.addTemp('status',acceptStatus);
																$location.path("/app/matchprofile/"+response.result.log_id+"/"+matchuser);
														  }
														  else if(response.result.matchuser_status == 'N'){
														  		$location.path("/app/matchprofile/"+response.result.log_id+"/"+matchuser+"/rejected");
														  }
														  else{
															 
																acceptStatus = 'notaccepted';
																global.addTemp('status',acceptStatus);
																$location.path("/app/matchprofile/"+response.result.log_id+"/"+matchuser);
														  }
															
													  }
													  
													  
													  
										});
			 }
			 return this;
});
starter.directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});