
var php = 
{
    sessionURL: "php/db/get_session.php",
    locationURL : "php/db/get_location.php",
    actionURL: "php/db/action.php"
};
var api = "4.0";



countryApp.factory('ConnectFactory', function($http){
    return{
        session: function(callback){
            $http.get(php.sessionURL).success(callback);
        },
        location: function(callback){
            $http.get(php.locationURL).success(callback);
        },
        post: function(data, callback){
            $http({
                method: 'POST',
                url: php.actionURL,
                data: data,
                datatype: 'json',
            }).success(callback);
        }
    };
});
