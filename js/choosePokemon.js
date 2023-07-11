import { betterRandomInt } from "./utils.js";
const regions = ["kanto", "original-johto", "hoenn", "original-sinnoh"];
const apiUrl = "https://pokeapi.co/api/v2/pokedex/";


const _app = {};
_app.pokemonArr = [];
_app.bannedPokemon = ["deoxys", "ditto", "wormadam", "wynaut", "kakuna", "weedle", "metapod", "magikarp", "unown", "cascoon", "silcoon", "ho-oh", "hoppip", "mr-mime"];



async function estractionPokemon(){
	_app.pokemonArr = [...await _app.getPokemon()];

	_app.pos = _app.getPosition();
	
	return _app.pokemonArr[_app.pos].pokemon_species.name;
	
}

_app.getPokemon = async () => {
	_app.regionRdm = regions[Math.floor(Math.random()*regions.length)];
	return fetch(apiUrl+_app.regionRdm)
	.then((response) => response.json())
	.then((data) =>{
		return data.pokemon_entries;
	})
	.catch((err) => {
		console.error("region not found" + err);
	});
};

_app.getPosition = () => {
	_app.pos = betterRandomInt(0, _app.pokemonArr.length-1);
	if(_app.bannedPokemon.includes(_app.pokemonArr[_app.pos].pokemon_species.name)){
		return _app.getPosition();
	}else{
		return _app.pos;
	}
};



export { estractionPokemon };