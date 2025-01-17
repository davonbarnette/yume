import {OptionsHandler} from "#utils"

export class RotationsOptionsHandler extends OptionsHandler {
    discordUserId;

    constructor(options, discordUserId) {
        super();
        this.discordUserId = discordUserId;
        this.setOptions(options);
    }

    setOptions(options) {
        options.forEach(option => {
            switch (option.name) {
                default:
                    break
            }
        })
    }
}
