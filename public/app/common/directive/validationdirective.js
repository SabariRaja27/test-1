/*
Author : Swathi
Date Created: 27-March-2015
Description: Generic Form Validation Directives  ngformvalidate, ngvalidate
1) Add novalidate, ngformvalidate  directive and name attribute to form element like below 
ex:  <form name="userForm" data-ng-controller="userCtrl" data-ng-submit="submitUserForm()" novalidate ngformvalidate> 

2) Add ng-required, data-controlname, ngvalidate to elements which needs to be validated. sample is shown below. 
ex: <input type="text" name="username" data-ng-model="user.username" placeholder="User Name" ng-required="true" 
data-controlname="User Name" ngvalidate data-ng-minlength="3" data-ng-maxlength="10" /> 
Depending on the elements, data-ng-minlength, data-ng-maxlength, data-ng-pattern can be added to form controls.

For an element to get validated and display error message, the below three fields are mandatory.
ng-required = true -- required attribute
data-controlname  ---> this is used to populate error message format. This should be added for all elements irrespective of ng-required attribute
ngvalidate --> directive name
**name attribute is mandatory for all elements ie; form, input, select

3)ngdropvalidate directive is for vm-ui-select2 element only
vm-ui-select2 should have properties data-controlname,  class="required drop-required", ngdropvalidate

4) for Date elements add below properties
class="date-required" name="txtDOB_user" ng-required="true" data-controlname="Date of Birth" ngvalidate
*/

'use strict';

reachApp.directive('ngvalidate', function () {

    //common function to hide error messages on click or tab event
    function HideErrorMessagesOnClickorTab(element, domEl) {
        if (element.hasClass('date-required')) {
            if (angular.element(domEl).closest('p').next().hasClass("error")) {
                angular.element(domEl).closest('p').next().addClass("ng-hide");
                angular.element(domEl).css("border-color", "#cccccc");
            }
        } else {
            if (angular.element(domEl).next().hasClass("error")) {
                angular.element(domEl).next().addClass("ng-hide");
                angular.element(domEl).css("border-color", "#cccccc");
                if (angular.element(domEl).hasClass("vmdropdown")) {
                    angular.element(domEl).find('a.select2-choice').css("border-color", "#cccccc");
                    angular.element(domEl).find('ul.select2-choices').css("border-color", "#cccccc");
                }
            }
            else if (angular.element(domEl).find('span.error') != undefined) {
                angular.element(domEl).find('span.error').addClass("ng-hide");
                angular.element(domEl).parent().find('.ta-editor').css("border-color", "#cccccc");
                //applied condition not to show message for login controls
                if (angular.element(domEl).hasClass('show-only-alert')) {
                    angular.element(domEl).css("border-color", "#cccccc");
                }
            }
        }
    }

    //ngvalidate directive should be specified for fields that require validation to be done
    return function (scope, element, attrs) {
        //dom element
        var domEl = element[0];
        //on click of control, hiding the error message ie, add class of ng-hide
        element.bind("click", function () {
            HideErrorMessagesOnClickorTab(element, domEl);
        });
        //on Keydown, on Tab, hide the error messages
        element.bind("keydown", function (e) {
            //on tab, hide the error messages
            if (e.keyCode == 9) {
                HideErrorMessagesOnClickorTab(element, domEl);
            }
        });
        //on click of mouseleave, check the validation and show the error message
        element.bind("blur", function () {
            var ngDomElem = angular.element(domEl);
            var invalid = false;
            var controlName = ngDomElem.attr("data-controlname") != undefined ? ngDomElem.attr("data-controlname") : ngDomElem.attr("name");
            //set the error message for the invalid's
            var error_msg = "";
            if (element.hasClass("ng-invalid-required")) {
                error_msg = controlName + ' is required.'; invalid = true;
            }
            if (element.hasClass("ng-invalid-date")) {
                error_msg = controlName + ' is invalid date.'; invalid = true;
            }
            if (element.hasClass("ng-invalid-url")) {
                error_msg = controlName + ' is invalid url.'; invalid = true;
            }
            if (element.hasClass("ng-invalid-email")) {
                error_msg = 'Invalid ' + controlName; invalid = true;
            }
            if (element.hasClass("ng-invalid-minlength")) {
                var min = ngDomElem.attr("data-ng-minlength");
                error_msg = 'Minimum ' + min + ' characters required.'; invalid = true;
            }
            if (element.hasClass("ng-invalid-maxlength")) {
                var max = ngDomElem.attr("data-ng-maxlength");
                error_msg = 'Maximum ' + max + ' characters required.'; invalid = true;
            }
            if (element.hasClass("ng-invalid-pattern")) {
                if (controlName == "Phone Number") {
                    error_msg = 'Please enter 10 digit valid Phone number';
                }
                else if (controlName == "New Password") {
                    error_msg = 'Password should contain minimum 8 characters,atleast one alphabet(both Uppercase and Lowercase),one number and one special character';
                }
                else {
                    error_msg = 'Invalid ' + controlName;
                }
                invalid = true;
            }
            if (element.hasClass("ng-invalid-match")) {
                if (element.hasClass("cmp-password") && ngDomElem[0].value == "") {
                    error_msg = controlName + ' is required.'; invalid = true;
                } else {
                    error_msg = controlName + ' doesn\'t match'; invalid = true;
                }
            }
            //don't show the error messages on blur if the form is not submitted
            if (invalid && !element.hasClass("ng-pristine ng-untouched")) {
                var elementName = ngDomElem.attr("name");
                //for vm-ui-select elements
                if (angular.element("#" + elementName).hasClass('vmdropdown')) {
                    if (!angular.element("#" + elementName).next().hasClass("error")) {
                        angular.element(angular.element("#" + elementName).find('a')).css({
                            'border-color': 'red',
                            'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)'
                        });
                        angular.element("#" + elementName).after('<span class="error">&nbsp;&nbsp;*&nbsp;' + error_msg + '</span>');
                    } else {
                        angular.element(angular.element("#" + elementName).find('a')).css({
                            'border-color': 'red',
                            'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)'
                        });
                        angular.element("#" + elementName).next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + error_msg;
                        angular.element("#" + elementName).next().removeClass("ng-hide");
                    }
                }
                else {
                    //for input types
                    if (!ngDomElem.next().hasClass("error")) {
                        if (element.hasClass('date-required')) {
                            ngDomElem.css("border-color", "red");
                            ngDomElem.closest('p').after('<span class="error">&nbsp;&nbsp;*&nbsp;' + error_msg + '</span>');
                        }
                        else if (ngDomElem.attr('text-angular') != undefined) {
                            ngDomElem.find('.ta-editor').css("border-color", "red");
                            ngDomElem.after('<span class="error">&nbsp;&nbsp;*&nbsp;' + error_msg + '</span>');
                        }
                        else {
                            ngDomElem.css("border-color", "red");
                            //applied condition not to show message for login controls
                            if (!ngDomElem.hasClass('show-only-alert')) {
                                ngDomElem.after('<span class="error">&nbsp;&nbsp;*&nbsp;' + error_msg + '</span>');
                            }
                        }

                    } else {
                        if (element.hasClass('date-required')) {
                            ngDomElem.css("border-color", "red");
                            ngDomElem.closest('p').next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + error_msg;
                            ngDomElem.closest('p').next().removeClass("ng-hide");
                        }
                        else if (ngDomElem.attr('text-angular') != undefined) {
                            ngDomElem.find('.ta-editor').css("border-color", "red");
                            ngDomElem.next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + error_msg;
                            ngDomElem.next().removeClass("ng-hide");
                        }
                        else {
                            ngDomElem.css("border-color", "red");
                            //applied condition not to show message for login controls
                            if (!ngDomElem.hasClass('show-only-alert')) {
                                ngDomElem.next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + error_msg;
                                ngDomElem.next().removeClass("ng-hide");
                            }
                        }
                    }
                }
            }
        });
    };
})
.directive('ngdropvalidate', function () {

    //ngdropvalidate directive should be specified for fields that require validation for UI select elements to be done
    return function (scope, element, attrs) {
        //dom element
        var domEl = element[0];
        //on change event of control, hiding the error message ie, add class of ng-hide
        scope.$on(attrs.controlId + '_ChangeEvent', function (event, args) {
            //don't show the error messages on blur if the form is not submitted
            if (!element.hasClass("ng-pristine ng-untouched")) {
                if (args != undefined) {
                    angular.element(domEl).removeClass('required');
                    angular.element(angular.element(domEl).find('a')).css({
                        'border-color': '#aaa',
                        'box-shadow': 'inset 0 4px 5px rgba(0, 0, 0, .15)'
                    });
                    angular.element(domEl).next().addClass("ng-hide")
                }
                else {
                    angular.element(domEl).addClass('required');
                    angular.element(angular.element(domEl).find('a')).css({
                        'border-color': 'red',
                        'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)'
                    });
                    var error_msg = attrs.controlId + ' is required.';
                    if (!angular.element(domEl).next().hasClass("error")) {
                        angular.element(domEl).after('<span class="error">&nbsp;&nbsp;*&nbsp;' + error_msg + '</span>');
                    } else {
                        angular.element(domEl).next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + error_msg;
                    }
                    angular.element(domEl).next().removeClass("ng-hide");
                }
            }
        });
    };
})
.directive('ngformvalidate', function () {debugger

    //a common function to attach error message to dom element
    function appendErrorMessageToElement(domEl, ctrl, errmsg) {
        //for vm-ui-select elements
        if (angular.element("#" + ctrl.$name).hasClass('vmdropdown')) {
            if (!angular.element("#" + ctrl.$name).next().hasClass("error")) {
                angular.element(angular.element("#" + ctrl.$name).find('a')).css({
                    'border-color': 'red',
                    'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)'
                });
                angular.element(angular.element("#" + ctrl.$name).find('ul')).css({
                    'border-color': 'red',
                    'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)'
                });
                angular.element("#" + ctrl.$name).after('<span class="error">&nbsp;&nbsp;*&nbsp;' + errmsg + '</span>');
            } else {
                angular.element(angular.element("#" + ctrl.$name).find('a')).css({
                    'border-color': 'red',
                    'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)'
                });
                angular.element(angular.element("#" + ctrl.$name).find('ul')).css({
                    'border-color': 'red',
                    'box-shadow': 'inset 0 1px 1px rgba(0, 0, 0, 0.075)'
                });
                angular.element("#" + ctrl.$name).next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + errmsg;
                angular.element("#" + ctrl.$name).next().removeClass("ng-hide");
            }
        }
        else {debugger
            //for input types
            if (!angular.element(domEl.elements[ctrl.$name]).next().hasClass("error") && !angular.element(domEl.elements[ctrl.$name]).closest('p').next().hasClass("error")) {
                if (angular.element(domEl.elements[ctrl.$name]).hasClass('date-required')) {
                    angular.element(domEl.elements[ctrl.$name]).css("border-color", "red");
                    angular.element(domEl.elements[ctrl.$name]).closest('p').after('<span class="error">&nbsp;&nbsp;*&nbsp;' + errmsg + '</span>');
                }
                else if (angular.element(domEl.elements[ctrl.$name]).parent().attr('text-angular') != undefined) {
                    angular.element(domEl.elements[ctrl.$name]).parent().find('.ta-editor').css("border-color", "red");
                    angular.element(domEl.elements[ctrl.$name]).after('<span class="error">&nbsp;&nbsp;*&nbsp;' + errmsg + '</span>');
                }
                /* --- By Sabari -- */
                //This condition is used to display the error message for checkbox inputs. 
                else if(angular.element(domEl.elements[ctrl.$name]).attr('type') != undefined && angular.element(domEl.elements[ctrl.$name]).attr('type') == 'checkbox') {
                	angular.element(domEl.elements[ctrl.$name]).css("border-color", "red");
                    if (!angular.element(domEl.elements[ctrl.$name]).hasClass('show-only-alert')) {
                       
                    	var checkboxId="#div_checkbox_"+angular.element(domEl.elements[ctrl.$name]).attr('name');
                        $(checkboxId).next().remove();
                        $(checkboxId).after('<span class="error">*&nbsp;' + errmsg + '</span>');
                    }
                }
                else {
                    angular.element(domEl.elements[ctrl.$name]).css("border-color", "red");
                    if (!angular.element(domEl.elements[ctrl.$name]).hasClass('show-only-alert')) {
                        angular.element(domEl.elements[ctrl.$name]).after('<span class="error">&nbsp;&nbsp;*&nbsp;' + errmsg + '</span>');
                    }
                }

            } else {
                if (angular.element(domEl.elements[ctrl.$name]).hasClass('date-required')) {
                    angular.element(domEl.elements[ctrl.$name]).css("border-color", "red");
                    angular.element(domEl.elements[ctrl.$name]).closest('p').next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + errmsg;
                    angular.element(domEl.elements[ctrl.$name]).closest('p').next().removeClass("ng-hide");
                }
                else if (angular.element(domEl.elements[ctrl.$name]).parent().attr('text-angular') != undefined) {
                    angular.element(domEl.elements[ctrl.$name]).parent().find('.ta-editor').css("border-color", "red");
                    angular.element(domEl.elements[ctrl.$name]).next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + errmsg;
                    angular.element(domEl.elements[ctrl.$name]).next().removeClass("ng-hide");
                }
                else {
                    angular.element(domEl.elements[ctrl.$name]).css("border-color", "red");
                    if (!angular.element(domEl.elements[ctrl.$name]).hasClass('show-only-alert')) {
                        angular.element(domEl.elements[ctrl.$name]).next()[0].innerHTML = '&nbsp;&nbsp;*&nbsp;' + errmsg;
                        angular.element(domEl.elements[ctrl.$name]).next().removeClass("ng-hide");
                    }
                }
            }
        }
    }

    //ngformvalidate - this directive is specified for form attribute only which performs validation of form and show error messages
    return function (scope, element, attrs) {debugger
        //dome element
        var domEl = element[0];
        //form element name
        var curFormName = domEl.name;

        //on form submit - do validation and show messages
        element.bind("submit", function () {
            var msg = "";
            //get the form element scope to access errors
            var frmElementScope = angular.element(domEl).scope()[domEl.name];

            //loop all form.$error.required object and show error messages
            angular.forEach(frmElementScope.$error.required, function (ctrl) {debugger
                /*Swathi(23-Jun-15)- Added below check to make validation work for multi select*/
                var items_selected = false;
                if (angular.element("#" + ctrl.$name).hasClass("ui-select-multiple")) {
                    items_selected = (angular.element("#" + ctrl.$name + " ul span.ui-select-match li").length == 0) ? false : true;
                }
                /*var controlName=null; ;
                for(var i=0; i<domEl.elements.length;i++) {
                	
                 if(domEl.elements[i].type == 'checkbox') {
                     controlName = ctrl.$name;
                     }
                    
                }
                if(!controlName) {
                 controlName = domEl.elements[ctrl.$name] != undefined ? (domEl.elements[ctrl.$name].getAttribute("data-controlname") != undefined ? 
                 domEl.elements[ctrl.$name].getAttribute("data-controlname") : ctrl.$name) : angular.element("#" + ctrl.$name).attr('data-controlname');
                 }*/
                /* --- By Mahesh --- */
                //
                if(domEl.elements[ctrl.$name] != undefined) {debugger
                	if(domEl.elements[ctrl.$name].length > 0) {
                		var controlName = ctrl.$name;
                	}
                	else{
                    	var controlName = domEl.elements[ctrl.$name] != undefined ? (domEl.elements[ctrl.$name].getAttribute("data-controlname") != undefined ? domEl.elements[ctrl.$name].getAttribute("data-controlname") : ctrl.$name) : angular.element("#" + ctrl.$name).attr('data-controlname');
                    }
                }else{
                	var controlName = domEl.elements[ctrl.$name] != undefined ? (domEl.elements[ctrl.$name].getAttribute("data-controlname") != undefined ? domEl.elements[ctrl.$name].getAttribute("data-controlname") : ctrl.$name) : angular.element("#" + ctrl.$name).attr('data-controlname');
                }
                /* --- By Mahesh end--- */
                //var controlName = domEl.elements[ctrl.$name] != undefined ? (domEl.elements[ctrl.$name].getAttribute("data-controlname") != undefined ? 
                //	domEl.elements[ctrl.$name].getAttribute("data-controlname") : ctrl.$name) : angular.element("#" + ctrl.$name).attr('data-controlname');
                if (ctrl.$error.required && !items_selected) {
                    //end
                    var error_msg = controlName + ' is required.';
                    msg += error_msg + "\r";
                    appendErrorMessageToElement(domEl, ctrl, error_msg);
                }
            });

            //            //Custom validation for ui-select element
            //            angular.forEach(angular.element(domEl).find('.drop-required'), function (ctrl) {
            //                var controlName = ctrl.getAttribute("data-controlname");
            //                if (angular.element(ctrl).hasClass('required')) {
            //                    var error_msg = controlName + ' is required.';
            //                    msg += error_msg + "\r\n";
            //                    appendErrorMessageToElement(domEl, ctrl, error_msg);
            //                    angular.element(domEl).scope()[domEl.name].$valid = false;
            //                }
            //                else if (angular.element(domEl).scope()[domEl.name].$error.required != undefined) {
            //                    if (angular.element(domEl).scope()[domEl.name].$error.required.length > 0) {
            //                        angular.element(domEl).scope()[domEl.name].$valid = false;
            //                    }
            //                    else {
            //                        angular.element(domEl).scope()[domEl.name].$valid = true;
            //                    }
            //                }
            //            });

            //loop all form.$error.date object and show error messages
            angular.forEach(frmElementScope.$error.date, function (ctrl) {
                var controlName = domEl.elements[ctrl.$name].getAttribute("data-controlname");
                if (ctrl.$error.date) {
                    var error_msg = controlName + ' is invalid date.';
                    msg += error_msg + "\r\n";
                    appendErrorMessageToElement(domEl, ctrl, error_msg);
                }
            });


            //loop all form.$error.url object and show error messages
            angular.forEach(frmElementScope.$error.url, function (ctrl) {
                var controlName = domEl.elements[ctrl.$name].getAttribute("data-controlname");
                if (ctrl.$error.url) {
                    var error_msg = controlName + ' is invalid url.';
                    msg += error_msg + "\r\n";
                    appendErrorMessageToElement(domEl, ctrl, error_msg);
                }
            });

            //loop all form.$error.email object and show error messages
            angular.forEach(frmElementScope.$error.email, function (ctrl) {
                var controlName = domEl.elements[ctrl.$name].getAttribute("data-controlname");
                if (ctrl.$error.email) {
                    //var error_msg = controlName + ' is invalid email address.';
                    var error_msg = "Invalid email address";
                    msg += error_msg + "\r\n";
                    appendErrorMessageToElement(domEl, ctrl, error_msg);
                }
            });

            //loop all form.$error.minlength object and show error messages
            angular.forEach(frmElementScope.$error.minlength, function (ctrl) {
                var controlName = domEl.elements[ctrl.$name].getAttribute("data-controlname");
                var min = domEl.elements[ctrl.$name].getAttribute("data-ng-minlength");
                if (ctrl.$error.minlength) {
                    var error_msg = 'Minimum ' + min + ' characters allowed for ' + controlName;
                    msg += error_msg + "\r\n";
                    appendErrorMessageToElement(domEl, ctrl, error_msg);
                }
            });

            //loop all form.$error.maxlength object and show error messages
            angular.forEach(frmElementScope.$error.maxlength, function (ctrl) {
                var controlName = domEl.elements[ctrl.$name].getAttribute("data-controlname");
                var max = domEl.elements[ctrl.$name].getAttribute("data-ng-maxlength");
                if (ctrl.$error.maxlength) {
                    var error_msg = 'Maximum ' + max + ' characters allowed for ' + controlName;
                    msg += error_msg + "\r\n";
                    appendErrorMessageToElement(domEl, ctrl, error_msg);
                }
            });

            //loop all form.$error.pattern (regEx) object and show error messages
            angular.forEach(frmElementScope.$error.pattern, function (ctrl) {
                var controlName = domEl.elements[ctrl.$name].getAttribute("data-controlname");
                if (ctrl.$error.pattern) {
                    if (controlName == "Phone Number") {

                        var error_msg = 'Please enter 10 digit valid Phone number';
                    } else {

                        var error_msg = 'Pattern mismatch for ' + controlName;
                    }
                    msg += error_msg + "\r\n";
                    appendErrorMessageToElement(domEl, ctrl, error_msg);
                }
            });
            scope.$on('ValidateDocuments_Mandatory', function (e, i) {
                if (!i.isValid) {
                    msg += i.Message + "\r\n";
                    frmElementScope.$valid = false;
                }
            });
            scope.$broadcast('validateDocuments', frmElementScope);

            if (msg != "") {
                alert(msg);
            }
            return false;
        });
    };
});