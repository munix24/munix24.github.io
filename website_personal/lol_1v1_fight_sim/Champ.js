class Champ {
    constructor(name, level) {
        this.name = name;
        this.level = level;
        this.stats = this.getChampStats(name);
        this.spells = this.getChampSpells(name);

        // Initialize current stats based on level
        this.maxhp = this.calculateStatAtLevel(this.stats["hp"], this.stats["hpperlevel"]);
        this.hp = this.maxhp;
        this.maxmp = this.calculateStatAtLevel(this.stats["mp"], this.stats["mpperlevel"]);
        this.mp = this.maxhp;
        this.movespeed = this.movespeed;
        this.armor = this.calculateStatAtLevel(this.stats["armor"], this.stats["armorperlevel"]);
        this.spellblock = this.calculateStatAtLevel(this.stats["spellblock"], this.stats["spellblockperlevel"]);
        this.hpRegen = this.calculateStatAtLevel(this.stats["hpregen"], this.stats["hpregenperlevel"]);
        this.mpRegen = this.calculateStatAtLevel(this.stats["mpregen"], this.stats["mpregenperlevel"]);
        this.attackdamage = this.calculateStatAtLevel(this.stats["attackdamage"], this.stats["attackdamageperlevel"]);
        this.attackspeed = this.calculateStatAtLevel(this.stats["attackspeed"], this.stats["attackspeedperlevel"]);

        this.attack_cd = 0;  // Initialize attack cooldown to 0
        this.vsChampions = [];  //array to hold win/lose result of simFight vs all other champions
        
        this.champStatsCost = this.getChampStatsCost();
        this.champStatsCostPerLevel = this.getChampStatsCostPerLevel();
    }

    getChampStats(championName) {
		if (window.champions === undefined) {	//check if global json data was brought in
			throw new Error('Could not find champion json data');
		} else {
			if (window.champions['data'].hasOwnProperty(championName))
			{
				return window.champions['data'][championName].stats;
			} else {
				throw new Error('Could not find champion name in json data');
			}
		}
    }

    getChampStatsCost() {
        let baseHp = 500;
        let hpCost = 400 / 150;
        let baseMp = 0;
        let mpCost = 350 / 250;
        let baseMvm = 325;
        let mvmCost = 300 / 25;
        let baseArmor = 18;
        let armorCost = 300 / 15;
        let baseMr = 22;
        let mrCost = 450 / 25;
        let hpRegenCost = 300 / 100;
        let mpRegenCost = 250 / 50;
        let baseAd = 40;
        let adCost = 350 / 10;
        let baseAs = .625;
        let asCost = 300 / 12;
        return Math.round(
            (this.maxhp - baseHp) * hpCost + 
            (this.maxmp - baseMp) * mpCost + 
            (this.stats["movespeed"] - baseMvm) * mvmCost + 
            (this.armor - baseArmor) * armorCost + 
            (this.spellblock - baseMr) * mrCost + 
            (this.hpRegen) * hpRegenCost +                  
            (this.mpRegen) * mpRegenCost +                
            (this.attackdamage - baseAd) * adCost + 
            (this.attackspeed - baseAs) * 10 * asCost);    //value is a decimal and cost is per % 
		// if (window.champions === undefined) {	//check if global json data was brought in
		// 	throw new Error('Could not find champion json data');
		// } else {
		// 	if (window.champions['data'].hasOwnProperty(championName))
		// 	{
		// 		return window.champions['data'][championName].stats;
		// 	} else {
		// 		throw new Error('Could not find champion name in json data');
		// 	}
		// }
    }

    getChampStatsCostPerLevel() {
        let hpCost = 400 / 150;
        let mpCost = 350 / 250;
        let armorCost = 300 / 15;
        let mrCost = 450 / 25;
        let hpRegenCost = 300 / 100;
        let mpRegenCost = 250 / 50;
        let adCost = 350 / 10;
        let asCost = 300 / 12;
        return Math.round(
            this.stats["hpperlevel"] * hpCost + 
            this.stats["mpperlevel"] * mpCost + 
            this.stats["armorperlevel"] * armorCost + 
            this.stats["spellblockperlevel"] * mrCost + 
            this.stats["hpregenperlevel"] * hpRegenCost + 
            this.stats["mpregenperlevel"] * mpRegenCost + 
            this.stats["attackdamageperlevel"] * adCost + 
            this.stats["attackspeedperlevel"] * asCost);
		// if (window.champions === undefined) {	//check if global json data was brought in
		// 	throw new Error('Could not find champion json data');
		// } else {
		// 	if (window.champions['data'].hasOwnProperty(championName))
		// 	{
		// 		return window.champions['data'][championName].stats;
		// 	} else {
		// 		throw new Error('Could not find champion name in json data');
		// 	}
		// }
    }

    getChampSpells(championName) {
		if (window.champions === undefined) {	//check if global json data was brought in
			throw new Error('Could not find champion json data');
		} else {
			if (window.champions['data'].hasOwnProperty(championName))
			{
				return window.champions['data'][championName].spells;
			} else {
				throw new Error('Could not find champion name in json data');
			}
		}
    }

    async fetchChampStats() {	//CORS ERROR
        const response = await fetch('championFull.json');
        const data = await response.json();
        // return data[name].stats;
        return data;
    }

    attack(opponent) {
        if (!opponent.isDefeated()) {
            opponent.receiveDamage(this.attackdamage);
            this.attack_cd += 1 / this.attackspeed;
        }
    }

    receiveDamage(damage) {
        this.hp -= damage;
    }

    calculateStatAtLevel(baseStat, increasePerLevel) {
        return baseStat + (this.level - 1) * increasePerLevel;
    }

    isDefeated() {
        return this.hp <= 0;
    }

    reset() {
        this.hp = this.maxhp;
        this.attack_cd = 0;
    }

    printStats() {
        console.log(JSON.stringify(this.stats));
    }
}