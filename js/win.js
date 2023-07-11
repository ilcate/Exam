import RemoteDataManager from "./classes/RemoteDataManager.js";
import {qs} from "./utils.js";


const _app = {};

_app.countCost = () => {
	for (let i = 0; i < 4; i++) {
		if(_app.info.payload.items[_app.info.payload.items.length-1].team[i].hp <= 0){
			_app.count+=150;
		}
	}
};

_app.displayInfo = () =>{
	qs("#display-coin-number").innerHTML = "you have " + _app.coin + " coins!";
	_app.countCost();
	if(_app.count >  0){
		qs("#heal-team").innerHTML = "Heal all for " + "<br>" + _app.count + " coins";
	}else{
		_app.div.classList.add("d-none");
	}
};


_app.evList = () => {
	qs("#heal-team-btn").addEventListener("click", () =>{
		for (let i = 0; i < 4; i++) {
			_app.info.payload.items[0].team[i].hp = _app.info.payload.items[0].team[i].hpMax;
		}
		_app.div.classList.add("d-none");
		_app.coin-=_app.count;
		qs("#display-coin-number").innerHTML = "you have " + _app.coin + " coins!";
	});
	qs("#play-again").addEventListener("click", () =>{
		_app.update();
		setTimeout(() => {
			document.location = "/game.html";
		}, 500);
	});
	
};

_app.update = async () => {
	_app.info.payload.items[0].eTeam = [];
	_app.info.payload.items[0].coins = _app.coin;
	await _app.rdm.update(_app.info.payload.items[0]);
};

_app.startUp = async () =>{
	sessionStorage.statSaved = "";
	_app.rdm = new RemoteDataManager();
	_app.info = await _app.rdm.getList();
	_app.count = 0;
	_app.coin = _app.info.payload.items[_app.info.payload.items.length-1].coins+150;
	_app.div = qs("#heal-team-btn");
	
	_app.displayInfo();
	_app.evList();
};

_app.startUp();