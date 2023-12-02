import {OptionsHandler} from "#utils"

export class lrOptionsHandlerClass extends OptionsHandler {
    players;
    discordUserId;
    numItems;
    constructor(options, discordUserId) {
        super();
        this.discordUserId = discordUserId;
        this.setOptions(options);
    }

    setOptions(options) {
        options.forEach(option => {
            if (option.name === "players") {
                const players = option.value.split(',')
                this.players = players.map(player => player.trim().substring(0, 4))
            } else if (option.name === "items"){
                this.numItems = option.value
            }
        })
    }
}
