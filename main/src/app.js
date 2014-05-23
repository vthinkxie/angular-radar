var RadarApp = angular.module('RadarApp', ['angular-radar']);

RadarApp.controller('radarCtrl', function radarCtrl ($scope) {
    $scope.data=[
          [
           {axis: "strength", value: 13}, 
           {axis: "intelligence", value: 1}, 
           {axis: "charisma", value: 8},  
           {axis: "dexterity", value: 4},  
           {axis: "luck", value: 9},
           {axis: "more", value: 9}
          ]
          ,[
           {axis: "strength", value: 3}, 
           {axis: "intelligence", value: 15}, 
           {axis: "charisma", value: 4}, 
           {axis: "dexterity", value: 1},  
           {axis: "luck", value: 15},
           {axis: "more", value: 11}
          ],[
           {axis: "strength", value: 5}, 
           {axis: "intelligence", value: 1}, 
           {axis: "charisma", value: 16}, 
           {axis: "dexterity", value: 10},  
           {axis: "luck", value: 5},
           {axis: "more", value: 19}
          ]
        ];
});
