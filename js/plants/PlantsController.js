"use strict";

countryApp.controller('PlantsController', ['$scope', '$http', '$filter', 'PlantService', 'ConnectFactory', function(scope, http, filter, rq, cf) {
    //Input Booleans
    scope.roomNameMap = [];
    scope.toggleInputMenu = function(action){
        console.log(action);
        switch (action) {
            case 'add' :
                scope.showAddPlantInput = !scope.showAddPlantInput;
                break;
            case 'modify' :
                if (scope.selected !== false){
                    scope.showModifyPlantInput = !scope.showModifyPlantInput;
                }
                else {
                    scope.actionStatus = "Select a plant, please.";
                    scope.showModifyPlantInput = false; 
                }
                break;
            case 'remove' :
                if (scope.selected !== false){
                    scope.showRemovePlantInput = !scope.showRemovePlantInput;
                }
                else {
                    scope.actionStatus = "Select a plant, please.";
                    scope.showRemovePlantInput = false; 
                }
                break;
            default :
                return false; // this shouldn't happen
        }
    }   
    

    // Get session Information before loading plants
    cf.session(function(sessionData) { // Get Session Info
        scope.session = sessionData.sessionid;
        scope.email = sessionData.email;
        loadPlants();
    }); // end cf.session
    // Get Plant List
    function loadPlants() { // Plant View Functions
        scope.currentRoomID = "3"; // make cookie-based
        scope.currentPlants = [];
        // Empty selection 
        // and(for a clean reload)
        scope.selected = false;
        scope.showAddPlantInput = false;
        scope.showModifyPlantInput = false;
        scope.showRemovePlantInput = false;
        // Get Inventory Plants
            
            // Get Plant Plants
            
        cf.post(rq.plantObject(scope.session), function(plantResponse) {
            scope.plants = removeDeleted(plantResponse.plant);
            scope.loc = scope.plants[1].location; // TODO: THIS WON'T WORK FOR NEW USERS!!!

            cf.post(rq.roomObject(scope.session), function(plantRoomResponse) {
                scope.plantRooms = removeDeleted(plantRoomResponse.plant_room);
                arrangePlants();

                // cf.post(rq.derivative(scope.session), function(plantDerivativeResponse) {
                //     scope.plantDerivative = removeDeleted(plantDerivativeResponse.plant_derivative);
                //     //scope.plants.indexOf(scope.plantRooms.room);
                //     scope.plants.map(function(plant){
                //         scope.plantDerivative.forEach(function(derivative){
                //             if(plant.id === derivative){
                //                 //plant.
                //             };  
                //         });
                //     });
                // });  // end plantDerivative
            }); // end plant room
        }); // end plant
    }; // end loadPlants


    // Put each plant in the plants array of the object
    // representing the room it's in. This is for the accordion
    function arrangePlants(){
        scope.plantRooms.map(function(room){
            scope.roomNameMap.push({
                name : room.name,
                id : room.roomid,
                plants : []
            });
        });
        scope.roomNameMap.map(function(room){
            scope.plants.forEach(function(plant){
                if (parseInt(plant.room) === parseInt(room.id)){
                    //console.log("match");
                    plant.stateName = getStateName(plant.state);
                    plant.time = getTime(plant.sessiontime);
                    room.plants.push(plant);
                   // console.log(room.plants);
                };
            });
        });
    }
    function getStateName(num){
        switch (num){
            case 0 :
                return "Growing";
            case 1: 
                return "Curing"
            case 2: 
                return "Fully Cured"
        }
    }
    function getTime(time){
        return new Date(time * 1000).toLocaleString();
    }
    // Single-row selection functionality
    scope.selected = false;
    scope.setSelected = function(plant){
        // if not already selected, select it
        // if already selected, unselect it
        // only one plant may be selected at a time
        scope.selected === plant ? scope.selected = false : scope.selected = plant; 
    };



    // Helper function to determine if a 
    // Plant or Inventory plant is selected
    function plantSelected(){
        if (scope.plants.indexOf(scope.selected) < 0){
            return true;
        }
        return false;
    }
    // Helper function for Get Plants
    function removeDeleted(array) { // Remove deleted plants from the array
        var newArray = [];
        array.filter(function(item) { 
            if (item.deleted === 0) { 
                newArray.push(item);
            }
        });
        return newArray;
    }
}]);