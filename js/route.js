// script.js

// create the module and name it scotchApp
// also include ngRoute for all our routing needs
var countryApp = angular.module('countryApp', ['ngRoute']);
// configure our routes
countryApp.config(function($routeProvider) {
        $routeProvider

        // route for the home page
        .when('/', {
templateUrl : 'pages/inventory.html',
controller  : 'InventoryController'
})

        // route for the contact page
        .when('/inventory', {
templateUrl : 'pages/inventory.html',
controller  : 'InventoryController'
});
        });



