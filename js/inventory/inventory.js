"use strict";
countryApp.controller('InventoryController', function($scope, $http, $filter) {
    $scope.inputOn = false;
    $scope.actionStatus = false;
    var php = {
            sessionURL: "php/db/get_session.php",
            destroyURL: "php/inventory/scheduleDestroy.php",
            adjustURL: "php/inventory/adjust.php",
            getInventory: "php/inventory/get_inventory.php"
        };
        // Validate user is logged in
        console.log("init!!!!!!");
    $http.get(php.sessionURL).success(function(data) {
        $scope.session = data.sessionid;
        $scope.email = data.email;
        if (!$scope.session) {
            "No session. How do I fail gracefully?";
        } else {
            loadInv();
          // loadSearch();
        }
        var destroyUrl = php.destroyURL;
        var adjustUrl = php.adjustURL;
        var MAX_BATCH = 100;
        // Load Inventory
        function saveSearch(){
            if (typeof $scope.search !== "undefined") {
                document.cookie="search="+JSON.stringify($scope.search);
            }
        }
        function loadSearch(){
            if (getCookie("search")){
                //console.log(getCookie("search"));
                $scope.search = getCookie("search");
            }
        }
        function getCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return JSON.parse(c.substring(name.length,c.length));
            }
            return "";
        }
        function loadInv() {
            var sessionid = $scope.session;
            var invObject = {
                "session": $scope.session
            };
            $http({
                method: 'POST',
                url: php.getInventory,
                data: invObject,
                datatype: 'json',

            }).success(function(res) {
                $scope.orderByField = 'sessiontime';
                $scope.reverseSort = true;
                $scope.inventory = res.inventory;
                $scope.setSelected = function() {
                    if ($scope.selected) { // empty selection on function call
                        $scope.selected.length = 0;
                    }
                    $scope.selected = $filter('filter')($scope.inventory, $scope.search); // make selection based on search filters
                   // could make this to be based on check boxes
                    if (selectionEmpty()) { // reset the selection to zero if there are no search items entered 
                        $scope.selected.length = 0;
                    }
                    if ($scope.selected.length === 0){
                        $scope.actionStatus = false;
                    } else{
                        $scope.numRows = $scope.selected.length === 0 ? "" : $scope.selected.length;
                        console.log("numrows  " + $scope.numRows);
                        $scope.actionStatus = $scope.numRows === 1 ? "1 item selected" : $scope.numRows + " items selected";
                        saveSearch(); // may get rid of this
                    }
                }
                $scope.inputRequest = function(action){
                    if (selectionEmpty()){
                        $scope.actionStatus = "Please make at least one selection"
                    }
                    else {
                        //$scope.actionStatus = false;
                        $scope.inputOn = !$scope.inputOn;
                    }
                } 
                function selectionEmpty() {
                    if (typeof $scope.selected=== "undefined") {
                        console.log("No selection");
                        return true;
                    } else if ($scope.selected.length > MAX_BATCH) {
                        $scope.fewerMsg = "Please select fewer than " + MAX_BATCH + " items to edit. (For Safety!)";
                        return true;
                    } else if ($scope.selected.length === 0){
                        return true;
                    }
                    return false;

                }

                $scope.formatSelectedArray = function() {
                    if ($scope.selected) {
                        var selectedIDs = "[";
                        $scope.selected.map(function(item) {
                            selectedIDs += "\"" + item.id + "\"\,";
                        });
                        selectedIDs = selectedIDs.substring(0, selectedIDs.length - 1);
                        selectedIDs += "]";
                        return selectedIDs;
                    }
                }
                $scope.scheduleDestruction = function() {
                    var selectedIDs = $scope.formatSelectedArray();
                    var destroyReason = "Seeds";
                    var action = "inventory_destroy_schedule";
                    // to do: add reason input
                    var scheduleDestroyObject = {
                        "id": selectedIDs,
                        "action": action,
                        "reason": destroyReason,
                        "session": sessionid
                    }
                    if($scope.numRows ===1){
                        $scope.successText = "One item scheduled for destruction. 72 hours remaining.";
                    }
                    else {
                        $scope.successText = $scope.numRows +" items scheduled for destruction. 72 hours remaining.";
                    }
                    $scope.performAction(destroyUrl, scheduleDestroyObject);
                }
                $scope.destroy = function() {
                    var selectedIDs = $scope.formatSelectedArray();
                    var action = "inventory_destroy";
                    // to do: add reason input
                    var destroyObject = {
                        "id": selectedIDs,
                        "action": action,
                        "session": sessionid
                    }
                    if ($scope.numRows === 1){
                        $scope.successText =  "One item destroyed.";
                    }
                    else {
                        $scope.successText =  $scope.numRows + " items destroyed.";
                    }
                    $scope.performAction(destroyUrl, destroyObject);
                }
                $scope.adjustQuantity = function() {
                    if (!selectionEmpty() && $scope.newQ > 0) {
                        if (typeof $scope.reason !== "undefined") {
                            //loop through selected IDs and send them through adjust.php 
                            var action = "inventory_adjust";
                            //var reason = "drying"; // To do: NEEDS TO BE USER INPUT
                            if ($scope.numRows === 1){
                                $scope.successText = "Changed the weight of one item to " + $scope.newQ;
                            }
                            else {
                                $scope.successText = "Changed the weight of " + $scope.numRows + " items to " + $scope.newQ;
                            }
                            $scope.selected.map(function(item) {
                                    var adjustObject = {
                                    "id": item.id,
                                    "action": action,
                                    "session": sessionid,
                                    "reason": $scope.reason,
                                    "quantity": $scope.newQ,
                                    }
                                    $scope.performAction(adjustUrl, adjustObject);
                                    });
                        }
                        else {
                            $scope.actionStatus = "Please enter a reason for the weight change. (eg. \"Curing\")";
                        }
                    }
                    else {
                        $scope.actionStatus = "Please enter a new weight";
                    }
                }
                $scope.performAction = function(url, dataObject) {
                        console.log(selectionEmpty());
                        if (selectionEmpty() === true) {
                            $scope.actionStatus = "Please make at least one selection"
                        } else {
                            $http({
                                method: 'POST',
                                url: url,
                                data: dataObject,
                                datatype: 'json',

                            }).success(function(res) {
                                if (res.success === 1) {
                                    $scope.actionStatus = "Success! " + $scope.successText;
                                    loadInv();
                                }
                                if (res.success === 0) {
                                    $scope.actionStatus = "Error! " + res.error;
                                }
                            });
                        }
                    }
                    // Create columns here
                $scope.inventory.map(function(item) {
                    // Combination Usable and Remaining weight column
                    if (item.usable_weight === item.remaining_quantity) {
                        var rq = Math.round(item.remaining_quantity * 100) / 100;
                        item.weight = rq;
                    } else {
                        var rq = Math.round(item.remaining_quantity * 100) / 100;
                        var uw = Math.round(item.usable_weight * 100) / 100;
                        item.weight = "(" + uw + ") -> " + rq;
                    }
                    // Last Modified Column
                    item.modtime = new Date(item.sessiontime * 1000).toLocaleString();

                    // Desc Column
                    switch (item.inventorytype) {
                        case 27:
                            item.desc = "Waste (NS)";
                            if (item.inventorystatus === 1) {
                                item.desc = "Waste (S)";

                                if (item.inventorystatustime < Date.now() / 1000) {
                                    item.desc = "Waste (S*)";
                                }
                            }
                            break;
                        case 6:
                            item.desc = "Flower";
                            break;
                        case 7:
                            item.desc = "Clone";
                            break;
                        case 9:
                            item.desc = "Other Plant Material";
                            break;
                        case 10:
                            item.desc = "Seed";
                            break;
                        case 12:
                            item.desc = "Mature Plant";
                            break;
                        case 13:
                            item.desc = "Flower Lot";
                            break;
                        case 14:
                            item.desc = "Other Plant Material Lot";
                            break;
                        default:
                            item.desc = "";
                            break;
                    } // End Desc Column
                    // todo: add cases for the rest of the codes
                });
            });
        }
    });
});
