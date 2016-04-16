'use strict';
//http://plnkr.co/edit/octwC4BCuXLmRhHgLD8T?p=preview
reachApp.directive('vmUiSelect2', ['$timeout', '$rootScope', 'store','underscore', function ($timeout, $rootScope, store, _) {
    return {
        restict: 'E',
        //replace : true, //-> this will not work in this case.
        scope: {
            ngSelectModel: '=', //isolated scope property used
            controlId: '@',
            requiredField: '@',
            placeHolder: '@',
            isMultiple: '@',
            masterName: '@',
            isDisabled: '@',
            isDependent: '@',
            dependentColumn: '@',
            dependentDropdownId: '@',
            sourceUrl: '@', // source url
            sourceObj: '@', // object from the restult set
            sourceNameCol: '@',//source name column
            sourceCodeCol: '@', //source value column
            validationName: '@',
            useInternalPath:'@'
        },
        controller:['$scope', '$http', function ($scope, $http) { 
            $scope.items = [];
            if ($scope.sourceUrl != undefined) {
                //set the default url -- i.e., PROTON.API path as root
                var urlPath = $rootScope.vmuisettings.PROTONAPIURL + $scope.sourceUrl;
                if ($scope.useInternalPath != undefined && $scope.useInternalPath)
                {
                    //If data is from internal project neglect the PROTON.API root path
                    urlPath = $scope.sourceUrl;
                }                                
                return $http({ method: 'GET', url: urlPath }).
                    success(function (data, status, headers, config) { 
                    	if($scope.isMultiple==undefined)
                    	{
                    	    var JSONObj = {};
                    	    JSONObj = typeof data[$scope.sourceObj] == "string" ? JSON.parse(data[$scope.sourceObj]) : data[$scope.sourceObj];

                    	    //filter JSONObj to get data with Status = 1
                    	    var ActiveObj = _.filter(JSONObj,function(item){
                    	        return item.Status == true;
                    	    });
	                    		//loop through the data object
                    	    angular.forEach(ActiveObj, function (item) {
	                                //check whether sourceNameCol is not undefined and property exists
	                                if ($scope.sourceNameCol != undefined && item.hasOwnProperty($scope.sourceNameCol)) {
	                                    item.Name = item[$scope.sourceNameCol];
	                                }
	                                //check whether sourceCodeCol is not undefined and property exists
	                                if ($scope.sourceCodeCol != undefined && item.hasOwnProperty($scope.sourceCodeCol)) {
	                                    item.Code = item[$scope.sourceCodeCol];
	                                }
	                            });
                    		}
                    	else
                    		{
                    			var multiItems=[];
                    			//loop through the data object
                    			angular.forEach(ActiveObj, function (item) {
	                            	var multiitem={};
	                                //check whether sourceNameCol is not undefined and property exists
	                                if ($scope.sourceNameCol != undefined && item.hasOwnProperty($scope.sourceNameCol)) {
	                                    multiitem.Name = item[$scope.sourceNameCol];
	                                }
	                                //check whether sourceCodeCol is not undefined and property exists
	                                if ($scope.sourceCodeCol != undefined && item.hasOwnProperty($scope.sourceCodeCol)) {
	                                    multiitem.Code = item[$scope.sourceCodeCol];
	                                }
	                                
	                                if(item.status == true){
	                                if($scope.sourceNameCol == undefined && $scope.sourceCodeCol == undefined)
	                                	{
	                                    multiitem.Name = item.Name;
		                                	multiitem.Code = item.Code;
	                                	}
	                                multiItems.push(multiitem);
	                                }
	                            });
                    			ActiveObj = multiItems;
                    		}
                        
                        //remove data from the local storage and then save data in the local storage
                        store.remove($scope.masterName);
                        store.set($scope.masterName, ActiveObj);
                        //enable/disable ddl on page load - Starts
                        if (($scope.isDisabled == undefined || $scope.isDisabled == "false")) {
                            $scope.isDisabled = false;
                        }
                        else {
                            $scope.isDisabled = true;
                        }
                        //enable/disable ddl on page load - ends
                        return $scope.items = ActiveObj;
                    }).
                    error(function (data, status, headers, config) {
                        console.log("error retrieving " + $scope.masterName + " details");
                    });
            }
        } ],
        templateUrl: 'app/common/view/directiveTemplates/uiselect2/uiselect2.html',
        link: function ($scope, element, attrs, controller) {
            $scope.items = [];
            if ($scope.isDependent) { 
                $scope.$on($scope.dependentDropdownId + '_ChangeEvent', function (event, args) {
                    var localstoragedata = store.get($scope.masterName);
                    if (localstoragedata != null) {
                        var data = [];
                        if(args != undefined)
                    	{
                        	angular.forEach(localstoragedata, function (value, key) {
                        	    if (value[$scope.dependentColumn] == args.Code) {
                                    this.push(value);
                                }
                        	}, data);
                            //Added by ranjan: Onclick of edit to bind the dependent dropdown
                        	$scope.isDisabled = data.length == 0 ? true : false;
                        }
                        
                        else if(args == undefined && ($scope.isDisabled == undefined || $scope.isDisabled == false))
                    	{
                        	data = localstoragedata;
                    	}
                    }
                    $scope.$parent.$applyAsync(function () {
                        //Swathi(5-May-15): Remove ng-hide class and show placeholder as select for default select-chosen element
                        var defaultSelected = angular.element("#" + $scope.controlId + " a span.select2-chosen.ng-binding");
                        defaultSelected.removeClass("ng-hide");
                        defaultSelected[0].innerHTML = $scope.placeHolder;
                        $scope.ngSelectModel = "";
                        //end
                        //For clearing dropdown  - Starts
                        angular.element("#" + $scope.controlId).scope().$select.selected = undefined;
                        $timeout(function () {
                            angular.element("#" + $scope.controlId).removeClass('ng-invalid');
                        }, 100);
                        //For clearing dropdown  - Ends
                        if(($scope.isDisabled == undefined || $scope.isDisabled == false))
                        {
                            if ($rootScope.objdetails == undefined) {
                                $scope.isDisabled = true;
                            }
                            else {
                                $scope.isDisabled = data.length == 0 ? true : false;
                            }
                    	}
                        else
                    	{
                        	$scope.isDisabled = data.length == 0 ? true : false;
                    	}                        
                        $scope.items = data;
                        //$scope.$parent[$scope.masterName] = data;
                    });
                });
            }
            $scope.onChangeEvent = function (obj) {
            if($scope.isMultiple==undefined)
            	{
            	//Swathi(5-May-15): when item is selected in dropdown, set the below select2-chosen element
                var defaultSelected = angular.element("#" + $scope.controlId + " a span.select2-chosen.ng-binding");
                //ends
                if (obj != undefined) {
                    //resetting the ng-model value on change event
                    $scope.ngSelectModel = obj.Code;
                    //Swathi(5-May-15): set the innerhtml for select2-chosen element
                    defaultSelected[0].innerHTML = obj.Name;
                    $rootScope.objdetails = obj;
                } else {
                    //resetting the ng-model value on change event
                    $scope.ngSelectModel = "";
                    //Swathi(5-May-15): set the innerhtml for select2-chosen element and remove class ng-hide
                    defaultSelected[0].innerHTML = $scope.placeHolder;
                    defaultSelected.removeClass("ng-hide");
                    //For clearing dropdown  - Starts
                    angular.element("#" + $scope.controlId).scope().$select.selected = undefined;
                    $timeout(function () {
                        angular.element("#" + $scope.controlId).removeClass('ng-invalid');
                    }, 100);
                    $rootScope.objdetails = obj;
                    //For clearing dropdown  - Ends
                }
                //ends
            	}
            else
            	{
            		$scope.ngSelectModel=obj;
            	}
                $rootScope.$broadcast(attrs.controlId + '_ChangeEvent', obj);
            }

            //Added by ranjan: Onclick of edit to bind the dependent dropdown
            $rootScope.$on('Dropdown_BindEvent', function (e, i) {
                if (i.ControlID == $scope.controlId) {
                    $scope.onChangeEvent(i);
                }
            });

            //To forcefully set the dropdown list with Inactive object (i.e obj with Status = 0)
            $rootScope.$on('setValue_dropdown', function (e, i) {
                if (i.ddlName == $scope.controlId)
                {
                    var itemExists = false;
                    angular.forEach($scope.items, function (data) {
                        if (data.Code == i.ddlObj.Code)
                        {
                            itemExists = true;
                            return;
                        }
                    });
                    if (!itemExists)
                    {
                        $scope.items.push(i.ddlObj);
                    }
                }                
            });

            //To reset the dropdown value to only Active obj(i.e obj with Status = 1)
            $rootScope.$on('reset_dropdown', function (e, i) {
                if (i == $scope.controlId)
                {
                    //filter JSONObj to get data with Status = 1
                    var ActiveObj = _.filter($scope.items, function (item) {
                        return item.Status == true;
                    });
                    $scope.items = ActiveObj;
                }                
            });

            //To clear the dropdown value
            $rootScope.$on('clear_dropdown', function (e, i) {
                if (i == $scope.controlId) {
                    $timeout(function () {
                        var defaultSelected = angular.element("#" + $scope.controlId + " a span.select2-chosen.ng-binding");
                        //resetting the ng-model value on change event
                        $scope.ngSelectModel = '';
                        //Swathi(5-May-15): set the innerhtml for select2-chosen element and remove class ng-hide
                        defaultSelected[0].innerHTML = $scope.placeHolder;
                        defaultSelected.removeClass("ng-hide");
                        //For clearing dropdown  - Starts
                        angular.element("#" + $scope.controlId).scope().$select.selected = undefined;
                        $timeout(function () {
                            angular.element("#" + $scope.controlId).removeClass('ng-invalid');
                        }, 100);
                        //For clearing dropdown  - Ends
                        //Ranjan-- Added to remove the error message--start
                        if (defaultSelected.parent().parent().next().hasClass('error')) {
                            defaultSelected.parent().parent().next().remove();
                            defaultSelected.parent().css("border-color", "#cccccc");
                        }
                        //Ranjan-- Added to remove the error message--end
                    }, 0);
                }
            });
        }
    };

}]);