countryApp.service('RoomService', function(){
    var api = "4.0";
    //var session = $http.get(php.sessionURL);
    this.plantRoomObject = function(session)
    {
        var obj = {
            API: api,
            action: "sync_plant_room",
            sessionid : session             
        };
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
        var obj = {
            API: api,
            action : "inventory_room_remove",
            sessionid : session,
            id : id,
            location : loc
        };
        return JSON.stringify(obj);
    }
    this.modifyInventoryRoomObject = function(session,id,loc,name) 
    {
        var obj = {
            API: api,
            action : "inventory_room_modify",
            sessionid : session,
            id : id,
            location : loc,
            name : name
        };
        return JSON.stringify(obj);
    }
    this.modifyPlantRoomObject = function(session,id,loc,name) 
    {
        var obj = {
            API: api,
            action : "plant_room_modify",
            sessionid : session,
            id : id,
            location : loc,
            name : name
        };
        return JSON.stringify(obj);
    }
});