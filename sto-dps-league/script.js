var dpsLeague = angular.module( "dps-league", [] );

function DpsLeagueCtrl($scope, $http) {

  $scope.dpsData = [];

  $scope.refresh = function() {

    $http.get("http://sto-dps-league.herokuapp.com/data")
    	.success( function(data) {
        var players = {};
			  $scope.dpsData = $.map( data, function(item, i) {
			    if( !players[item.player] ) {
			      players[item.player] = true;
			      item.rank = Object.keys(players).length;
			      return item;
			    }
			    return null;
			  } );
		  });

  }

  $scope.refresh();



}