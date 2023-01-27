import {OptionsHandler} from "#utils"

export class WoTOptionsHandler extends OptionsHandler {
    choices;
    discordUserId;

    constructor(options, discordUserId) {
        super();
        this.discordUserId = discordUserId;
        this.setOptions(options);
    }

    setOptions(options) {
        options.forEach(option => {
            if (option.name === "choices") {
                this.choices = option.value.trim().split(',');
            }
        })
    }
}
