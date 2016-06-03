'use strict';
angular.module("collabteambuilder").directive('stateLoadingIndicator', function($rootScope) {
  return {
    restrict: 'E',
    template: 
    "<div ng-show='isStateLoading' class='loading-indicator loadingStyle'>" +
    "<div class='loading-indicator-body loadingStyle'>" +
    "<h3 class='loading-title'>Loading...</h3>" +
    "<div class='spinner loadingStyle'><wave-spinner></wave-spinner></div>" +
    "</div>" +
    "</div>",
    replace: true,
    link: function(scope, elem, attrs) {
      scope.isStateLoading = false;

      $rootScope.$on('$stateChangeStart', function() {

        scope.isStateLoading = true;
      });
      $rootScope.$on('$stateChangeSuccess', function() {
        scope.isStateLoading = false;
      });
    }
  };
});

angular.module("collabteambuilder").directive('optionsClass', function ($parse) {
  return {
    require: 'select',
    link: function(scope, elem, attrs, ngSelect) {
      // get the source for the items array that populates the select.
      var optionsSourceStr = attrs.ngOptions.split(' ').pop(),
      // use $parse to get a function from the options-class attribute
      // that you can use to evaluate later.
          getOptionsClass = $parse(attrs.optionsClass);
          
      scope.$watch(optionsSourceStr, function(items) {
        // when the options source changes loop through its items.
        angular.forEach(items, function(item, index) {
          // evaluate against the item to get a mapping object for
          // for your classes.
          var classes = getOptionsClass(item),
          // also get the option you're going to need. This can be found
          // by looking for the option with the appropriate index in the
          // value attribute.
              option = elem.find('option[value=' + index + ']');
              
          // now loop through the key/value pairs in the mapping object
          // and apply the classes that evaluated to be truthy.
          angular.forEach(classes, function(add, className) {
            if(add) {
              angular.element(option).addClass(className);
            }
          });
        });
      });
    }
  };
});

angular.module("collabteambuilder").directive('changeOnBlur', function() {
            return {
                restrict: 'A',
                require: 'ngModel',
                link: function(scope, elm, attrs, ngModelCtrl) {
                    if (attrs.type === 'radio' || attrs.type === 'checkbox') 
                        return;

                    var expressionToCall = attrs.changeOnBlur;

                    var oldValue = null;
                    elm.bind('focus',function() {
                        scope.$apply(function() {
                            oldValue = elm.val();
                            console.log(oldValue);
                        });
                    })
                    elm.bind('blur', function() {
                        scope.$apply(function() {
                            var newValue = elm.val();
                            console.log(newValue);
                            if (newValue !== oldValue){
                                scope.$eval(expressionToCall);
                            }
                                //alert('changed ' + oldValue);
                        });         
                    });
                }
            };
        });

angular.module("collabteambuilder").controller("RoomCtrl", function($scope, rooms, post, dex)
{

	var socket = io("/test-namespace");

	//ng-repeat the EVs
	$scope.evs = ["HP", "Atk", "Def", "SpA", "SpD", "Spe"];

	$scope.hideChat = true;
	$scope.exporting = false;
	$scope.messages = "";

	socket.on("connect", function()
	{
		socket.emit("room id", post._id);

		for (var i = 0; i < 6; i++)
		{
			$scope["howManyViewing" + i] = "";
		}

	});

	$scope.party = [];

	$scope.evNums = 
	{
		"1":
		{
			HP: [],
			Atk: [],
			Def: [],
			SpA: [],
			SpD: [],
			Spe: []
		},
		"2":
		{
			HP: [],
			Atk: [],
			Def: [],
			SpA: [],
			SpD: [],
			Spe: []
		},
		"3":
		{
			HP: [],
			Atk: [],
			Def: [],
			SpA: [],
			SpD: [],
			Spe: []
		},
		"4":
		{
			HP: [],
			Atk: [],
			Def: [],
			SpA: [],
			SpD: [],
			Spe: []
		},
		"5":
		{
			HP: [],
			Atk: [],
			Def: [],
			SpA: [],
			SpD: [],
			Spe: []
		},
		"6":
		{
			HP: [],
			Atk: [],
			Def: [],
			SpA: [],
			SpD: [],
			Spe: []
		},
	};
	$scope.fullEVs = [4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,220,224,228,232,236,240,244,248,252,0];

	$scope.natureList = ["Hardy", "Adamant (+Atk, -SpA)", "Bold (+Def, -Atk)", "Brave (+Atk, -Spe)", "Calm (+SpD, -Atk)", "Careful (+SpD, -SpA)", "Gentle (+Def, -SpD)", "Hasty (+Spe, -Def)", "Impish (+Def, -SpA)", "Jolly (+Spe, -SpA)", "Lax (+Def, -SpD)", "Lonely (+Atk, -Def)", "Mild (+SpA, -Def)", "Modest (+SpA, -Atk)", "Naive (+Spe, -SpD)", "Naughty (+Atk, -SpD)", "Quiet (+SpA, -Spe)", "Rash (+SpA, -SpD)", "Relaxed (+Def, -Spe)", "Sassy (+SpD, -Spe)", "Timid (+Spe, -Atk)"];

	var pokedex = dex.dex;
	var movedex = dex.moves;
	var itemdex = dex.items;
	var currentInput = "";




	$scope.tiers = ["Uber", "OU", "BL", "UU", "BL2", "RU", "BL3", "NU", "BL4", "PU", "LC", "NFE", "Level 50"];
	
	$scope.colors = ["aqua", "purple", "green", "red", "orange", "gray", "cyan", "black", "magenta", "violet", "darkorchid", "darkturquoise"];
	$scope.yourCol = $scope.colors[Math.floor(Math.random() * $scope.colors.length)];






	$scope.userNick = $scope.yourCol;

	//same data structure as how it is saved in the database
	$scope.party = post.party;
	$scope.selectedTier = post.tier;


	$scope.roomID = post._id;

	$scope.partySize = ["1", "2", "3", "4", "5", "6"];
	$scope.moveSize = ["1", "2", "3", "4"];
	$scope.suggestingMons = false;

	/************** Misc functions **************/
	$scope.styleNav = function()
	{
		//if (i === 1)
		{
			if (!$scope.attackingCalcActive && !$scope.defendingCalcActive)
			{
				//'background-color': '#006186', 
				return {'background-color' : 'white', 'color' : '#00374C', 'border-radius' : '0px'};
			}
		}

	}

	$scope.copied = function()
	{
		$scope.copied2clip = "Copied!";
	}


	$scope.randCol = function()
	{
		return {'color' : $scope.yourCol};
	}

	// alert(dex.getLearnset("venusaur").toSource());

	$scope.hlSelectedPoke = function(index)
	{
		if (index === currentInput.substring(0, 1))
		{
			return {'background-color' : 'white'};
		}
	}


	$scope.EVStyle = function(n)
	{
		if (n > 100) return {'background-color' : 'green'}
	}


	/*********** Tier ***********/

	$scope.chooseTier = function(tier)
	{
		var data = {room: post._id, tier: tier, currentInput: currentInput};
		dex.updateParty(data);
		socket.emit("tier selection", data);
		
	}

	socket.on("update tier selection", function(data)
	{
		$scope.$apply(function()
		{
			$scope.selectedTier = data.tier;
			$scope.refresh(data.currentInput.substring(0, 1));
		});
	});
	//pokemon.tier = RU, poke.tier = RU
	function tierCompare(tier)
	{
		return function(a, b)
		{

			if (a[tier] === $scope.selectedTier) return 100;
			return $scope.tiers.indexOf(b[tier]) - $scope.tiers.indexOf(a[tier]);
		}
	}

	$scope.tierSort = function(mon)
	{
		//ordering should also depend on current tier
		//ie if RU, then the tiers above don't display at all / at the very end
		if (mon.tier === $scope.selectedTier) return 0;
		else 
		{
			if ($scope.tiers.indexOf(mon.tier) === -1) return 100;
			else return $scope.tiers.indexOf(mon.tier) + 1;

		}
	}

	$scope.export = function()
	{

		if ($scope.exporting === true)
		{
			$scope.copied2clip = "";
		}

		$scope.exporting = !$scope.exporting;
		$scope.exported = "";
		var toExport = "";
		for (var poke in $scope.party)
		{

			toExport += $scope.party[poke].name + " @ " + $scope.party[poke].item + "\n";
			toExport += "Ability: " + $scope.party[poke].ability + "\n";
			if ($scope.selectedTier === "LC")
			{
				toExport += "Level: 5 \n";
			}
			else if ($scope.selectedTier === "Level 50")
			{
				toExport += "Level: 50 \n";
			}

			toExport += "EVs: ";
			for (var ev in $scope.party[poke].EVs)
			{
				toExport += $scope.party[poke].EVs[ev] + " " + ev + " / ";
			}
			toExport = toExport.substring(0, toExport.length - 3);
			toExport += "\n";
			toExport += "IVs: ";
			for (var iv in $scope.party[poke].IVs)
			{
				toExport += $scope.party[poke].IVs[iv] + " " + iv + " / ";
			}
			toExport = toExport.substring(0, toExport.length - 3);
			toExport += "\n";
			toExport += $scope.party[poke].nature.split(" ")[0] + " Nature \n";
			//possible restructure of moves
			toExport += "- " + $scope.party[poke].move1 + "\n";
			toExport += "- " + $scope.party[poke].move2 + "\n";
			toExport += "- " + $scope.party[poke].move3 + "\n";
			toExport += "- " + $scope.party[poke].move4 + "\n";




			toExport += "\n";
		}


		$scope.exported = toExport;
	}


	/******************************** Damage Calc ********************************/
	/*** Code: damage calc ***/

	$scope.attackingCalcActive = false;
	$scope.defendingCalcActive = false;


	$scope.isAerilate = "";
	$scope.isPixilate = "";
	$scope.isRefrigerate = "";

	$scope.plateBoost = 0;

	$scope.defNatureBoost = 1;
	$scope.defHPEVs = 0;
	$scope.dEVs = 0;
	$scope.spdEVs = 0;

	$scope.defenderName = "";

	$scope.boostMods = ["+6", "+5", "+4", "+3", "+2", "+1", "+0", "-1", "-2", "-3", "-4", "-5", "-6"];
	$scope.AtkBoostMod = "+0";
	$scope.SpABoostMod = "+0";
	$scope.defBoostMod = "+0";
	$scope.spdBoostMod = "+0";
	$scope.defNat = "Hardy";


	/*** Attacking Calc ***/
	$scope.attackerBoostMod = "+0";
	$scope.sattackerBoostMod = "+0";

	$scope.attacker = 
	{
		move1: "",
		move2: "",
		move3: "",
		move4: "",
		EVs:
		{
			Atk: 0,
			SpA: 0
		},
		nature: "Hardy"
	}
	$scope.defenderBoostMod = "+0";
	$scope.sdefenderBoostMod = "+0";


	$scope.refresh = function(which)
	{
		
		$scope.refreshCalcs();
		$scope.refreshDefCalcs();
		$scope.calcStatNumbers(which);
	}


	$scope.refreshCalcs = function()
	{

		var mon = $scope.party["pokemon" + currentInput.substring(0, 1)];

		var moves =
		{

			move1:
			{
				// name: [],
				// bp: [],
				// cat: [],
				// type: []
			},
			move2:
			{
				// name: [],
				// bp: [],
				// cat: [],
				// type: []
			},
			move3:
			{
				// name: [],
				// bp: [],
				// cat: [],
				// type: []
			},
			move4:
			{
				// name: [],
				// bp: [],
				// cat: [],
				// type: []
			}
		}

		for (var m in moves)
		{
			moves[m].name = mon[m];
		}

		var AtkEV = mon.EVs.Atk; //$scope.party["pokemon" + currentInput.substring(0, 1)].EVs.Atk;
		var SpAEV = mon.EVs.SpA; //$scope.party["pokemon" + currentInput.substring(0, 1)].EVs.SpA;
		var baseAtk = 0;
		var baseSpA = 0;
		var typing = [];
		for (var poke in pokedex)
		{
			if (mon.name === pokedex[poke].species)
			{
				baseAtk = pokedex[poke].baseStats.atk;
				baseSpA = pokedex[poke].baseStats.spa;
				typing = pokedex[poke].types;
			}
		}
		//maybe function to get the level from the tier
		var level = 100;
		if ($scope.selectedTier === "LC") level = 5;
		else if ($scope.selectedTier === "Level 50") level = 50;

		var AtkStat = 0;
		var SpAStat = 0;

		var unmodAtkStat = Math.floor(calcStat(baseAtk, AtkEV, 31, level));
		var unmodSpAStat = Math.floor(calcStat(baseSpA, SpAEV, 31, level));

		for (var move in movedex)
		{
			for (var i in moves)
			{
				if (moves[i].name === movedex[move].name)
				{
					moves[i] = movedex[move];
					// moves[i].bp = movedex[move].basePower;
					// moves[i].cat = movedex[move].category;
					// moves[i].type = movedex[move].type;
				}
			}

		}

		var baseDef = 0;
		var baseSpD = 0;
		var baseHP = 0;
		var defendingPoke = 
		{
			species: "",
			types: ["", ""],
			baseStats: {hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0},
			abilities: {0: "", 1: "", H: ""}
		};
		if ($scope.defenderName.length >= 3)
		{
			
			for (var poke in pokedex)
			{
				if ($scope.defenderName === pokedex[poke].species || $scope.defenderName === pokedex[poke].species.toLowerCase())
				{
					defendingPoke = pokedex[poke];
				}
			}
			


			baseDef = defendingPoke.baseStats.def;
			baseSpD = defendingPoke.baseStats.spd;
			baseHP = defendingPoke.baseStats.hp;
			defendingPoke.nature = $scope.defNat;
			defendingPoke.item = $scope.defenderItem;

			var defenderHP = Math.floor(calcHP(baseHP, $scope.defHPEVs, 31, level));
			var unmodDefStat = Math.floor(calcStat(baseDef, $scope.dEVs, 31, level));
			var unmodSpDStat = Math.floor(calcStat(baseSpD, $scope.spdEVs, 31, level));

			var DefStat = 0;
			var SpDStat = 0;
			var damage = "";
			damage += "<table class='dispDmgCalcs'>";
			for (var mov in moves)
			{
				AtkStat = calcAttack(unmodAtkStat, mon, defendingPoke, moves[mov], $scope.AtkBoostMod, $scope.SpABoostMod);
				SpAStat = calcAttack(unmodSpAStat, mon, defendingPoke, moves[mov], $scope.AtkBoostMod, $scope.SpABoostMod);
				DefStat = calcDef(unmodDefStat, mon, defendingPoke, moves[mov], $scope.defBoostMod, $scope.spdBoostMod);
				SpDStat = calcDef(unmodSpDStat, mon, defendingPoke, moves[mov], $scope.defBoostMod, $scope.spdBoostMod);

				var basePower = calcBasePower(moves[mov], mon, defendingPoke);
				var mod = [1];

				damage += "<tr>";

				if (moves[mov].category === "Physical")
				{
					damage += "<td>";
					damage += moves[mov].name + ": </td><td>" + 
					truncToOnePlace(Math.floor(damageCalc(moves[mov], typing, level, AtkStat, DefStat, basePower, mon, defendingPoke)[0]) / defenderHP * 100) + "% to " + 
					truncToOnePlace(Math.floor(damageCalc(moves[mov], typing, level, AtkStat, DefStat, basePower, mon, defendingPoke)[1]) / defenderHP * 100) + "%";
					damage += "</td>";
				}
				else if (moves[mov].category === "Special")
				{	
					damage += "<td>";
					damage += moves[mov].name + ": </td><td>" + 
					truncToOnePlace(Math.floor(damageCalc(moves[mov], typing, level, SpAStat, SpDStat, basePower, mon, defendingPoke)[0]) / defenderHP * 100) + "% to " + 
					truncToOnePlace(Math.floor(damageCalc(moves[mov], typing, level, SpAStat, SpDStat, basePower, mon, defendingPoke)[1]) / defenderHP * 100) + "%";
					damage += "</td>";
				}

				damage += "</tr>";
			}
			damage += "</table>";
			$scope.damageCalculations = damage;
		}

		
	}




	$scope.refreshDefCalcs = function()
	{
		
		if ($scope.attacker.move1.length >= 3 || $scope.attacker.move2.length >= 3 || $scope.attacker.move3.length >= 3 || $scope.attacker.move4.length >= 3)
		{

			var attackingPoke = 
			{
				moves:
				{
					move1: {},
					move2: {},
					move3: {},
					move4: {}
				}

			};

			for (var mov in movedex)
			{
				for (var i in attackingPoke.moves)
				{
					if ($scope.attacker[i] === movedex[mov].name || $scope.attacker[i] === movedex[mov].name.toLowerCase())
					{
						
						attackingPoke.moves[i] = movedex[mov];
					}
				}
			}

			var mon = $scope.party["pokemon" + currentInput.substring(0, 1)];
			var HPEVs = mon.EVs.HP;
			var DefEVs = mon.EVs.Def;
			var SpDEVs = mon.EVs.SpD;
			var baseHP = 0;
			var baseDef = 0;
			var baseSpD = 0;
			var typing = [];
			for (var poke in pokedex)
			{
				if (mon.name === pokedex[poke].species)
				{
					baseHP = pokedex[poke].baseStats.hp;
					baseDef = pokedex[poke].baseStats.def;
					baseSpD = pokedex[poke].baseStats.spd;
					mon.types = pokedex[poke].types;
				}
			}

			var level = 100;
			if ($scope.selectedTier === "LC") level = 5;
			else if ($scope.selectedTier === "Level 50") level = 50;

			var HPStat = 0;
			var DefStat = 0;
			var SpDStat = 0;

			var unmodHP = Math.floor(calcHP(baseHP, HPEVs, 31, level));
			var unmodDef = Math.floor(calcStat(baseDef, DefEVs, 31, level));
			var unmodSpD = Math.floor(calcStat(baseSpD, SpDEVs, 31, level));

			if ($scope.attacker.name.length >= 3)
			{
				attackingPoke.name = $scope.attacker.name;
				attackingPoke.ability = $scope.attacker.ability;
				for (var poke in pokedex)
				{
					if (attackingPoke.name === pokedex[poke].species || attackingPoke.name === pokedex[poke].species.toLowerCase())
					{
						attackingPoke.details = pokedex[poke];
						typing = pokedex[poke].types;
					}
				}

				var baseAtk = attackingPoke.details.baseStats.atk;
				var baseSpA = attackingPoke.details.baseStats.spa;

				var unmodAtk = Math.floor(calcStat(baseAtk, $scope.attacker.EVs.Atk, 31, level));
				var unmodSpA = Math.floor(calcStat(baseSpA, $scope.attacker.EVs.SpA, 31, level));

			
				attackingPoke.nature = $scope.attacker.nature;
				attackingPoke.item = $scope.attacker.item;
				var damage = ""
				damage += "<table>";
				for (var move in attackingPoke.moves)
				{
					damage += "<tr>";
					var AtkStat = calcAttack(unmodAtk, attackingPoke, mon, attackingPoke.moves[move], $scope.attackerBoostMod, $scope.sattackerBoostMod);
					var SpAStat = calcAttack(unmodSpA, attackingPoke, mon, attackingPoke.moves[move], $scope.attackerBoostMod, $scope.sattackerBoostMod);
					var DefStat = calcDef(unmodDef, attackingPoke, mon, attackingPoke.moves[move], $scope.defenderBoostMod, $scope.sdefenderBoostMod);
					var SpDStat = calcDef(unmodSpD, attackingPoke, mon, attackingPoke.moves[move], $scope.defenderBoostMod, $scope.sdefenderBoostMod);
					
					var basePower = calcBasePower(attackingPoke.moves[move], attackingPoke, mon);

					if (attackingPoke.moves[move].category === "Physical")
					{
						damage += "<td>";
						damage += attackingPoke.moves[move].name + ": </td><td>" + 
						truncToOnePlace(Math.floor(damageCalc(attackingPoke.moves[move], typing, level, AtkStat, DefStat, basePower, attackingPoke, mon)[0]) / unmodHP * 100) + "% to " + 
						truncToOnePlace(Math.floor(damageCalc(attackingPoke.moves[move], typing, level, AtkStat, DefStat, basePower, attackingPoke, mon)[1]) / unmodHP * 100) + "%";
						damage += "</td>";
						
					}

					if (attackingPoke.moves[move].category === "Special")
					{
						damage += "<td>";
						damage += attackingPoke.moves[move].name + ": </td><td>" + 
						truncToOnePlace(Math.floor(damageCalc(attackingPoke.moves[move], typing, level, SpAStat, SpDStat, basePower, attackingPoke, mon)[0]) / unmodHP * 100) + "% to " + 
						truncToOnePlace(Math.floor(damageCalc(attackingPoke.moves[move], typing, level, SpAStat, SpDStat, basePower, attackingPoke, mon)[1]) / unmodHP * 100) + "%";
						damage += "</td>";
						
					}

					damage += "</tr>";

				}
				damage += "</table>";
				$scope.defendingCalculations = damage;
			}


			
		}


	}






	var mostRecentModded = "";
	var cheatingThis = 0;

	$scope.changeWhichMon = function(which)
	{
		emptySuggestions();
		if (cheatingThis === 0)
		{




			cheatingThis++;
			for (var ev in $scope.evNums[which])
			{
				$scope.evNums[which][ev] = [4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88,92,96,100,104,108,112,116,120,124,128,132,136,140,144,148,152,156,160,164,168,172,176,180,184,188,192,196,200,204,208,212,216,220,224,228,232,236,240,244,248,252,0];
			}

			filterEVlist(which);

			$scope["howManyViewing" + mostRecentModded] = "";
			currentInput = which;
			$scope.whichMonToShow = which;

			var data = {color: $scope.yourCol, whichMon: which, name: $scope.userNick};
		
			socket.emit("viewing", data);
			socket.emit("remove viewing", mostRecentModded);
			mostRecentModded = which;
			$scope.refreshCalcs();
			$scope.refreshDefCalcs();
			$scope.calcStatNumbers(which);
			var simpMon = stripMonName($scope.party["pokemon" + currentInput.substring(0, 1)].name);
			
			getWholeLearnset(simpMon);


		}
		else
		{
			cheatingThis = 0;
			var toFocus = "focusMe" + which;
			document.getElementById(toFocus).select();
		}

	}
	
	function getWholeLearnset(simpMon)
	{
		var prevoEntry;
		var preprevoEntry;
		// alert(getPrevo(getDexEntry(simpMon)).toSource());
		if (getPrevo(getDexEntry(simpMon)))
		{
			prevoEntry = getDexEntry(getPrevo(getDexEntry(simpMon)));
		}
		if (prevoEntry)
		{
			if (getPrevo(prevoEntry))
			{
				preprevoEntry = getDexEntry(getPrevo(prevoEntry));
			}
			
		}
		

		dex.getLearnset(simpMon).success(function(data)
		{
			$scope.learnsetData = [];
			for (var move in data.learnset)
			{
				$scope.learnsetData.push(move);
			}
			if (prevoEntry)
			{
				dex.getLearnset(prevoEntry.id).success(function(prevoData)
				{
					for (var move in prevoData.learnset)
					{
						$scope.learnsetData.push(move);
					}
					if (preprevoEntry)
					{
						dex.getLearnset(preprevoEntry.id).success(function(prepreData)
						{
							
							for (var move in prepreData.learnset)
							{
								$scope.learnsetData.push(move);
							}
							

						})
					}
					
				})
			}
			
		})
	}

	$scope.changeWhichMon2 = function(which)
	{

		setTimeout(function()
		{
			$scope.changeWhichMon(which);
		}, 1)
		
		$scope.changeWhichMon(which);

	


	}

	socket.on("show view", function(data)
	{
		$scope.$apply(function()
		{
			$scope["howManyViewing" + mostRecentModded] = "";

			if (!($scope.whichMonToShow === data.whichMon))
			{
				$scope["howManyViewing" + data.whichMon] = "Being Modified";
				$scope["viewing" + data.whichMon] = {'color' : data.color};
			}

			
		});
		
	})

	socket.on("removing viewing", function(data)
	{
		$scope.$apply(function()
		{
			$scope["howManyViewing" + data] = "";

		});
		
	})
	

	$scope.getPokeSprite = function(index)
	{
		if ($scope.party["pokemon" + index].name.length > 0)
		{
			return "http://www.smogon.com/dex/media/sprites/xyicons/" + $scope.party["pokemon" + index].name.toLowerCase() + ".png";
		}	
		else
		{
			return "http://www.smogon.com/dex/media/sprites/xyicons/ditto.png";

		}

	}



	/****************************** Ability ******************************/
	/*** Code: ability ***/

	/*** Add an input box to allow any ability ***/
	$scope.getAbs = function(num)
	{
		var mon = $scope.party["pokemon" + num].name;
		var dexE = getDexEntry(mon);
		if (mon.indexOf("Mega") > -1 && dexE.baseSpecies)
		{
			mon = dexE.baseSpecies;
		}

		var abs = [];
		if (pokedex) 
		{
			var i = 0;
			for (i = 0; i < pokedex.length; i++)
			{
				if (pokedex[i].species === mon)
				{
					for (var abili in pokedex[i].abilities)
					{
						abs.push(pokedex[i].abilities[abili]);
					}
				}
			}
		}
		return abs;
	}

	$scope.selectAbility = function(num, whichAb, abName)
	{
		var dataToSend = {room: post._id, currentInput: currentInput, abName: abName, whichAb: whichAb};
		dex.updateParty(dataToSend);
		socket.emit("ability selection", dataToSend);
		$scope.refreshCalcs();
		$scope.refreshDefCalcs();
	}

	socket.on("update ability selection", function(data)
	{
		$scope.$apply(function()
		{
			$scope.party["pokemon" + data.currentInput.substring(0, 1)].ability = data.abName;
		});
	});

	$scope.IVNums = [31,30,29,28,27,26,25,24,23,22,21,20,19,18,17,16,15,14,13,12,11,10,9,8,7,6,5,4,3,2,1,0];


	/****************************** EVs and IVs ******************************/
	/*** Code: EVIV ***/


	/*** Because of EV cap, the options shrink when you start EVing your mons ***/
	$scope.chooseEV = function(whichPoke, whichEV)
	{

		var amount = $scope.party["pokemon" + whichPoke].EVs[whichEV];
		filterEVlist(whichPoke);
		var dataToSend = {room: post._id, currentInput: currentInput, whichEV: whichEV, amount: amount};
		var data = {pokemonNumber: whichPoke, whichEV: whichEV, amount: amount};
		dex.updateParty(dataToSend);
		socket.emit("fill EVs", dataToSend);
		$scope.refreshCalcs();
		$scope.refreshDefCalcs();
		$scope.calcStatNumbers(whichPoke);
		

	}

	socket.on("EVs filled", function(data)
	{
		
		$scope.$apply(function()
		{
			for (var ev in $scope.evNums[data.currentInput.substring(0, 1)])
			{
				$scope.evNums[ev] = $scope.fullEVs;
			}
			$scope.party["pokemon" + data.currentInput.substring(0, 1)].EVs[data.whichEV] = data.amount;
			filterEVlist(data.currentInput.substring(0, 1));
			$scope.calcStatNumbers(data.currentInput.substring(0, 1));

		});
	});

	$scope.chooseIV = function(whichPoke, whichIV)
	{
		var amount = $scope.party["pokemon" + whichPoke].IVs[whichIV];
		if ((amount >= 0) && (amount <= 31))
		{	
			var dataToSend = {room: post._id, currentInput: currentInput, whichIV: whichIV, amount: amount};
			dex.updateParty(dataToSend);
			socket.emit("fill IVs", dataToSend);
			$scope.refreshCalcs();
			$scope.refreshDefCalcs();
			$scope.calcStatNumbers(whichPoke);
		}
	}

	socket.on("IVs filled", function(data)
	{
		
		$scope.$apply(function()
		{
			$scope.party["pokemon" + data.currentInput.substring(0, 1)].IVs[data.whichIV] = data.amount;
			$scope.calcStatNumbers(data.currentInput.substring(0, 1));
		});
	});

	//work with sockets
	$scope.calcStatNumbers = function(whichMon)
	{
		var mon = $scope.party["pokemon" + whichMon];
		$scope.r.statNumbers = [];
		$scope.r.statNumbers = calcMonStats(mon);

	}

	function calcMonStats(mon)
	{
		var dexEntry = getDexEntry(mon.name);
		var baseStats = dexEntry.baseStats;
		var monEVs = mon.EVs;
		var monIVs = mon.IVs;
		var statNums = [];
		var nat = mon.nature.split(" ")[0];
		for (var stat in monEVs)
		{
			var bs = baseStats[stat.toLowerCase()];
			var ev = monEVs[stat];
			var iv = parseInt(monIVs[stat]);
			var level = 100;
			var natBoost = NATURES[nat][stat];
			var res = 0;
			if ($scope.selectedTier === "LC") level = 5;
			else if ($scope.selectedTier === "Level 50") level = 50;

			//calcStat(base, EV, IV, level)
			if (stat === "HP")
			{
				res = calcHP(bs, ev, iv, level);
				natBoost = 1;
			}
			else
			{
				res = calcStat(bs, ev, iv, level);
			}
			res = Math.floor(res * natBoost);
			
			statNums.push(res);
			
		}
		return statNums;
	}


	/****************************** Natures ******************************/


	$scope.doNatures = function(whichPoke, nature)
	{
		var dataToSend = {room: post._id, currentInput: currentInput, nature: nature};
		dex.updateParty(dataToSend);
		socket.emit("nature selection", dataToSend);
		$scope.refreshCalcs();
		$scope.refreshDefCalcs();
		$scope.calcStatNumbers(whichPoke);

	}

	socket.on("update nature selection", function(data)
	{
		$scope.$apply(function()
		{
			$scope.party["pokemon" + data.currentInput.substring(0, 1)].nature = data.nature;
			$scope.calcStatNumbers(data.currentInput.substring(0, 1));

		})
	})

	$scope.currentInput = [];

	/****************************** List possible options based on dex data ******************************/

	$scope.findRelMons = function(index, event)
	{
		
		$scope.suggestingMons = true;
		currentInput = "";
		currentInput = index;

		// $scope.r.pokedex = [];
		emptySuggestions();

		var q = $scope.party["pokemon" + currentInput.substring(0, 1)].name;
		

		for (var i = 0; i < pokedex.length; i++)
		{
			if (pokedex[i].species.indexOf(q) > -1 || pokedex[i].species.toLowerCase().indexOf(q) > -1)
			{
				
				if (q.length >= 2)
				{
					$scope.r.pokedex.push(pokedex[i]);

				}
			}
		}
		$scope.r.pokedex.sort(tierCompare("tier")).reverse();

		if (event.keyCode === 13)
		{

			$scope.fillInput($scope.r.pokedex[0].species);
		}

	}
	$scope.findRelMonsTab = function(event)
	{
		if (event.keyCode === 9)
		{
			$scope.fillInput($scope.r.pokedex[0].species);
		}
	}

	$scope.findRelItems = function(index, event)
	{
		

		
		currentInput = "";
		currentInput = index;

		// $scope.r.itemdex = [];
		emptySuggestions();
		var q = $scope.party["pokemon" + currentInput.substring(0, 1)].item;
		

		for (var i = 0; i < itemdex.length; i++)
		{
			if (itemdex[i].name.indexOf(q) > -1 || itemdex[i].id.indexOf(q) > -1 || itemdex[i].name.toLowerCase().indexOf(q) > -1)
			{
				
				if (q.length >= 2)
				{
					$scope.r.itemdex.push(itemdex[i]);

				}
			}
		}

		if (event.keyCode === 13)
		{
			$scope.fillInputItem($scope.r.itemdex[0].name);
		}

	}
	$scope.findRelItemsTab = function(event)
	{
		if (event.keyCode === 9)
		{
			$scope.fillInputItem($scope.r.itemdex[0].name);
		}
	}


	function stripMonName(name)
	{
		// if (name.indexOf("-Mega") > -1)
		// {
		// 	return name.replace("-Mega", "").toLowerCase();
		// }
		if (name.indexOf("-") > -1)
		{
			return name.substring(0, name.indexOf("-")).toLowerCase();
		}
		else
		{
			return name.toLowerCase();
		}
	}

	function stripMoveName(name)
	{
		return name.replace(" ", "").replace("-", "").toLowerCase();
	}


	$scope.findRelMoves = function(index, event)
	{
		// dex.getLearnset("venusaur").success(function(data)
		// {
		// 	alert(data.toSource());
		// });
		
		// alert($scope.learnsetData.toSource());

		currentInput = "";
		currentInput = index; //"pokemon" + index.substring(0, 1) + "." + "move" + index.substring(1);
	
		
		//use .learnset before the move
		// $scope.r.movedex = [];
		emptySuggestions();
		var q = $scope.party["pokemon" + index.substring(0, 1)]["move" + index.substring(1)];
		var simpMon = stripMonName($scope.party["pokemon" + currentInput.substring(0, 1)].name);
		// alert(getPrevo(getDexEntry(simpMon)));

		if (q.length >= 3)
		{
			// dex.getLearnset(simpMon).success(function(data)
			{
				// alert(data.learnset["gigadrain"]);
				for (var i = 0; i < movedex.length; i++)
				{
					if (movedex[i].name.indexOf(q) > -1 || movedex[i].name.toLowerCase().indexOf(q) > -1)
					{
						
						
						
							var moveEntry = movedex[i];
							if ($scope.learnsetData.indexOf(moveEntry.id) === -1)
							// if (!data.learnset[movedex[i].id])
							{
								moveEntry.canLearn = "Illegal";
							}
							else
							{
								moveEntry.canLearn = "";
							}
							$scope.r.movedex.push(moveEntry);

						
					}
				}

				if (event.keyCode === 13)
				{
					$scope.fillInputMove($scope.r.movedex[0].name);
				}
			}//)

		}

	}
	$scope.findRelMovesTab = function(event)
	{
		if (event.keyCode === 9)
		{
			$scope.fillInputMove($scope.r.movedex[0].name);
		}
	}


	/****************************** Put your choice into the corresponding input box ******************************/

	$scope.fillInput = function(name)
	{

		$scope.party["pokemon" + currentInput.substring(0, 1)].name = name;
		$scope.party["pokemon" + currentInput.substring(0, 1)].ability = "";
	
		// $scope.showMons($scope.selectedTier);
		// $scope.suggestingMons = false;
		// $scope.r.pokedex = [];

		getWholeLearnset(stripMonName(name));
		

		emptySuggestions();
		var data = {room: post._id, currentInput: currentInput, mon: name};
		dex.updateParty(data);
		socket.emit("mon selection", data);
		$scope.refreshCalcs();
		$scope.refreshDefCalcs();
		$scope.calcStatNumbers(currentInput.substring(0, 1));

		

	}

	$scope.fillInputItem = function(item)
	{

		
		if ($scope.selectedTier === "Level 50")
		{
			var items = getItems();
			if (items.indexOf(item) > -1)
			{
				alert("Item Clause");
				return;
			}
		}
		$scope.party["pokemon" + currentInput.substring(0, 1)].item = item;
		// $scope.r.itemdex = [];
		emptySuggestions();
		var data = {room: post._id, currentInput: currentInput, item: item};
		dex.updateParty(data);
		socket.emit("item selection", data);
		$scope.refreshCalcs();
		$scope.refreshDefCalcs();
	}

	/*** From the party, move y on Pokemon x is indexed party[x][y]. Only case where currentInput is 2 chars long ***/
	$scope.fillInputMove = function(move)
	{
		$scope.party["pokemon" + currentInput.substring(0, 1)]["move" + currentInput.substring(1)] = move;
	
		// $scope.r.movedex = [];
		emptySuggestions();
		var data = {room: post._id, currentInput: currentInput, move: move};
		dex.updateParty(data);

		socket.emit("move selection", data);
		$scope.refreshCalcs();
		$scope.refreshDefCalcs();
		
	}

	/****************************** Responding to another user choosing something about the set ******************************/

	socket.on("update mon selection", function(data)
	{

		
		$scope.$apply(function()
		{
			$scope.party["pokemon" + data.currentInput.substring(0, 1)].name = data.mon;
		});
	});

	socket.on("update item selection", function(data)
	{
		$scope.$apply(function()
		{
			$scope.party["pokemon" + data.currentInput.substring(0, 1)].item = data.item;
		})
	})

	socket.on("update move selection", function(data)
	{
		$scope.$apply(function()
		{
			$scope.party["pokemon" + data.currentInput.substring(0, 1)]["move" + data.currentInput.substring(1)] = data.move;
		})
	})



	/****************************** Chat ******************************/

	$scope.sendMessage = function(event)
	{
		if (event.keyCode === 13)
		{
			// $scope.messages += "<li>" + $scope.userNick + ": " + $scope.chatMessage + "</li>";
			var message = "<li>" + "<strong style='color:" + $scope.yourCol + "'>" + $scope.userNick + "</strong>" + ": " + $scope.chatMessage + "</li>";
			$scope.chatMessage = "";
			setTimeout(function()
			{
				socket.emit("send message", message);
			}, 100)
		}
	}

	socket.on("receive message", function(mes)
	{
		
		$scope.$apply(function()
		{
			$scope.messages += mes;
		});
		var el = document.getElementById("cheating");
		el.scrollTop = el.scrollHeight;
	});


	/****************************** Non Scope Functions ******************************/

	function calcHP(base, EV, IV, level)
	{
		return ((2*base + IV + EV / 4 + 100) * level) / 100 + 10;
	}

	function calcStat(base, EV, IV, level)
	{
		//natures is actually calculated elsewhere
		return Math.floor(((2 * base + IV + EV / 4) * level) / 100 + 5);
	}

	//types is what types the attacker is
	function damageCalc(move, typing, level, offense, defense, bp, attacker, defender)
	{

		var baseDamage;
		var minDamage;

		var mods = [];
		var effectiveness = getEffectiveness(move.type, defender.types);
		// var attacker = $scope.party["pokemon" + currentInput.substring(0, 1)];

		var stabMod;		
		//spread, weather, gravity, crit
		//random
		baseDamage = Math.floor(Math.floor((Math.floor((2 * level) / 5 + 2) * offense) / defense * bp) / 50 + 2);
		minDamage = Math.floor(85 / 100 * baseDamage);
		//STAB
		if (typing.indexOf(move.type) > -1 && attacker.ability === "Adaptability")
		{
			stabMod = 0x2000;
		}
		else if ((typing.indexOf(move.type) > -1 && !(attacker.ability === "Adaptability")))// || $scope.isAerilate || $scope.isPixilate || $scope.isRefrigerate)
		{
			stabMod = 0x1800;
		}
		else if ((typing.indexOf("Fairy") > -1 && $scope.isPixilate) || (typing.indexOf("Flying") && $scope.isAerilate) || (typing.indexOf("Ice") && $scope.isRefrigerate))
		{
			stabMod = 0x1800;
		}
		else if (attacker.ability === "Protean")
		{
			stabMod = 0x1800;
		}
		else stabMod = 0x1000;

		if (attacker.ability === "Tinted Lens" && effectiveness < 1)
		{
			mods.push(0x2000);
		}

		//defensive abilities still needed

		//expert belt

		if (attacker.item === "Life Orb")
		{
			
			mods.push(0x14CC);
		}



		var finalMod = chainMods(mods);
		minDamage = pokeRound(minDamage * stabMod / 0x1000);

		minDamage = Math.floor(minDamage * effectiveness);
		minDamage = Math.max(1, minDamage);
		minDamage = pokeRound(minDamage * finalMod / 0x1000);

		baseDamage = pokeRound(baseDamage * stabMod / 0x1000);
		baseDamage = Math.floor(baseDamage * effectiveness);
		baseDamage = Math.max(1, baseDamage);
		baseDamage = pokeRound(baseDamage * finalMod / 0x1000);

	

		return [minDamage, baseDamage];


	}
	function truncToOnePlace(num)
	{
		return Math.floor(num * 10) / 10;
	}

	function pokeRound(num)
	{
		return (num % 1 > 0.5) ? Math.ceil(num) : Math.floor(num);
	}


	function boostConverter(num)
	{
		num = parseInt(num);
		if (num < 0)
		{
			return 2 / (2 - num);
		}
		if (num > 0)
		{
			return (num + 2) / 2;
		}
		else return 1;
	}

	function decToPokeHex(num)
	{
		switch (num)
		{
			case 0.5:
				return 0x800;
				break;
			case 1:
				return 0x1000;
				break;
			case 1.1:
				return 0x1199;
				break;
			case 1.2:
				return 0x1333;
				break;
			case 1.3:
				return 0x14CD;
				break;
			case 1.5:
				return 0x1800;
				break;
			case 2:
				return 0x2000;
				break;
			default:
				return 0x1000;

		}
	}



	function chainMods(mods) 
	{
	    var M = 0x1000;
	    for(var i = 0; i < mods.length; i++) {

	        if(mods[i] !== 0x1000) 
	        {
	            M = ((M * mods[i]) + 0x800) >> 12;
	        }
	    }
	    return M;
	}


	function calcBasePower(move, attacker, defender)
	{
		
		var bp = move.basePower;

		// var attacker = $scope.party["pokemon" + currentInput.substring(0, 1)];
		var bpMods = [0x1000];

		if (attacker.ability === "Technician" && bp <= 60)
		{
			bpMods.push(0x1800);
		}
		else if (attacker.ability === "Reckless" && move.recoil)
		{
			bpMods.push(0x1333);
		}
		else if (attacker.ability === "Iron Fist" && move.flags)
		{
			if (move.flags.punch)
			{
				bpMods.push(0x1333);
			}
		}
		if (attacker.ability === "Sheer Force" && move.secondary)
		{
			bpMods.push(0x14CD);
		}
		if ($scope.plateBoost || $scope.attackerPlateBoost)
		{
			
			bpMods.push(0x1333);
		}
		else if ((attacker.item === "Muscle Band" && move.category === "Physical") || (attacker.item === "Wise Glasses" && move.category === "Special"))
		{
			bpMods.push(0x1199);
		}


		//Gen 4 Orbs
		//status, eg facade

		if (move.name === "Knock Off" && defender.item)
		{
			bpMods.push(0x1800);
		}

		$scope.isAerilate = (attacker.ability === "Aerilate" && move.type === "Normal");
		$scope.isPixilate = (attacker.ability === "Pixilate" && move.type === "Normal");
		$scope.isRefrigerate = (attacker.ability === "Refrigerate" && move.type === "Normal");

		if ($scope.isAerilate || $scope.isPixilate || $scope.isRefrigerate)
		{
			bpMods.push(0x14CD);
		}
		else if (attacker.ability === "Mega Launcher" && move.flags)
		{
			if (move.flags.pulse) bpMods.push(0x1800);
		}
		else if (attacker.ability === "Strong Jaw" && move.flags)
		{
			if (move.flags.bite) bpMods.push(0x1800);
		}
		else if (attacker.ability === "Tough Claws" && move.flags)
		{
			if (move.flags.contact) bpMods.push(0x14CD);
		}
		//account for defending mon's aura too
		else if (attacker.ability === (move.type + " Aura"))
		{
			bpMods.push(0x1547);
		}

		return Math.max(1, pokeRound(bp * chainMods(bpMods) / 0x1000));
	}




	function calcAttack(stat, attacker, defender, move, pBoost, sBoost)
	{
		var statMods = [0x1000];


		var nat = attacker.nature.split(" ")[0];
		var atkBoost = NATURES[nat].Atk;
		var spaBoost = NATURES[nat].SpA;



		if (move.category === "Physical")
		{
			stat = Math.floor(stat * atkBoost);
			stat = pokeRound(stat * boostConverter(pBoost));
		}
		else if (move.category === "Special")
		{
			stat = Math.floor(stat * spaBoost);
			stat = pokeRound(stat * boostConverter(sBoost))
		}

		// stat = Math.floor(stat * $scope.natureBoost);
		//could lead to errors because not technically right


		if ((attacker.ability === "Hustle" || attacker.ability === "hustle") && move.category === "Physical")
		{
			stat = pokeRound(stat * 1.5);
		}

		//bunch of niche stuff, https://github.com/Zarel/honko-damagecalc/blob/master/js/damage.js


		if ((attacker.item === "Soul Dew" && (attacker.name === "Latias" || attacker.name === "Latios") && move.category === "Special")
		|| (attacker.item === "Choice Band" && move.category === "Physical") || (attacker.item === "Choice Specs" && move.category === "Special"))
		{

			statMods.push(0x1800);
		}

		// else if ((attacker.item === "soul dew" && (attacker.name === "latias" || attacker.name === "latios") && move.category === "Special")
		// || (attacker.item === "choice band" && move.category === "Physical") || (attacker.item === "choice specs" && move.category === "Special"))
		// {

		// 	statMods.push(0x1800);
		// }


		return Math.max(1, pokeRound(stat * chainMods(statMods) / 0x1000));
	}

	function hitsDefense(move)
	{
		// alert(move.toSource());
		if (move.defensiveCategory)
		{
			if (move.defensiveCategory === "Physical") return true;
		}
		else if (move.category === "Physical") return true;
		else return false;
	
	}

	function calcDef(stat, attacker, defender, move, dBoost, sBoost)
	{
		var statMods = [0x1000];
		var nat = defender.nature.split(" ")[0];

		var defBoost = NATURES[nat].Def;
		var spdBoost = NATURES[nat].SpD;
		if (move.category === "Physical")
		{
			stat = Math.floor(stat * defBoost);
			stat = pokeRound(stat * boostConverter(dBoost));
		}
		else if (move.category === "Special")
		{
			stat = Math.floor(stat * spdBoost);
			stat = pokeRound(stat * boostConverter(sBoost));
		}
		
		if ((defender.item === "Soul Dew" && (defender.name === "Latios" || defender.name === "Latias") && !hitsDefense(move)) ||
            (defender.item === "Assault Vest" && !hitsDefense(move)) || (defender.item === "Eviolite")) 
		{
        	statMods.push(0x1800);

    	}


		//implement things for defending calc
		
		return Math.max(1, pokeRound(stat * chainMods(statMods) / 0x1000));
	}


	/*** EVs you're allow to use must be less than how many remaining ***/
	function lessThan(x)
	{
		return function(element)
		{
			return element <= x;
		}
	}

	function filterEVlist(which)
	{
		var totalEVs = 0;
		for (var ev in $scope.evNums[which])
		{
			totalEVs += $scope.party["pokemon" + which].EVs[ev];
		}
		var max = 508 - totalEVs;
		
		for (var ev in $scope.evNums[which])
		{
			if ($scope.party["pokemon" + which].EVs[ev] <= max)
			{
				$scope.evNums[which][ev] = $scope.fullEVs.filter(lessThan(max));
			}
		}
	}


	function getDexEntry(mon)
	{
		for (var poke in pokedex)
		{
			if (mon === pokedex[poke].species || mon === pokedex[poke].species.toLowerCase())
			{
				return pokedex[poke];
			}
		}
		return "";
	}


	function getItems()
	{
		var items = [];
		for (var poke in $scope.party)
		{
			items.push($scope.party[poke].item);
		}
		return items;
	}

	function emptySuggestions()
	{
		$scope.r.pokedex = [];
		$scope.suggestingMons = false;
		$scope.r.itemdex = [];
		$scope.r.movedex = [];
	}

	

	function getPrevo(dexEntry)
	{
		return !!dexEntry.prevo ? dexEntry.prevo : false;
	}

});

