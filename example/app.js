var RadarApp = angular.module('RadarApp', ['angular-radar']);

RadarApp.controller('radarCtrl', function radarCtrl ($scope) {
    $scope.data=[
          [
           {axis: "Axis1", value: 13}, 
           {axis: "Axis2", value: 1}, 
           {axis: "Axis3", value: 8},  
           {axis: "Axis4", value: 4},  
           {axis: "Axis5", value: 9},
           {axis: "Axis6", value: 9}
          ]
          ,[
           {axis: "Axis1", value: 3}, 
           {axis: "Axis2", value: 15}, 
           {axis: "Axis3", value: 4}, 
           {axis: "Axis4", value: 1},  
           {axis: "Axis5", value: 15},
           {axis: "Axis6", value: 11}
          ],[
           {axis: "Axis1", value: 5}, 
           {axis: "Axis2", value: 1}, 
           {axis: "Axis3", value: 16}, 
           {axis: "Axis4", value: 10},  
           {axis: "Axis5", value: 5},
           {axis: "Axis6", value: 19}
          ]
        ];
});