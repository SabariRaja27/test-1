/*
*Author : M.SabariRaja
*Date Created: 30-March-2016
*Description: Angularjs  directive for check box. 
*
*/
'use strict';
reachApp.directive('vmCheckBox',['$timeout', '$rootScope', 'store','underscore', function ($timeout, $rootScope, store, _){
	return{
		restict: 'E',
		scope:{
			ngModel:'=',
			controlId:'@',
			ngRequired: '@',
			type:'@',
			isMultiple: '@',
			buttonAllignment: '@',
			value:'@',
			validationName: '@',
			sourceUrl:'@',
			sourceObj: '@'
		},		
		controller:['$scope', '$http', function ($scope, $http){
	           $scope.items = [];
	            if ($scope.sourceUrl != undefined) {
	                //set the checkbox button json url
	                var urlPath = $scope.sourceUrl;
	                //to get all checkbox data from urlPath
	                return $http({ method: 'GET', url: urlPath }).
	                    success(function (data, status, headers, config) { 
	                    		//create a variable JSONObj
	                    		var JSONObj = {};
		                    	JSONObj = typeof data[$scope.sourceObj] == "string" ? JSON.parse(data[$scope.sourceObj]) : data[$scope.sourceObj];
		                    	//filter JSONObj to get data with Status = true
		                    	var ActiveObj = _.filter(JSONObj,function(item){
		                    		return item.Status == true;
		                    	 });
		                        //enable/disable ddl on page load - ends
		                        return $scope.items = ActiveObj;
	                       
	                    })
	                    //is there any error in retrieving checkbox data
	                    error(function (data, status, headers, config) {
	                        console.log("error retrieving " + $scope.masterName + " details");
	                    });
	            }
	        } ],
	    //template for checkbox directive
		templateUrl: 'app/common/view/directiveTemplates/checkbox/checkbox.html',
		
		link: function ( $scope, element, attrs, controller )
        {
        $('input:visible:enabled:first').focus();
          element.click(function () {
        	  $scope.ngModel = [];
        	//if multiple select is diasbled
        	  if($scope.isMultiple != "true" && $scope.isMultiple != undefined)
        		{    
        		  	$scope.ngModel = null;
        			//on change event making the older checked data as false
        			$('input[type="checkbox"]').on('change', function(e)
        			 {	
        					if(this.id === $scope.controlId){
            			 		//clearing the check box on click of another option
            			 		$('input[type=checkbox][id='+"'"+$scope.controlId+"'"+']:checked').not(this).prop('checked', false);
            			 		//saving the selected value to the scope variable
            			 		$scope.ngModel =$("#div_checkbox_"+$scope.controlId +" input[type='checkbox']:checked").val() ;
            			 	}
        			 });
        		}
        		else {    
        			if($('input[type=checkbox][id='+"'"+$scope.controlId+"'"+']:checked').length > 0) {
        				$('input[type=checkbox][id='+"'"+$scope.controlId+"'"+']:checked').each(function() 
        	        	{  
        	        		//push the checked data to array
        	            	$scope.ngModel.push($(this).val());
        	      		});
        			}
        			else {
        				$scope.ngModel = null;
        			}
        			
        			
        		}
          });
        }
	};
}]);