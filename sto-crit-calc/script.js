// Code goes here

var crit = angular.module( "crit", [] );

crit.filter( "nocustom", function(){
  return function(mods) {
    var filtered = {};
    $.each( mods, function(key, item) {
      if( !item.customPicker )
        filtered[key] = item;
    });
    return filtered;
  };
});

function CritCtrl($scope) {
  
  $scope.weaponSpecSkill = 9;
  
  $scope.playerAccuracy = 0;
  $scope.targetDefense = 0;
  
  $scope.numBasicRomOps = 0;
  $scope.numRomOps = 0;
  $scope.numSuperiorRomOps = 0;
  
  $scope.numModifiers = 3;
  $scope.numTacConsoleSlots = 4;
  
  $scope.weaponChanceMod = 2;
  $scope.weaponSeverityMod = 20;
  $scope.weaponAccuracyMod = 10;
  
  $scope.tacConsoleChanceMod = 1.6;
  $scope.tacConsoleSeverityMod = 8;
  
  $scope.globalModifiers = {
    
      "spec":
      {
        name: "Weapon Specialisation (Skill)",
        chance: 0,
        severity: 0,
        accuracy: 0,
        customPicker: true,
        active: true
      },
      
      "basicRomOp":
      {
        name: "Basic Romulan Operatives",
        chance: 0,
        severity: 0,
        accuracy: 0,
        customPicker: true,
        active: true
      },
      
      "romOp":
      {
        name: "Romulan Operatives",
        chance: 0,
        severity: 0,
        accuracy: 0,
        customPicker: true,
        active: true
      },
      
      "superiorRomOp":
      {
        name: "Superior Romulan Operatives",
        chance: 0,
        severity: 0,
        accuracy: 0,
        customPicker: true,
        active: true
      },

      "assim":
      {
        name: "Assimilated Module",
        chance: 0.92,
        severity: 9.2,
        accuracy: 0
      },
      
      "tach":
      {
        name: "Tachyokinetic Converter",
        chance: 0.76,
        severity: 7.6,
        accuracy: 0
      },
      
      "zero":
      {
        name: "Zero-Point Conduit",
        chance: 1.8,
        severity: 0,
        accuracy: 0
      },
      
      "bio":
      {
        name: "Bioneural Infusion Circuits",
        chance: 0,
        severity: 15.2,
        accuracy: 0
      },
      
      "romt2":
      {
        name: "Romulan Rep T2 Crit Chance",
        chance: 3,
        severity: 0,
        accuracy: 0
      },
      
      "dyst2":
      {
        name: "Dyson Rep T2 Crit Severity",
        chance: 0,
        severity: 10,
        accuracy: 0
      },
      
      "prot2":
      {
        name: "Protonic Arsenal Set 2pc",
        chance: 3,
        severity: 0,
        accuracy: 0
      },
      
      "prot3":
      {
        name: "Protonic Arsenal Set 3pc",
        chance: 0,
        severity: 10
      },
      
      "dhc":
      {
        name: "Show stats for DHCs",
        chance: 0,
        severity: 10,
        accuracy: 0
      },
      
      "ap":
      {
        name: "Show stats for regular antiproton weapons (not Voth)",
        chance: 0,
        severity: 20,
        accuracy: 0
      },
      
      "nukara":
      {
        name: "Nukara Particle Converter + Beams",
        chance: 0,
        severity: 0,
        accuracy: 10
      },
    
    };
  
  
  $scope.updateResults = function() {
    
    // Base values
    var chance = 2.5;
    var severity = 50;
    var accuracy = $scope.playerAccuracy;
    
    // Tally global modifiers
    $.each( $scope.globalModifiers, function(i,item) {
      if( item.active ) {
        chance += item.chance;
        severity += item.severity;
        accuracy += item.accuracy;
      }
    });
    
    var combinations = [ { "chance": chance, "severity": severity, "accuracy": accuracy } ];
    
    // Weapon modifier combinations
    combinations = generateCombinations( combinations, $scope.numModifiers, "weaponMod", $scope.weaponChanceMod, $scope.weaponSeverityMod, $scope.weaponAccuracyMod );
    
    // Tac console combinations
    combinations = generateCombinations( combinations, $scope.numTacConsoleSlots, "tacConsole", $scope.tacConsoleChanceMod, $scope.tacConsoleSeverityMod, 0 );
    
    // Evaluate effectiveness
    $.each( combinations, function(i, item) {
      var acc = item.accuracy;
      var def = $scope.targetDefense;
      
      // Calculate hit chance
      if(acc > def)
        item.hit = 2 - 1/( 1+(acc-def)/100 );
      else if( acc < def )
        item.hit = 1/( 1-(acc-def)/100 );
      else
        item.hit = 1;
      
      // Add crit chance/sev for accuracy overflow
      /*if( item.hit > 1 ) {
        item.chance += (item.hit-1) * 12.5;
        item.severity += (item.hit-1) * 50;
        item.hit = 1;
      }*/

      if( acc > def ) {
        var diff = acc-def;
        item.chance += diff * 0.125;
        item.severity += diff * 0.5;
        item.hit = 1;
      }

      // Final damage multiplier calculation
      item.value = item.hit * (1 + item.chance*item.severity/10000);
      
    });
    
    $scope.results = combinations;
    
  };
  
  $scope.updateWeaponSpec = function() {
    
    var skillValue = 0;
    
    switch( $scope.weaponSpecSkill ) {
      case 9: skillValue = 99; break;
      case 8: skillValue = 94; break;
      case 7: skillValue = 89; break;
      case 6: skillValue = 84; break;
      case 5: skillValue = 74; break;
      case 4: skillValue = 64; break;
      case 3: skillValue = 54; break;
      case 2: skillValue = 36; break;
      case 1: skillValue = 18; break;
      default: break;
    }
    
    $scope.globalModifiers.spec.chance = 2/99 * skillValue;
    $scope.globalModifiers.spec.severity = 25/99 * skillValue;
    
  };
  
  $scope.updateRomulanOperatives = function() {
    
    $scope.globalModifiers.basicRomOp.chance = $scope.numBasicRomOps * 1;
    $scope.globalModifiers.basicRomOp.severity = $scope.numBasicRomOps * 2.5;

    $scope.globalModifiers.romOp.chance = $scope.numRomOps * 1.5;
    $scope.globalModifiers.romOp.severity = $scope.numRomOps * 3.8;

    $scope.globalModifiers.superiorRomOp.chance = $scope.numSuperiorRomOps * 2;
    $scope.globalModifiers.superiorRomOp.severity = $scope.numSuperiorRomOps * 5;

  };
  
  $scope.updateRomulanOperatives();
  $scope.updateWeaponSpec();
  $scope.updateResults();
  
}

function generateCombinations( combinations, numSlots, groupName, chanceMod, severityMod, accuracyMod ) {

    // Create all permutations  
    for( var i=0; i<numSlots; i++ ) {
      
      var combinations1 = [];
      $.each( combinations, function(j,item) {
        // Chance modifier
        var groups = $.extend(true, {}, item.groups); // deep clone
        if( !groups[groupName] )
          groups[groupName] = { chance: 0, severity: 0, accuracy: 0 };
        groups[groupName].chance += chanceMod;
        combinations1.push( { "chance": item.chance + chanceMod, "severity": item.severity, "accuracy": item.accuracy, "groups": groups } );
        
        // Severity modifier
        groups = $.extend(true, {}, item.groups);
        if( !groups[groupName] )
          groups[groupName] = { chance: 0, severity: 0, accuracy: 0 };
        groups[groupName].severity += severityMod;
        combinations1.push( { "chance": item.chance, "severity": item.severity + severityMod, "accuracy": item.accuracy, "groups": groups } );
        
        if( accuracyMod > 0 ) {
          // Accuracy modifier
          groups = $.extend(true, {}, item.groups);
          if( !groups[groupName] )
            groups[groupName] = { chance: 0, severity: 0, accuracy: 0 };
          groups[groupName].accuracy += accuracyMod;
          combinations1.push( { "chance": item.chance, "severity": item.severity, "accuracy": item.accuracy + accuracyMod, "groups": groups } );
        }

      });
      combinations = combinations1;

    }
    
    // Remove duplicates - no deep $.unique()?
    combinations = $.map( combinations, function(item,i) {
      var ret = item;
      $.each( combinations, function(j,jtem) {
        if( i < j && JSON.stringify(item.groups) == JSON.stringify(jtem.groups) ) {
          ret = null;
          return false;
        }
      });
      return ret;
    });
    
    return combinations;
  
}