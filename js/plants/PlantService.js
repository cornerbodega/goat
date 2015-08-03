countryApp.service('PlantService', function(){
    //var session = $http.get(php.sessionURL);
    this.plantObject = function(session)
    {
        var obj = {
            API: api,
            action: "sync_plant",
            sessionid : session             
        };
        return JSON.stringify(obj);
    };
    this.roomObject = function(session)
    { 
        var obj = {
            API: api,
            action: "sync_plant_room",
            sessionid : session
        };
        return JSON.stringify(obj);
    }
    this.derivative = function(session) // id?    
    {
        var obj = {
            API: api,
            action : "sync_plant_derivative",
            sessionid : session
        };
        return JSON.stringify(obj);
    }
    // INCOMPLETE!!!
});