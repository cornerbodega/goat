// create the controller and inject Angular's $scope
scotchApp.controller('mainController', function($scope) {
        // create a message to display in our view
        $scope.message = 'jkjkjjkjkjkjk`Everyone come and see how good I look!';
        }); 

scotchApp.controller('aboutController', function($scope) {
        $scope.message = 'Look! I am an about page.';
        }); 
scotchApp.controller('contactController', function($scope) {
        $scope.message = 'Contact us! JK. This is just a demo.';
        }); 
