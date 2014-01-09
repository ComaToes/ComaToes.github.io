var stoTools = angular.module( "sto-tools", [] );

function STOToolsCtrl($scope, $location) {
  
  $scope.title = "STO Tools";
  
  $scope.tools = [
    
      {
          url: "http://comatoes.github.io/sto-dps-league/",
          name: "DPS League"
      },
      
      {
          url: "http://comatoes.github.io/sto-crit-calc/",
          name: "Crit Calculator"
      }
    
    ];
    
  $scope.url = $location.absUrl(); 
  
}