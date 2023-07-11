import { betterRandomInt } from "../utils.js";
class Pokemon{
	#pokeUrl = "https://pokeapi.co/api/v2/pokemon/";
	sprites;
	pkmTypes = [];
	hp;
	hpMax;
	moves = [];
	speed;
	check = [];

	
	constructor(name){
		this.name = name;
	}

	async #getMoves (moves){
		while(this.check.length < 4 && this.moves.length < 4){
			let pos = betterRandomInt(0, moves.length);
			if(moves[pos] && moves[pos].move){
				await this.#getSpecs(await moves[pos].move.url).then(data =>{
					if(data.power !== null && !this.check.includes(data.name)){
						let move = { name: data.name, power:data.power, type:data.type.name};
						this.moves.push(move);
						this.check.push(data.name);
					}
				});
			}
		}
	}

	async #getSpecs(toFetch) {
		return fetch(toFetch)
		.then((response) => response.json())
		.then((data) =>{
			return data;
		})
		.catch((err) => {
			console.error("not found" + err);
		});
	}

	async init () {
		await this.#splitting();
	}

	async #splitting() {
		return await this.#getSpecs(this.#pokeUrl + this.name).then(data =>{

			this.sprites = [data.sprites.back_default, data.sprites.front_default];

			this.hp = 100+ data.stats[0].base_stat;
			this.hpMax = 100+ data.stats[0].base_stat;

			let movesArray = [...data.moves];
			this.#getMoves(movesArray);

			this.speed = data.stats[5].base_stat;

			if (data.types.length != 1) {
				this.pkmTypes.push(data.types[0].type.name, data.types[1].type.name);
			}else{
				this.pkmTypes.push(data.types[0].type.name);
			}
		});
	}

	
}

export default Pokemon;