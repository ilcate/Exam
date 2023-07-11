import { estractionPokemon } from "./choosePokemon.js";
import RemoteDataManager from "./classes/RemoteDataManager.js";
import { qs, qsa, removeLoading, addLoading, buildDomImg } from "./utils.js";
import Pokemon from "./classes/Pokemon.js";

const _app = {};
_app.tsc = false;

_app.getStarters = async () => {
	_app.starters = [];
	let starterSaved = sessionStorage.getItem("starterSaved");
	sessionStorage.getItem("teamSaved");
	if (!starterSaved || starterSaved == ""){
		_app.starter1 = new Pokemon(await estractionPokemon());
		_app.starter2 = new Pokemon(await estractionPokemon());
		_app.starter3 = new Pokemon(await estractionPokemon());
		await _app.starter1.init();
		await _app.starter2.init();
		await _app.starter3.init();
	
		await _app.starters.push(await _app.starter1, await _app.starter2, await _app.starter3);
		setTimeout(() => {
			sessionStorage.setItem("starterSaved", JSON.stringify(_app.starters));
		}, 1000);

	}else{
		_app.starters = JSON.parse(starterSaved);
	}

	_app.updatePokemon(_app.starters)
	.then(data => {
		setTimeout(() => {
			removeLoading();
		}, 1000);
	});

};

_app.nextPhase = async () => {
	_app.selection = qs(".active");
	
	if( _app.team.length === 4 && _app.tsc === true && _app.selection == undefined){
		sessionStorage.statSaved = "";
		sessionStorage.teamSaved = "";
		document.location = "/game.html";
	}else if(_app.selection == undefined){
		alert("choose a pokemon");
	}else{
		sessionStorage.starterSaved = "";
		sessionStorage.getItem("starterSaved");
		
		_app.team.push(_app.starters[_app.selection.dataset.index]);
		_app.toPush =_app.starters[_app.selection.dataset.index];
		sessionStorage.setItem("teamSaved", JSON.stringify(_app.team));

		_app.resetHtml(_app.selection);

		qs("#status").innerHTML = _app.team.length + 1 +"/4";
		if(_app.team.length === 4){
			_app.teamShowcase();
		}else{
			addLoading(_app.backUpLoading);
			await _app.getStarters();
		}
	}
};

_app.pokemonSelected = (div, pokemonDiv) => {
	const elements = qsa('*');

	elements.forEach((element) => {
		element.classList.remove("active");
		element.classList.remove("yellow");
	});

	pokemonDiv.classList.add("yellow");
	qs(div).classList.add("active");
};

_app.removePokeballs = () =>{
	let pokeball = qsa(".pokeball-starters");
	pokeball.forEach(element => {
		element.remove();
	});
};


_app.resetHtml = (div) => {
	let item = "#"+div.id;
	qs(item).classList.remove("active");

	_app.firstStarterDisplay.remove();
	_app.secondStarterDisplay.remove();
	_app.thirdStarterDisplay.remove();
};

_app.startUp = async () => {
	const rdm = new RemoteDataManager();
	let info = await rdm.getList();

	if(info.payload.items[0]){
		if(info.payload.items[0].team){
			_app.team = info.payload.items[0].team;
			removeLoading();
			return _app.teamShowcase();
		}
	}   
	if(sessionStorage.teamSaved){
		_app.team = [...JSON.parse(sessionStorage.teamSaved)];
		if(_app.team.length === 4){
			removeLoading();
			return _app.teamShowcase();
		}
	}else{
		_app.team = [];
	}
	await _app.getStarters();
	qs("#next-btn").addEventListener("click", () =>{
		_app.nextPhase();
	});
	qs("#status").innerHTML = _app.team.length + 1 + "/4";
	
	_app.backUpLoading = qs("#loader");
};



_app.teamShowcase = async() => {
	qs("#status").innerHTML = "";
	_app.tsc = true;
	_app.removePokeballs();
	qs("#team").innerHTML = "This is your team";
	
	_app.firstPkm = document.createElement("img");
	_app.secondPkm = document.createElement("img");
	_app.thirdPkm = document.createElement("img");
	_app.fourthPkm = document.createElement("img");

	buildDomImg(_app.firstPkm, 0, "#divFirst", "team-show-case", _app.team, 1);
	buildDomImg(_app.secondPkm, 1, "#divFirst", "team-show-case", _app.team, 1);
	buildDomImg(_app.thirdPkm, 2, "#divFirst", "team-show-case", _app.team, 1);
	buildDomImg(_app.fourthPkm, 3, "#divFirst", "team-show-case", _app.team, 1);
	
	qs("#next-btn").addEventListener("click", () =>{
		_app.nextPhase();
	});
	
	let rdm = new RemoteDataManager();
	let info = await rdm.getList();
	if(info.payload.items.length == 0){
		rdm.insert({
			nodeType: "team",
			team: _app.team,
			coins: 0,
			eTeam: [],
		});
	}
};


_app.updatePokemon = async () => {
	qs("#team").innerHTML = "Choose a Pokemon";
	_app.firstStarterDisplay = document.createElement("img");
	_app.secondStarterDisplay = document.createElement("img");
	_app.thirdStarterDisplay = document.createElement("img");
	buildDomImg(_app.firstStarterDisplay, 0, "#divFirst", "starter-show-case", _app.starters, 1);
	buildDomImg(_app.secondStarterDisplay, 1, "#divSecond", "starter-show-case", _app.starters, 1);
	buildDomImg(_app.thirdStarterDisplay, 2, "#divThird", "starter-show-case", _app.starters, 1);

	qs("#divFirst").addEventListener("click", () =>{
		_app.pokemonSelected("#divFirst", _app.firstStarterDisplay);
	});

	qs("#divSecond").addEventListener("click", () =>{
		_app.pokemonSelected("#divSecond", _app.secondStarterDisplay);
	});

	qs("#divThird").addEventListener("click", () =>{
		_app.pokemonSelected("#divThird", _app.thirdStarterDisplay);
	});

};

_app.startUp();