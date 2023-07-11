import { estractionPokemon } from "../choosePokemon.js";
import RemoteDataManager from "./RemoteDataManager.js";
import Pokemon from "./Pokemon.js";
import { betterRandomInt } from "../utils.js";

class Game{
	count = 0;
	enemyTeam = [];
	rdm = new RemoteDataManager();
	remoteData;
	userCoin;
	userTeam = [];
	statSaved;

	constructor(){}

	addCoins(){
		this.userCoin += 150;
		this.remoteData[0].coins =  this.userCoin;
	}

	#attack(move, pokemon, otherPokemon){
		pokemon.hp -= this.#multiplyer(move, pokemon, otherPokemon);
		let res = 100 * pokemon.hp / pokemon.hpMax;

		if(parseInt(res)> 0){
			return parseInt(res);
		}else if(parseInt(res) <= 0){
			return parseInt(0);
		}
	}

	currentCoins(){
		return "Coins: " + this.userCoin;
	}

	enemyChange(){
		this.enemyTeam.splice(0, 1);
	}

	async enemyTeamGenerator(){
		if(this.remoteData[0].eTeam.length == 0){
			for (let i = 0; i < 4; i++) {
				let enemyPokemon = new Pokemon(await estractionPokemon());
				await enemyPokemon.init();
				this.enemyTeam.push(enemyPokemon);
			}
			this.remoteData[0].eTeam = this.enemyTeam;
			return this.enemyTeam;
		}else{
			this.enemyTeam = this.remoteData[0].eTeam;
			return this.enemyTeam;
		}
		
	}

	fight(move){
		let arrayDmg = [];
		if(this.userTeam[0].speed >= this.enemyTeam[0].speed){
			arrayDmg.push(1);
		}else{
			arrayDmg.push(2);
		}
		arrayDmg.push(this.#attack(move, this.enemyTeam[0], this.userTeam[0]));
		arrayDmg.push(this.#attack(this.#getRandomMove(), this.userTeam[0], this.enemyTeam[0]));
		return arrayDmg;
	}

	
	async getData(){
		this.statSaved = sessionStorage.getItem("statSaved");
		let infoServer = await this.rdm.getList();
		let arr = [];
		if(sessionStorage.statSaved){
			let infoStorage = JSON.parse(await sessionStorage.statSaved);
			if(infoServer.payload.items[0].coins < infoStorage.coins || infoServer.payload.items[0].eTeam.length > infoStorage.eTeam.length){
				arr.push(infoStorage);
				return this.remoteData = arr;
			}else{
				return this.remoteData = infoServer.payload.items;
			}
		}else{
			return this.remoteData = infoServer.payload.items;
		}
		
	}
	
	#getRandomMove(){
		let pos = betterRandomInt(0, 3);
		return this.enemyTeam[0].moves[pos];
	}

	async getUserTeam (){
		if(this.remoteData[0].team){
			if(this.remoteData[0].team.length == 0){
				document.location = "/loose.html";
			}else{
				this.userTeam = this.remoteData[0].team;
				return this.userTeam;
			}
		}else{
			document.location = "/loose.html";
		}
	}

	async getUserCoin (){
		this.userCoin =this.remoteData[0].coins;
		return this.userCoin;
	}

	increaseCount(){
		this.count = 10;
	}


	#multiplyer(move, pokemonX, pokemonY){
		let res = move.power;
		if (pokemonY.pkmTypes.includes(move.type)) {
			res *= 1.5 ;
		}
		if (pokemonX.pkmTypes.includes(move.type)) {
			res /= 2;
		}
		let rate = betterRandomInt(1, 10);
		if(rate == 3){
			res *= 2;
		}
		return res;
	}

	
	
	
	switchBar(pokemon){
		let res = 100 * pokemon.hp / pokemon.hpMax;
		return res;
	}

	switchPokemon(index){
		let temp = this.userTeam[0];
		this.userTeam[0] = this.userTeam[index];
		this.userTeam[index] = temp;
		return this.userTeam;
	}

	async updateServerInfo(){
		if(this.count >= 2){
			await this.rdm.update(this.remoteData[0]);
			this.count = 0;
		}else{
			this.count++;
			sessionStorage.statSaved = JSON.stringify(this.remoteData[0]);
		}
		
	}
}

export default Game;