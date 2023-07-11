import { buildDomImg, qs, qsa, addLoading, removeLoading } from "./utils.js";
import Game from "./classes/GameClass.js";

const _app = {};


_app.addingEventListener = () => {
	_app.menuButtonsListener();
	_app.pokemonPreview();
	_app.moveListener();
};

_app.addMoveColor = () => {
	let allMovesBox = qsa(".move-box");
	
	for (let i = 0; i < 4; i++) {
		while (allMovesBox[i].classList.length > 0) {
			allMovesBox[i].classList.remove(allMovesBox[i].classList.item(0));
		}
		allMovesBox[i].classList.add("move-box");
		allMovesBox[i].classList.add(_app.userTeam[0].moves[i].type);
	}
};

_app.addMoveName = () => {
	qs("#move-1").innerHTML = _app.userTeam[0].moves[0].name;
	qs("#move-2").innerHTML = _app.userTeam[0].moves[1].name;
	qs("#move-3").innerHTML = _app.userTeam[0].moves[2].name;
	qs("#move-4").innerHTML = _app.userTeam[0].moves[3].name;
};

_app.applyChange = (index) => {
	if(_app.canChange == true && _app.userTeam[index].hp > 0){
		_app.battle.switchPokemon(index);
		_app.updateBar("#user-life-per", _app.battle.switchBar(_app.userTeam[0]));
		return _app.removeAddedElements();
	}else if(_app.userTeam[index].hp < 1){
		alert("you can't select a dead pokemon");
	}else{
		return alert("to change pokemon click pokemon button first");
	}
};

_app.changeButtonsFight = () => {
	_app.toDNone(".menu-btn", "d-none");
	_app.removeDnone(".move-btn", "d-none");
	_app.removeDnone(".back-btn", "d-none");
	_app.addMoveName();
	_app.addMoveColor();
};

_app.changeButtonsPokemon = () => {
	let changeBg = qsa(".box-bench");
	changeBg.forEach(element => {
		if(!element.classList.contains("bw")){
			element.src = "assets/bButton.png" ;
			element.classList.add("box-image-bg");
		}
	});
	let changeColor = qsa(".p-l");
	changeColor.forEach(element => {
		if(!element.classList.contains("bw")){
			element.classList.add("text-color");
		}
	});
};

_app.checkAndSub = (index) => {
	if(_app.userTeam[0].hp >= 1){
		_app.lastUserHp = _app.userTeam[0].hp;
		_app.lastEnemyHp = _app.enemyTeam[0].hp;
		_app.percentage = _app.battle.fight(_app.userTeam[0].moves[index]);
		_app.updateAllLifeBars();
	}else{
		_app.pokemonDead();
	}
};

_app.checkStatusTeam = async () => {
	if (_app.enemyTeam.length == 0) {
		setTimeout(() => {
			_app.battle.deleteExtras();
			_app.battle.currentCoins(_app.coins);
			_app.battle.updateServerInfo();
		}, 1000);
		setTimeout(() => {
			document.location = "/win.html";
		}, 500);
	}else{
		_app.battle.updateServerInfo();
		for (let i = 0; i < _app.userTeam.length; i++) {
			if(_app.userTeam[i].hp <= 0){
				_app.ko++;
			}
		}
		if (_app.ko == 4) {
			setTimeout(() => {
				document.location = "/loose.html";
			}, 500);
		}else{
			_app.ko = 0;
		}
	}
};

_app.displayAll = () => {
	if(!qs(".pokemon-user-active")){
		_app.displayPokemonUser();
		_app.displayBench();
	}
	if(!qs(".pokemon-enemy-active")){
		_app.displayPokemonEnemy();
	}
	_app.displayCoin();
	if (qs("#loader")) {
		setTimeout(() => {
			removeLoading();
		}, 500);
	}
	_app.canChange = false;
};

_app.displayBench = () => {
	_app.benchPokemon1 = document.createElement("img");
	_app.benchPokemon2 = document.createElement("img");
	_app.benchPokemon3 = document.createElement("img");
	buildDomImg(_app.benchPokemon1 , 1, "#pokemon1-bench", "pokemon-preview", _app.userTeam, 1);
	buildDomImg(_app.benchPokemon2, 2, "#pokemon2-bench", "pokemon-preview", _app.userTeam, 1);
	buildDomImg(_app.benchPokemon3, 3, "#pokemon3-bench", "pokemon-preview", _app.userTeam, 1);
	qs("#pokemon1-bench-name").innerHTML = _app.userTeam[1].name;
	qs("#pokemon2-bench-name").innerHTML = _app.userTeam[2].name;
	qs("#pokemon3-bench-name").innerHTML = _app.userTeam[3].name;
	for (let i = 1; i < _app.userTeam.length; i++) {
		_app.makeBW(i);
	}
};

_app.displayCoin = () => {
	qs("#coin-display").innerHTML = _app.battle.currentCoins();
};

_app.displayPokemonEnemy = () => {
	_app.checkStatusTeam();
	if (_app.enemyTeam.length !== 0) {
		_app.enemyActivePokemon = document.createElement("img");
		buildDomImg(_app.enemyActivePokemon, 0, "#active-pkm-enemy", "pokemon-enemy-active", _app.enemyTeam, 1);
		qs("#enemy-pokemon-name").innerHTML = _app.enemyTeam[0].name;
		_app.updateBar("#enemy-life-per", _app.battle.switchBar(_app.enemyTeam[0]));
	}
};

_app.displayPokemonUser = () => {
	_app.checkStatusTeam();
	_app.userActivePokemon = document.createElement("img");
	buildDomImg(_app.userActivePokemon, 0, "#active-pkm-user", "pokemon-user-active", _app.userTeam, 0);
	qs("#user-pokemon-name").innerHTML = _app.userTeam[0].name;
	_app.updateBar("#user-life-per", _app.battle.switchBar(_app.userTeam[0]));
	if (_app.userTeam[0].hp <=0) {
		_app.updateBar("#user-life-per", 0);
		_app.pokemonDead();
	}
};

_app.enemyPokemonDead = () => {
	setTimeout(() => {
		_app.battle.addCoins();
		_app.enemyActivePokemon.remove();
		_app.battle.enemyChange();
		_app.displayAll();
		_app.updateBar("#enemy-life-per", 100);
	}, 1500);
};

_app.makeBW = (index) => {
	if (_app.userTeam[index].hp <= 0) {
		let div = qs("#pokemon"+index+"-bench-box");
		let son = div.querySelector(".box-bench");
		let sonText = div.querySelector(".p-l");
		son.classList.add("bw");
		sonText.classList.add("bw");
		div.classList.add("bw");
	}
};

_app.menuButtonsListener = () => {
	qs("#fightButton").addEventListener("click", () =>{
		if(_app.userTeam[0].hp > 1){
			_app.removeAddedElements();
			_app.changeButtonsFight();
		}else{
			alert("dead pokemons can't attack, switch it");
		}
	});
	qs("#changePokemonButton").addEventListener("click", () =>{
		_app.canChange = true;
		_app.changeButtonsPokemon();
	});
	qs("#surrenderButton").addEventListener("click", () =>{
		if(confirm("Do you REALLY want to GIVE UP?")){
			setTimeout(() => {
				document.location = "/loose.html";
			}, 500);
		}
	});
	qs("#saveBtn").addEventListener("click", () =>{
		if(confirm("you want to SAVE and RETURN to the home?")){
			_app.battle.increaseCount();

			_app.battle.updateServerInfo();
			
			setTimeout(() => {
				document.location = "/index.html";
			}, 500);
		}
	});
};

_app.moveListener = () => {
	qs("#move-btn-1").addEventListener("click", () =>{
		_app.checkAndSub(0);
	});
	qs("#move-btn-2").addEventListener("click", () =>{
		_app.checkAndSub(1);
	});
	qs("#move-btn-3").addEventListener("click", () =>{
		_app.checkAndSub(2);
	});
	qs("#move-btn-4").addEventListener("click", () =>{
		_app.checkAndSub(3);
	});
	qs("#back-btn").addEventListener("click", () =>{
		_app.resetMenu();
	});
};

_app.pokemonDead = () => {
	setTimeout(() => {
		_app.resetMenu();
		_app.canChange = true;
		_app.changeButtonsPokemon();
		_app.checkStatusTeam();
	}, 1500);
};

_app.pokemonPreview = () => {
	qs("#pokemon1-bench-box").addEventListener("click", () =>{
		return _app.applyChange(1);
	});
	qs("#pokemon2-bench-box").addEventListener("click", () =>{
		return _app.applyChange(2);
	});
	qs("#pokemon3-bench-box").addEventListener("click", () =>{
		return _app.applyChange(3);
	});
};


_app.removeAddedElements = () => {
	_app.userActivePokemon.remove();
	_app.benchPokemon1.remove();
	_app.benchPokemon2.remove();
	_app.benchPokemon3.remove();
	_app.resetButtons();
};

_app.removeDnone = (cssClass, removeCssClass) => {
	let changeBg = qsa(cssClass);
	changeBg.forEach(element => {
		element.classList.remove(removeCssClass);
	});
};

_app.resetButtons = () => {
	let changeBg = qsa(".box-bench");
	changeBg.forEach(element => {
		element.src = "assets/tButton.png" ;
		element.classList.remove("box-image-bg");
	});
	_app.removeDnone(".p-l", "text-color");
	_app.displayAll();
};

_app.resetMenu = () => {
	_app.removeDnone(".menu-btn", "d-none");
	_app.toDNone(".move-btn", "d-none");
	_app.toDNone(".back-btn", "d-none");
	
	_app.addMoveName();
};


_app.startUp =  async () => {
	_app.ko = 0;
	_app.backUpLoading = qs("#loader");
	addLoading(_app.backUpLoading);
	

	_app.battle = new Game();
	await _app.battle.getData();
	
	_app.userTeam = await _app.battle.getUserTeam();
	_app.enemyTeam = await _app.battle.enemyTeamGenerator();
	_app.coins = await _app.battle.getUserCoin();
	_app.divs = [];
	_app.addingEventListener();
	_app.displayAll();
	
	setTimeout(() => {
		_app.battle.updateServerInfo();
	}, 3000);
};

_app.toDNone = (cssClass, addCSS) => {
	let changeBg = qsa(cssClass);
	changeBg.forEach(element => {
		element.classList.add(addCSS);
	});
};

_app.updateAllLifeBars = () => {
	if(_app.percentage[0] == 1){
		_app.updateBar("#enemy-life-per", _app.percentage[1]);
		if (_app.enemyTeam[0].hp >= 1) {
			setTimeout(() => {
				_app.updateBar("#user-life-per", _app.percentage[2]);
			}, 1000);
		}else{
			_app.userTeam[0].hp = _app.lastUserHp;
			_app.enemyPokemonDead();
		}
		if (_app.userTeam[0].hp < 1){
			_app.pokemonDead();
		}

	}else if(_app.percentage[0] == 2){
		_app.updateBar("#user-life-per", _app.percentage[2]);
		if (_app.userTeam[0].hp >= 1) {
			setTimeout(() => {
				_app.updateBar("#enemy-life-per", _app.percentage[1]);
			}, 1000);
		}else{
			_app.enemyTeam[0].hp = _app.lastEnemyHp;
			_app.pokemonDead();
		}
		if(_app.enemyTeam[0].hp < 1){
			_app.enemyPokemonDead();
		}
	}
};

_app.updateBar = (id, value) => {
	if(value <= 50 && value > 15){
		qs(id).style.backgroundColor = "#E4D00A";
	}else if(value <= 15){
		qs(id).style.backgroundColor = "#C70039";
	}else{
		qs(id).style.backgroundColor = "#0BDA51";
	}
	qs(id).style.width = value+"%";
};

_app.startUp();

