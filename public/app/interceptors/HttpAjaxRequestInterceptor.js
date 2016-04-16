/***
Http Request Interceptor to perform action during http request and http response.
The actions that are included are as below,
i) Introduce page level progress bar with the number requests that are processed in a page
ii) Handle JWT token authorization for each http request
--Add the interceptor in aap.config
*/
reachApp.factory( 'httpAjaxRequestInterceptor', ['$rootScope', '$q', '$window', '$location', 'store',function ( $rootScope, $q, $window, $location, store )
{
    var numRequests = 0;
    //var ajaxSpinner = $( "#spinnerModal" );
    var hideSpinner = function ( r )
    {
        if ( ! --numRequests )
        {
            $rootScope.httpRequestloading = false;
            //ajaxSpinner.hide();
        }
        return r;
    };
    return {
        'request': function ( config )
        {
            numRequests++;
            $rootScope.httpRequestloading = true;
            //ajaxSpinner.show();
            config.headers = config.headers || {};
            var authTokenFromLocalStorage = store.get('authtoken');
            if (authTokenFromLocalStorage != null) {
                config.headers["x-access-token"] = authTokenFromLocalStorage;
            }
            return config;
        },
        'response': function ( response )
        {
            //Check if the request is unauthorized based on the response from API controller
            if (response.data != undefined && response.data.aaData != undefined)
            {
                if (response.data.aaData.Message != undefined && response.data.aaData.Message == "Un Authorized Access. Access Token missing.")
                {
                    //Redirecting to 404 page if the request is unauthorized
                    $location.path('/404');
                    return $q.reject(hideSpinner(response));
                }
            }
            return hideSpinner(response);
        },
        'responseError': function ( response )
        {
            if ( response.status === 401 || response.status === 403 )
            {
                $location.path( '/' );
            }
            return $q.reject( hideSpinner( response ) );
        }
    };
} ]);