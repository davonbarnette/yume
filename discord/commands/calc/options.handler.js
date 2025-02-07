import {OptionsHandler} from "#utils"

export class ChestGrowthOptionsHandler extends OptionsHandler {
    discordUserId;

    constructor(options, discordUserId) {
        super();
        this.discordUserId = discordUserId;
        this.setOptions(options);
    }

    setOptions(options) {
        options.forEach(option => {
            switch (option.name) {
                case "bronze":
                    this.bronze = option.value
                    break
                case "silver":
                    this.silver = option.value
                    break
                case "gold":
                    this.gold = option.value
                    break
                case "pet":
                    this.pet = option.value
                    break
                case "gem":
                    this.gem = option.value
                    break
                case "mileage":
                    this.mileage = option.value
                    break
                case "mileage_points":
                    this.mileage_points = option.value
                    break
                default:
                    break
            }
        })
    }
    get numChests(){
        return {
            bronze: this.bronze,
            silver: this.silver,
            gold: this.gold,
            pet: this.pet,
            gem: this.gem,
        }
    }
    get curMileage(){
        return {
            chestType: this.mileage,
            points: this.mileage_points
        }
    }
}
