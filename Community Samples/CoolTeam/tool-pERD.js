window.PIVisualization = window.PIVisualization || {};
(function (PV) {
 'use strict';
 var def = {
	 typeName: 'pERD',
	 displayName: 'pERD List',
	 iconUrl: 'Scripts/app/editor/tools/ext/Icons/LinkedCubes.png',
	 inject: ['$rootScope','$http','$state', '$stateParams'],
	 init: init
 };
 
 function init($rootScope, scope, elem, $http, $state, $stateParams) {  
	
	$rootScope.ERDData = {
		selectedServer: {},
		servers: [],
		selectedDatabase: {},
		databases: [],
		
		template: '',
		name: '',
		root: '',
		
		elements: [],
		addToExisting: false
	};

	var _piwebapiurl  = PV.ClientSettings.PIWebAPIUrl.replace(/\/?$/, '/'); 
	
	$http.get(_piwebapiurl + 'assetservers', {withCredentials: true})
		.success(function(data, status, headers, config, statusText){
			data.Items.forEach(function(element){
				$rootScope.ERDData.servers.push({Name: element.Name, WebId: element.WebId});
			});
			
			$rootScope.ERDData.selectedServer = $rootScope.ERDData.servers[0];
			GenerateDatabases();
		});
	
	
	$rootScope.ERDData.serverSelect = function(){
		GenerateDatabases();
	}
	
	
	$rootScope.ERDData.databaseSelect = function(){
		/*
		console.log("Selected Database:");
		console.log($rootScope.ERDData.selectedDatabase);
		*/		
	}
	
	$rootScope.ERDData.deleteCurrentRow = function(index) {
		$rootScope.ERDData.elements.splice(index,1);
	}
	
	$rootScope.ERDData.selectedRow = function(element) {
		$stateParams.asset = element.Path;
		$state.go($state.current, $stateParams);
	}
	
	$rootScope.ERDData.executeQuery = function(){	
		if($rootScope.ERDData.selectedDatabase){
			var extraparams = '';
			if($rootScope.ERDData.name && $rootScope.ERDData.template){
				extraparams = '&nameFilter='+$rootScope.ERDData.name+'&templateName='+$rootScope.ERDData.template;
			}
			else if($rootScope.ERDData.name){
				extraparams = '&nameFilter='+$rootScope.ERDData.name
			}
			else if($rootScope.ERDData.template){
				extraparams = '&templateName='+$rootScope.ERDData.template;
			}
		
			// Delete existing rows if add to existing isn't checked		
			if(!$rootScope.ERDData.addToExisting){
				$rootScope.ERDData.elements = []; 
			}		
		
			if($rootScope.ERDData.root){
				//batch request is probably better but would require the ability to POST
				var rooturl = _piwebapiurl + 'elements?path=\\\\'+$rootScope.ERDData.selectedServer.Name+'\\'+$rootScope.ERDData.selectedDatabase.Name+'\\'+$rootScope.ERDData.root
				$http.get(rooturl, {withCredentials: true})
					.success(function(rootdata, rootstatus, rootheaders, rootconfig, rootstatusText){
						var elementurl = _piwebapiurl + 'elements/'+rootdata.WebId+'/elements?searchFullHierarchy=true' + extraparams;						
						$http.get(elementurl,{withCredentials: true})
							.success(function(data, status, headers, config, statusText){
								if(data.Items.length > 0){
									data.Items.forEach(function(Element)
									{
										$rootScope.ERDData.elements.push(Element);
									});
									removeDuplicates();
								}
								else{
									alert("No elements found");
								}
							});
					})
					.error(function(response){
						alert(response.Errors[0]);	
					});
			}
			else{
				var elementurl = _piwebapiurl + 'assetdatabases/'+$rootScope.ERDData.selectedDatabase.WebId+'/elements?searchFullHierarchy=true' + extraparams;
				$http.get(elementurl, {withCredentials: true})
					.success(function(data, status, headers, config, statusText){
						if(data.Items.length > 0){
							data.Items.forEach(function(Element)
							{
								$rootScope.ERDData.elements.push(Element);
							});
							removeDuplicates();
						}
						else{
							alert("No elements found");
						}					
					});
			}		
		}
		else{
			alert("Please select a server and database");
		}
	}
	
	var removeDuplicates = function(){
		//remove duplicates if we are adding to existing
		if($rootScope.ERDData.addToExisting){
			//See explanation at: http://stackoverflow.com/a/9229821/380415
			var seen = {};
			var out = [];
			var len = $rootScope.ERDData.elements.length;
			var j = 0;
			for(var i = 0; i < len; i++) {
				 var item = $rootScope.ERDData.elements[i];
				 if(seen[item.Id] !== 1) {
					   seen[item.Id] = 1;
					   out[j++] = item;
				 }
			}
			$rootScope.ERDData.elements = out;
		}
	}
	
	var GenerateDatabases = function(){
	 $rootScope.ERDData.databases = [];
	 $http.get(_piwebapiurl + 'assetservers/'+$rootScope.ERDData.selectedServer.WebId+'/assetdatabases', {withCredentials: true})
		.success(function(data, status, headers, config){
			data.Items.forEach(function(element){
				$rootScope.ERDData.databases.push({Name: element.Name, WebId: element.WebId});
			});
			
			if($rootScope.ERDData.databases.length > 0){
				$rootScope.ERDData.selectedDatabase = $rootScope.ERDData.databases[0];
			}
		});
	}
};
	
 
 PV.toolCatalog.register(def);
 

 })(window.PIVisualization)