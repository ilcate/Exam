import RemoteDataManager from "./classes/RemoteDataManager.js";

const _app = {};

_app.rdm = new RemoteDataManager();
_app.info = await _app.rdm.getList();


_app.addEvent= () =>{
	document.getElementById("newGame").addEventListener("click", async () =>{
		if (_app.info.payload.items[0]){
			alert("you already have a team");
		}else{
			document.location = "/choosePokemon.html";
		}
	});
};

_app.startUp = () =>{
	if(!_app.info.payload.items[0]){
		document.getElementById("continue").remove();
	}else{
		document.getElementById("continue").addEventListener("click", async () =>{
			if(_app.info.payload.items[0]){
				document.location = "/choosePokemon.html"; 
			}else{
				alert("you dont have any team");
			}
		});
	}

	_app.addEvent();
	
};


_app.startUp();