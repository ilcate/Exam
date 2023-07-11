import RemoteDataManager from "./classes/RemoteDataManager.js";
import {qs} from "./utils.js";

const _app = {};

_app.displayInfo = async() =>{
	if(_app.info.payload.items[0].coins == undefined || _app.info.payload.items[0].coins == 0){
		qs("#display-coin-number").classList.add("d-none");
	}else{
		_app.toDisplay = "you collected " + _app.info.payload.items[0].coins + " coins!";
		qs("#display-coin-number").innerHTML = _app.toDisplay;
		
		// console.log(_app.info.payload.items[0])
	}
};

_app.evList = () => {
	qs("#try-again-btn").addEventListener("click", () =>{
		setTimeout(() => {
			document.location = "/index.html";
		}, 500);
	});
};

_app.startUp = async () => {
	sessionStorage.statSaved = "";
	sessionStorage.teamSaved = "";
	// console.log(sessionStorage)
	_app.rdm = new RemoteDataManager();
	_app.info = await _app.rdm.getList();

	await _app.rdm.delete(_app.info.payload.items[0]);
	
	_app.evList();
	_app.displayInfo();
};

_app.startUp();