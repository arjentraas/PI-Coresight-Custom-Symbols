window.PIVisualization = window.PIVisualization || {};
(function (PV) {
 'use strict';
 var def = {
	 typeName: 'ERD',
	 displayName: 'ERD List',
	 iconUrl: 'Scripts/app/editor/tools/ext/Icons/LinkedCubes.png',
	 inject: ['$rootScope','$http','$interval','displayProvider', 'assetContext','contextPath','webServices','$stateParams'],
	 init: init
 };
 
 

 function init($rootScope,scope, elem, $http, $interval, displayProvider, assetContext,contextPath,webServices,$stateParams) {  
  
  $rootScope.assetArray = [];
  
 
	 var requestId = displayProvider.requestId;
  
  var relatedAssetsUrl = 'https://dev-arcadia.osisoft.int/PIVision/Display/' + requestId + '/RelatedAssets?path=';
  
  $http.get(relatedAssetsUrl).success(function(response){
	  
	  console.log(response);
	  if(response){
		  var match;
		  var regex = /(\\\\.*?)\*|(\\\\.*)$/g;
		  while (match = regex.exec(response)){
			  //match[1] - group1 captured macthes. match[2] - group2 captured matches.
			  $rootScope.assetArray.push(match[1] ? match[1] : match[2]);
			  
		  }
		  
	  }
	  
  });
  
	 
 
 
	
/*	$interval(function(){
	
	//var test = assetContext.getDisplayedAssets();
	 console.log('get disp data', assetContext.getDisplayedAssets());
	 console.log('get paths data', assetContext.getAssetPaths());
console.log('displayProvider',displayProvider.requestId);
	// console.log('get paths data', assetContext.getAssetPaths());
	 	 
	},5000);
	 */
	 
};
   
 
 PV.toolCatalog.register(def);
 

 })(window.PIVisualization)