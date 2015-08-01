
var php = 
{
    sessionURL: "php/db/get_session.php",
    destroyURL: "php/inventory/scheduleDestroy.php",
    adjustURL: "php/inventory/adjust.php",
    getInventory: "php/inventory/get_inventory.php",
    actionURL: "php/db/action.php"
};

countryApp.service('RequestObjectService', function(){
    var api = "4.0";
    //var session = $http.get(php.sessionURL);
    this.plantRoomObject = function(session)
    {
        var obj = {
            API: api,
            action: "sync_plant_room",
            sessionid : session             
        };
        console.log(JSON.stringify(obj));
        return JSON.stringify(obj);
    };
    this.inventoryRoomObject = function(session)
    { 
        var obj = {
            API: api,
            action: "sync_inventory_room",
            sessionid : session
        };
        return JSON.stringify(obj);
    }
    this.addPlantRoomObject = function(session,name,id,loc) // id?
    {
        var obj = {
            API: api,
            action : "plant_room_add",
            name : name,
            sessionid : session,
            id : id,
            location : loc
        };
        return JSON.stringify(obj);
    }
    this.addInventoryRoomObject = function(session,name,id,loc)
    {
        console.log("addinvobj "  + id);
        var obj = {
            API: api,
            action : "inventory_room_add",
            name : name,
            sessionid : session,
            id : id,
            location : loc
        };
        return JSON.stringify(obj);
    }
    this.removePlantRoomObject = function(session,id,loc) 
    {
        console.log("addinvobj "  + id);
        var obj = {
            API: api,
            action : "plant_room_remove",
            sessionid : session,
            id : id,
            location : loc
        };
        return JSON.stringify(obj);
    }
    this.removeInventoryRoomObject = function(session,id,loc) 
    {
        console.log("addinvobj "  + id);
        var obj = {
            API: api,
            action : "inventory_room_remove",
            sessionid : session,
            id : id,
            location : loc
        };
        return JSON.stringify(obj);
    }
});

countryApp.factory('ConnectFactory', function($http){
    return{
        session: function(callback){
            $http.get(php.sessionURL).success(callback);
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
