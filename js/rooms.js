"use strict";

countryApp.controller('RoomsController', ['$scope', '$http', '$filter', '$q', 'RequestObjectService', 'ConnectFactory', function(scope, http, filter, q, rq, cf) {
    //Input Booleans
    scope.toggleInputMenu = function(action){
        console.log(action);
        switch (action) {
            case 'add' :
                scope.showAddRoomInput = !scope.showAddRoomInput;
                break;
            case 'modify' :
                if (scope.selected !== false){
                    scope.showModifyRoomInput = !scope.showModifyRoomInput;
                }
                else {
                    scope.actionStatus = "Select a room, please.";
                    scope.showModifyRoomInput = false; 
                }
                break;
            case 'remove' :
                if (scope.selected !== false){
                    scope.showRemoveRoomInput = !scope.showRemoveRoomInput;
                }
                else {
                    scope.actionStatus = "Select a room, please.";
                    scope.showRemoveRoomInput = false; 
                }
                break;
            default :
                return false; // this shouldn't happen
        }
    }   
    

    // Get session Information before loading rooms
    cf.session(function(sessionData) { // Get Session Info
        scope.session = sessionData.sessionid;
        scope.email = sessionData.email;
        loadRooms();
    }); // end cf.session
    // Get Room List
    function loadRooms() { // Room View Functions
        // Empty selection 
        // and(for a clean reload)
        scope.selected = false;
        scope.showAddRoomInput = false;
        scope.showModifyRoomInput = false;
        scope.showRemoveRoomInput = false;
        // Get Inventory Rooms
        cf.post(rq.inventoryRoomObject(scope.session), function(inventoryRoomResponse) {
            // Get Plant Rooms
            cf.post(rq.plantRoomObject(scope.session), function(plantRoomResponse) {
                // Assign Plant and Inventory Room arrays to scope
                scope.inventoryRooms = removeDeleted(inventoryRoomResponse.inventory_room);
                scope.plantRooms = removeDeleted(plantRoomResponse.plant_room);
                // Save the license/location value returned from 
                // getting the room data - will need for modification actions
                scope.loc = scope.inventoryRooms[1].location;            
            }); // end plantRoom
        }); // end cf.inventoryRoom
    }; // end loadRooms

    // Modify Room
    scope.modifyRoom = function(){
        // Make sure the user has a room selected
        if (scope.selected === false){
            scope.actionStatus = "Please select a room."
            return false; // exit the function. Do not pass Go. 
        } else { 
            // We know a room is selected
            scope.actionStatus = false;
            // Is this a plant room or an inventory room?
            if (plantRoomSelected()){
                // this is a plant room
                // get modify plant room JSON/object
            }
            else {
                // this in an inventory room
                // get modify inventory room JSON/object

            }
        };
    }

    // Remove Room
    scope.removeRoom = function(){
        // Make sure the user has a room selected
        if (scope.selected === false){
            scope.actionStatus = "Please select a room."
            return false; // exit the function. Do not pass Go. 
        } else {
            // We know a room is selected
            scope.actionStatus = false;
            // Is this a plant room or an inventory room?
            if (plantRoomSelected()){
                // this is a plant room
                // get remove plant room JSON/object
                var removeRoomObj = rq.removePlantRoomObject(scope.session,scope.selected.roomid,scope.location);

            } // end this is a plant room 
            else 
            {
                // this is an inventory room
                // get the inventory plant remove JSON/object
                var removeRoomObj = rq.removeInventoryRoomObject(scope.session,scope.selected.roomid,scope.location);
            } // end this is an inventory room
            cf.post(removeRoomObj, function(removeRoomResponse){
                if (removeRoomResponse.success === 1){
                    scope.actionStatus = "Success! " + scope.selected.name + " has been removed.";
                    // turn off context menu
                    scope.showRemoveRoomInput = false;
                    loadRooms();
                } else {
                    scope.actionStatus = "Error: " + removeRoomResponse.error;
                    console.log(removeRoomResponse);
                }
            }); // end api callback
        } // end we know a room is selected
    }; // end removeRoom

    // Single-row selection functionality
    scope.selected = false;
    scope.setSelected = function(room){
        // if not already selected, select it
        // if already selected, unselect it
        // only one room may be selected at a time
        scope.selected === room ? scope.selected = false : scope.selected = room; 
    };

    // Room Add and Modify Functions
    scope.addRoom = function() {
        if (typeof scope.newRoomName !== "undefined") {
            if (typeof scope.newRoomType !== "undefined") {
                if (scope.newRoomType === "inventoryRoom") {
                    // get greatest current Plant Room ID
                    var newID = getNewRoomID(scope.plantRooms);
                    // Get data object for adding inventory room
                    var roomObj = rq.addInventoryRoomObject(scope.session, scope.newRoomName, newID, scope.loc);
                } else if (scope.newRoomType === "plantRoom") {
                    // Get new ID and data object if adding plant room
                    console.log("why not?:");
                    var newID = getNewRoomID(scope.inventoryRooms);
                    var roomObj = rq.addPlantRoomObject(scope.session, scope.newRoomName, newID, scope.loc);
                }
                // API Call and Room View Refresh
                cf.post(roomObj, function(newRoomResponse) { // api call
                    scope.actionStatus = "Success! " + scope.newRoomName + " has been added."
                    // turn off context menu
                    scope.showAddRoomInput = false;
                    loadRooms(); // refresh view
                });
            } // end if newroomType == undefined
            else {
                scope.actionStatus = "Please select a room type";
            }
        } // end if typeof newRoomName !== undefined
        else {
            scope.actionStatus = "Please enter a name for your new room.";
        } // end else newRoomName undefined
    }; // end addRoom

    // Helper function to determine if a 
    // Plant or Inventory room is selected
    function plantRoomSelected(){
        if (scope.inventoryRooms.indexOf(scope.selected) < 0){
            return true;
        }
        return false;
    }
    // Helper function for Get Rooms
    function removeDeleted(array) { // Remove deleted rooms from the array
        var newArray = [];
        array.filter(function(item) { 
            if (item.deleted === 0) { 
                newArray.push(item);
            }
        });
        return newArray;
    }
    // Helper function for Add Room
    function getNewRoomID(array) {
        var maxID = -1;
        array.map(function(room) {
            // return Math.max.apply(Math, room.id) + 1; 
            var id = parseInt(room.roomid);
            if (id > maxID) {
                maxID = id;
            }
        });
        if (maxID > -1) {
            return ""+(maxID + 1)+"";
        } else {
            console.log("Invalid ID")
        };
    }
}]);