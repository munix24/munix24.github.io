class Champ {
    constructor(name, level) {
        this.name = name;
        this.level = level;
        this.stats = this.getChampStats(name);

        // Initialize current stats based on level
        this.maxhp = this.calculateStatAtLevel(this.stats["hp"], this.stats["hpperlevel"]);
        this.hp = this.maxhp;
        this.armor = this.calculateStatAtLevel(this.stats["armor"], this.stats["armorperlevel"]);
        this.spellblock = this.calculateStatAtLevel(this.stats["spellblock"], this.stats["spellblockperlevel"]);
        this.attackdamage = this.calculateStatAtLevel(this.stats["attackdamage"], this.stats["attackdamageperlevel"]);
        this.attackspeed = this.calculateStatAtLevel(this.stats["attackspeed"], this.stats["attackspeedperlevel"]);

        this.attack_cd = 0;  // Initialize attack cooldown to 0
    }

    getChampStats(name) {
		if (window.json === undefined) {	//check if global json data was brought in
			throw new Error('Could not find champion json data');
		} else {
			if (json['data'].hasOwnProperty(name))
			{
				return json['data'][name].stats;
			} else {
				throw new Error('Could not find champion name in json data');
			}
		}
    }

    async fetchChampStats() {	//CORS ERROR
        const response = await fetch('champion.json');
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