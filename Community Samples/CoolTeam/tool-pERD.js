String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 

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
 
 /*
 var script_tag = document.createElement('script');  
 script_tag.setAttribute("type", "text/javascript");  
 script_tag.setAttribute("src", "https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/2.5.0/ui-bootstrap-tpls.min.js");  
 (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag); 
 
 var app = angular.module(APPNAME);
 console.log(app);

 app.requires.push('ui.bootstrap');
 */
	
 function init($rootScope, scope, elem, $http, $state, $stateParams) {  
	
	$rootScope.ERDData = {
		selectedServer: {},
		servers: [],
		selectedDatabase: {},
		databases: [],
		
		templates: [],
		template: '',
		
		categories: [],
		category: '',
		
		name: '',
		
		rootElements: [],
		root: {},
		rootSlashNeeded: false,
		rootString: '',
		
		elements: [],
		addToExisting: false
	};
	
	var t_dataSource = new kendo.data.DataSource({
		transport: {
			read: function (e) {
				// on success
				e.success($rootScope.ERDData.templates);
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			create: function (e) {
				// save data item to the original datasource
				$rootScope.ERDData.templates.push(e.data);
				// on success
				e.success(e.data);
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			update: function (e) {
				/*
				// locate item in original datasource and update it
				sampleData[getIndexById(e.data.ProductID)] = e.data;
				// on success
				e.success();
				// on failure
				//e.error("XHR response", "status code", "error message");
				*/
			},
			destroy: function (e) {
				// locate item in original datasource and remove it
				$rootScope.ERDData.templates.splice($rootScope.ERDData.templates.length-1);
				// on success
				e.success();
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			error: function (e) {
                    // handle data operation error
                    alert("Status: " + e.status + "; Error message: " + e.errorThrown);
			},
		}
	});
	$('#input-template').kendoComboBox({
			dataSource: t_dataSource,
			placeholder: "*"
		})
		.closest(".k-widget")
		.attr("id", "template_wrapper");
	var c_dataSource = new kendo.data.DataSource({
		transport: {
			read: function (e) {
				// on success
				e.success($rootScope.ERDData.categories);
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			create: function (e) {
				// save data item to the original datasource
				$rootScope.ERDData.categories.push(e.data);
				// on success
				e.success(e.data);
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			update: function (e) {
				/*
				// locate item in original datasource and update it
				sampleData[getIndexById(e.data.ProductID)] = e.data;
				// on success
				e.success();
				// on failure
				//e.error("XHR response", "status code", "error message");
				*/
			},
			destroy: function (e) {
				// locate item in original datasource and remove it
				$rootScope.ERDData.categories.splice($rootScope.ERDData.categories.length-1);
				// on success
				e.success();
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			error: function (e) {
                    // handle data operation error
                    alert("Status: " + e.status + "; Error message: " + e.errorThrown);
			},
		}
	});	
	$('#input-category').kendoComboBox({
			dataSource: c_dataSource,
			placeholder: "*"
		})
		.closest(".k-widget")
		.attr("id", "template_wrapper");
	var r_dataSource = new kendo.data.DataSource({
		transport: {
			read: function (e) {
				// on success
				e.success($rootScope.ERDData.rootElements);
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			create: function (e) {
				// save data item to the original datasource
				$rootScope.ERDData.rootElements.push(e.data);
				// on success
				e.success(e.data);
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			update: function (e) {
				/*
				// locate item in original datasource and update it
				sampleData[getIndexById(e.data.ProductID)] = e.data;
				// on success
				e.success();
				// on failure
				//e.error("XHR response", "status code", "error message");
				*/
			},
			destroy: function (e) {
				// locate item in original datasource and remove it
				$rootScope.ERDData.rootElements.splice($rootScope.ERDData.rootElements.length-1);
				// on success
				e.success();
				// on failure
				//e.error("XHR response", "status code", "error message");
			},
			error: function (e) {
                    // handle data operation error
                    alert("Status: " + e.status + "; Error message: " + e.errorThrown);
			},
		}
	});
	var autocomplete = $("#input-root").kendoAutoComplete({
		dataSource: r_dataSource,
		dataTextField: "Path",
		filter: "contains",
		select: function(e){
			//add a slash after the selection
			console.log(e.item);
			//if(e.item
			$rootScope.ERDData.rootSlashNeeded = true;
		}
	}).data("kendoAutoComplete");
	
	var _piwebapiurl  = PV.ClientSettings.PIWebAPIUrl.replace(/\/?$/, '/'); 
	
	$http.get(_piwebapiurl + 'assetservers', {withCredentials: true})
		.success(function(data, status, headers, config, statusText){

			data.Items.forEach(function(element){
				$rootScope.ERDData.servers.push({Name: element.Name, WebId: element.WebId});
			});		
			
			$rootScope.ERDData.selectedServer = $rootScope.ERDData.servers[0];
		});
	
	$rootScope.$watch('ERDData.selectedServer',function(){
		if(!jQuery.isEmptyObject($rootScope.ERDData.selectedServer)){
			GenerateDatabases();
		}
	});
	
	$rootScope.$watch('ERDData.selectedDatabase', function(){
		if(!jQuery.isEmptyObject($rootScope.ERDData.selectedDatabase)){
			$rootScope.ERDData.rootString = '';
			$rootScope.ERDData.root = {};
			
			GenerateTemplatesAndCategories();
			GenerateRootElements(false, $rootScope.ERDData.selectedDatabase.WebId);
		}
	});
	
	$('#input-root').focusin(function(){
		autocomplete.search();
	});
	
	$rootScope.ERDData.rootChanged = function(oldERDData){	
		var oldval = oldERDData.rootString;
		console.log($rootScope.ERDData.rootSlashNeeded);
		if(oldval && oldval.length > $rootScope.ERDData.rootString.length){
			//characters deleted
			if($rootScope.ERDData.rootString.length == 0){
				GenerateRootElements(false, $rootScope.ERDData.selectedDatabase.WebId);
			}
			else{
				if(oldval.slice(-1) == '\\'){
					//if a slash was deleted
					var rs = $rootScope.ERDData.rootString;
					var lastSlash = rs.lastIndexOf("\\");
					
					//did we delete everything but the database root element?
					if(lastSlash > 0){
						//no, get the element by path
						var path = rs.slice(0,lastSlash);
						path = "\\\\" + $rootScope.ERDData.selectedServer.Name + "\\" + $rootScope.ERDData.selectedDatabase.Name + "\\" + path;
						var url = _piwebapiurl + "elements?path=" + path;
						console.log(url);
						$.ajax({
							url: url,
							type: "GET",			
							xhrFields: {
							  withCredentials: true
							}
						})
						.done(function(data){
							GenerateRootElements(true, data.WebId);
						});
					}
					else{
						//yes, generate the list of database root elements
						GenerateRootElements(false, $rootScope.ERDData.selectedDatabase.WebId);
					}
				}
			}
		}
		else{
			//characters added			
			if($rootScope.ERDData.rootSlashNeeded){
				$rootScope.ERDData.rootString += "\\";
				$rootScope.ERDData.rootSlashNeeded = false;
			}

			$rootScope.ERDData.rootString = $rootScope.ERDData.rootString.replaceAll('/','\\');
			var rs = $rootScope.ERDData.rootString;
			
			if(rs.slice(-1) == '\\'){	
				//generate new element list		
				$rootScope.ERDData.root = $rootScope.ERDData.rootElements.find(function(value){
					var rs_split = rs.split('\\');
					return value.Path.includes(rs_split[rs_split.length-2]);
				});
				
				GenerateRootElements(true, $rootScope.ERDData.root.WebId);
			}
		}
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
			if($rootScope.ERDData.name){
				extraparams += '&nameFilter=' + encodeURI($rootScope.ERDData.name);
			}
			if($rootScope.ERDData.template){
				extraparams += '&templateName=' + encodeURI($rootScope.ERDData.template);
			}
			if($rootScope.ERDData.category){
				extraparams += '&categoryName=' + encodeURI($rootScope.ERDData.category);
			}
			
			// Delete existing rows if add to existing isn't checked		
			if(!$rootScope.ERDData.addToExisting){
				$rootScope.ERDData.elements = []; 
			}		
		
			var endpoint;
			if(!jQuery.isEmptyObject($rootScope.ERDData.root)){
				endpoint = 'elements/'+$rootScope.ERDData.root.WebId;
			}
			else{
				endpoint = 'assetdatabases/'+$rootScope.ERDData.selectedDatabase.WebId;
			}
		

			var elementurl = _piwebapiurl + endpoint + '/elements?searchFullHierarchy=true' + extraparams;
			$http.get(elementurl, {withCredentials: true})
				.success(function(data, status, headers, config, statusText){
					if(data.Items.length > 0){	
						data.Items.forEach(function(Element)
						{
							$rootScope.ERDData.elements.push(Element);
						});
						removeDuplicates();
						//Seems like a good spot to call a build AF Element function for storing
						saveQuery();
					}
					else{
						alert("No elements found");
					}					
				});
				
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
		$('#input-database').prop('disabled',true);
		$('.connection-status').css('background-image','url("/PIVision/Images/loading.gif")');
		
		var webid = $rootScope.ERDData.selectedServer.WebId;
		
		$http.get(_piwebapiurl + 'assetservers/'+webid+'/assetdatabases', {withCredentials: true})
			.success(function(data, status, headers, config){
				$('.connection-status').css('background-image','url("Scripts/app/editor/tools/ext/Icons/green_ok.png")');
				
				//check to see if the user has read access to the database before adding it to the database list
				var promises = [];
				$.each(data.Items, function(k, v) {
					promises.push(validateDatabaseSecurity({Name: v.Name, WebId: v.WebId},v.Links.Security));
				});
				
				$.when.apply($, promises).then(function() {
					
					if($rootScope.ERDData.databases.length > 0){
						$rootScope.ERDData.selectedDatabase = $rootScope.ERDData.databases[0];
						$('#input-database').prop('disabled',false);
						$('.connection-status').prop('title', 'Connected');
					}
					else{
						$('.connection-status').prop('title', 'No available databases');
					}
				});
			})
			.error(function(error){
				//if we haven't switched servers since the request
				if(webid === $rootScope.ERDData.selectedServer.WebId){
					$('.connection-status').prop('title', error.Errors[0]);
					$('.connection-status').css('background-image',' url("/PIVision/Images/error_icon.png")');
				}
			});	
	}
	
	function validateDatabaseSecurity(element,url){	
		return $.ajax({
				url: url,
				xhrFields: {
				  withCredentials: true
			   }
			})
			.done(function(sdata){
				if(sdata.Items[0].CanRead){
					$rootScope.ERDData.databases.push(element);
				}
			})
			.fail(function(){
				
			});
	}
	
	
	// Build an AF Element to store the elements that are in the "Elements of Interest" table
	var saveQuery = function(){
		
		// Create an array of databases rather than a collection of dictionary objects
		var databasearray = [];
		var numDB = $rootScope.ERDData.databases.length;
		if (numDB > 0){
			for(var i = 0; i < $rootScope.ERDData.databases.length; i++){
				databasearray.push($rootScope.ERDData.databases[i].Name.toString());
			}

		};

		//Create the database if it doesn't exist yet
		if (databasearray.includes(ERD_Database) == false){
			var urlcreateDB = _piwebapiurl + 'assetservers/'+$rootScope.ERDData.selectedServer.WebId+'/assetdatabases';
			
			var data_DB = {
				"Name": ERDDB,
				"Description": "Database for storing the Elements of Interest Table in Coresight",
				"ExtendedProperties": {}
			};
			var data = JSON.stringify(data_DB);
			
			$.ajax({
				url: urlcreateDB,
				type: "POST",		
				contentType: "application/json",				
				data: data,			
				xhrFields: {
				  withCredentials: true
			    }
			})
			.done(function(data, textStatus, xhr){
				console.log("Success, created a ERD_DB_Store AF Database");
			})
			.fail(function(xhr, textStatus, errorThrown){
				console.log(xhr.status + '\n'  + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
			});
			//Update the databases variable
			 GenerateDatabases();
		}
		
		//Determine if there is an AF Element in the ERDDB
		
		//Get the WebId of the ERDDB
		var numDB = $rootScope.ERDData.databases.length;
		if (numDB > 0){
			for(var i = 0; i < $rootScope.ERDData.databases.length; i++){
				if($rootScope.ERDData.databases[i].Name == ERD_Database){
					var ERDDB_WebId = $rootScope.ERDData.databases[i].WebId;
				};
			};
		};
		
		
		//Use the WebId for the ERDDB to query for the Elements in the Database
		var ERDDB_Elements = [];
		var rooturl = _piwebapiurl + 'assetdatabases/' + ERDDB_WebId + '/elements';
		$http.get(rooturl, {withCredentials: true})
			.success(function(rootdata, rootstatus, rootheaders, rootconfig, rootstatusText){
				if(rootdata.Items.length > 0){
					rootdata.Items.forEach(function(Element){
						ERDDB_Elements.push(Element);
					});
					
					//Need to put this up here to ensure that ERDDB_Elements call has finished prior to moving on
					var indexElement = false;
					if (ERDDB_Elements.length != 0) {
						if (ERDDB_Elements[0].Name == ERD_Element_Store) {
							indexElement = true;
						};
					};
					
					//Create the Storage Element if it doesn't exist yet
					if(indexElement == false) {
						alert("We see you have no Element to store config data in, let me get that for you")
						var urlcreateElement = _piwebapiurl + 'assetdatabases/'+ ERDDB_WebId  + '/elements';

						var data_Element = {
							"Name": ERD_Element_Store,
							"Description": "An element which holds string attributes containing the saved elements of interest",
							"ExtendedProperties": {}
						}
						var data = JSON.stringify(data_Element);
						
						$.ajax({
							url: urlcreateElement,
							type: "POST",		
							contentType: "application/json",				
							data: data,			
							xhrFields: {
							  withCredentials: true
							}
						})
						.done(function(data, textStatus, xhr){
							console.log("Success");
						})
						.fail(function(xhr, textStatus, errorThrown){
							console.log(xhr.status + '\n'  + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
						});
					}
					
					//Get the WebID of the ERD Element Store
					var ERDDB_Element_WebId = ERDDB_Elements[0].WebId;
					
					//Get the Display ID from Coresight's URL
					var URLParams = document.URL.split("/");
					var ERD_Attribute = URLParams[6];
					
					//Get the Attributes on the ERD element
					var ERDDB_Attributes = [];
					$http.get(_piwebapiurl + 'elements/'+ ERDDB_Element_WebId +'/attributes', {withCredentials: true})
						.success(function(data, status, headers, config, statusText){
							data.Items.forEach(function(Element){
								ERDDB_Attributes.push(Element);
							});
							
							// Create an array of attributes rather than a collection of dictionary objects
							var attributearray = [];
							var numatt = ERDDB_Attributes.length;
							if (numatt > 0){
								for(var i = 0; i < numatt; i++){
									attributearray.push(ERDDB_Attributes[i].Name.toString());
								}
							};
							
							//Figure out if this Display already has an attribute on the element
							var indexAttribute = false;
							if (ERDDB_Attributes.length != 0) {
								if (attributearray.includes(ERD_Attribute)) {
									indexAttribute = true;
								}
							}
							
							//Create an attribute if it doesn't exist already
							if (indexAttribute == false) {
								var urlcreateAttribute = _piwebapiurl + 'elements/'+ ERDDB_Element_WebId  + '/attributes';

								var data_Attribute = {
									"Name": ERD_Attribute,
									"Description": "Holds the config string of the Elements of Interest",
									"Type": "String",
									"TypeQualifier": "",
									"DefaultUnitsName": ""
								}
								var data = JSON.stringify(data_Attribute);
								
								$.ajax({
									url: urlcreateAttribute,
									type: "POST",		
									contentType: "application/json",				
									data: data,			
									xhrFields: {
									  withCredentials: true
									}
								})
								.done(function(data, textStatus, xhr){
									console.log("Success");
								})
								.fail(function(xhr, textStatus, errorThrown){
									console.log(xhr.status + '\n'  + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
								});
							}
							
							//Get the attributes of the ERD Element 
							var url = _piwebapiurl + 'elements/'+ ERDDB_Element_WebId  + '/attributes';
							$.ajax({
								url: url,
								type: "GET",			
								xhrFields: {
								  withCredentials: true
								}
							})
							.done(function(data){
								ERDDB_Attributes = data;
							})
							.fail(function(xhr, textStatus, errorThrown){
								console.log(xhr.status + '\n'  + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
							});
							
							// Create an array of attributes rather than a collection of dictionary objects
							attributearray = [];
							numatt = ERDDB_Attributes.length;
							if (numatt > 0){
								for(var i = 0; i < numatt; i++){
									attributearray.push(ERDDB_Attributes[i].Name.toString());
								}
							};
							
							var attribute_WebId = null;
							//Get the attribute for this Display
							for (var i=0, n=ERDDB_Attributes.length; i<n; i++) {
								if (attributearray[i] == ERD_Attribute) {
									attribute_WebId = ERDDB_Attributes[i].WebId;
								}
							}
							var httprequesttype = "PUT";
							
							//figure out what's in the table
								var table = document.getElementById("ElementsOfInterestTable");
								var attvalue = "";
								
								//Borrowed from here: http://stackoverflow.com/questions/3072233/getting-value-from-table-cell-in-javascript-not-jquery
								setTimeout(function() {
									if (table.rows.length != 0){
										for (var r = 1, n = table.rows.length; r < n; r++) { //We start at row 1 and not 0 because the first row is the table headers
											for (var c = 1, m = table.rows[r].cells.length; c < m; c++) { //We start at column 1 and not 0 because the first column is the remove button
												var value = table.rows[r].cells[c].innerHTML;
												attvalue += value;
												attvalue += ";";
											}
										}
										//console.log(attvalue);
									}
									//Post this string to the Attribute value for Storage 
									var data_Attribute = {
										"Timestamp": "2017-01-01T01:00:00Z", //Arbitrary time selecting for post
										"Value": attvalue
									};
									var data = JSON.stringify(data_Attribute);
									
									var url = _piwebapiurl + 'attributes/'+ attribute_WebId  + '/value'

									$.ajax({
										url: url,
										type: httprequesttype,		
										contentType: "application/json",				
										data: data,			
										xhrFields: {
										  withCredentials: true
										}
									})
									.done(function(data, textStatus, xhr){
										console.log("Success");
									})
									.fail(function(xhr, textStatus, errorThrown){
										console.log(xhr.status + '\n'  + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
									});
								}, 100); //Giving the table a tenth of a second to load. Inelegant and time consuming but it works	
						});
				}
			})
			
			.error(function(response){
				alert(response.Errors[0]);	
			});
		
	}
	
	var GenerateTemplatesAndCategories = function(){
		if($rootScope.ERDData.selectedDatabase){
			$rootScope.ERDData.categories = [];
			$rootScope.ERDData.templates = [];
			
			//kendo combobox
			var t_cbx = $("#input-template").data("kendoComboBox");
			var c_cbx = $("#input-category").data("kendoComboBox");
		
			var url = _piwebapiurl + "assetdatabases/" + $rootScope.ERDData.selectedDatabase.WebId + "/elementcategories";
			$http.get(url, {withCredentials: true})
				.success(function(data, status, headers, config, statusText){
					data.Items.forEach(function(c){
						$rootScope.ERDData.categories.push(c.Name);					
					});
					c_cbx.dataSource.read();
					if($rootScope.ERDData.categories.length > 0){
						c_cbx.readonly(false);
					}
					else{
						c_cbx.readonly(true);
					}
				});
				
			url = _piwebapiurl + "assetdatabases/" + $rootScope.ERDData.selectedDatabase.WebId + "/elementtemplates";
			$http.get(url, {withCredentials: true})
				.success(function(data, status, headers, config, statusText){
					data.Items.forEach(function(t){
						$rootScope.ERDData.templates.push(t.Name);
					});				
					t_cbx.dataSource.read();	
					if($rootScope.ERDData.templates.length > 0){
						t_cbx.readonly(false);
					}
					else{
						t_cbx.readonly(true);
					}					
				});
		}
	}
	
	var GenerateRootElements = function(isElement, parentWebId){
		$rootScope.ERDData.rootElements = [];
		
		var url = _piwebapiurl + (isElement ? "elements/" : "assetdatabases/") + parentWebId + "/elements";

		$.ajax({
			url: url,
			type: "GET",			
			xhrFields: {
			  withCredentials: true
			}
		})
		.done(function(data, textStatus, xhr){
			data.Items.forEach(function(t){			
				//chopping off "\\<servername>\<database>\" -- 4 (slashes) + server name length + database name length
				var path = t.Path.slice(4 + $rootScope.ERDData.selectedServer.Name.length + $rootScope.ERDData.selectedDatabase.Name.length);
				
				$rootScope.ERDData.rootElements.push({Name: t.Name, WebId: t.WebId, Path: path});
			});
			autocomplete.dataSource.read();
			
			//show the next level of elements -- needs to be delayed to update
			if(isElement){
				setTimeout(function() { autocomplete.search(); }, 100);
			}
		})
		.fail(function(xhr, textStatus, errorThrown){
			console.log(xhr.status + '\n'  + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
		});
	}

	
	//On page load grab the Elements of Interest from last load
	
	//Get the Display ID from Coresight's URL
	var URLParams = document.URL.split("/");
	var VisionURL = URLParams[0] + "/" + URLParams[1] + "/" + URLParams[2] + "/" + URLParams[3];
	//window.alert(VisionURL + "/Scripts/app/editor/tools/ext/setup.json");
	var ERD_Attribute = URLParams[6];
	var ERD_Server;
	var ERD_Database = "ERD_DB_Store";
	var ERD_Element_Store = "ERD_Element_Store";
		
	var content;
	$.ajax({
		url: VisionURL + "/Scripts/app/editor/tools/ext/setup.json",
		type: "GET",	
		dataType: "JSON",		
		xhrFields: {
		  withCredentials: true
		}
	})
	.done(function(data, textStatus, xhr){
		content = data;
		ERD_Server = content.AFServer;
		//console.log(ERD_Server);

		//New Displays will have nothing to load up
		if (ERD_Attribute != "New") { 
			var url = _piwebapiurl + ("attributes/?path=\\\\" + ERD_Server + "\\" + ERD_Database + "\\" + ERD_Element_Store + "|" + ERD_Attribute);
			
			$.ajax({
				url: url,
				type: "GET",			
				xhrFields: {
				  withCredentials: true
				}
			})
			.done(function(data, textStatus, xhr){
				var WebId = data.WebId;
				var url = _piwebapiurl + ("attributes/" + WebId + "/value");
				
				$.ajax({
					url: url,
					type: "GET",			
					xhrFields: {
					  withCredentials: true
					}
				})
				.done(function(data, textStatus, xhr){
					var tabledata = data.Value.split(';');
					for (var i = 0; i < tabledata.length-1; i+=3){
						$rootScope.ERDData.elements.push({Name: tabledata[i], Description: tabledata[i+1], Path: tabledata[i+2]});
					};
				});
			});
		}
		
	})
	.fail(function(xhr, textStatus, errorThrown){
		console.log(xhr.status + '\n'  + textStatus + '\n' + errorThrown + '\n' + xhr.responseText + '\n');
	});

	

};
	
 
 PV.toolCatalog.register(def);
 

 })(window.PIVisualization)