import {OptionsHandler} from "#utils"

export class ImageGPTOptionsHandler extends OptionsHandler {
    text;
    discordUserId;

    constructor(options, discordUserId) {
        super();
        this.discordUserId = discordUserId;
        this.setOptions(options);
    }

    setOptions(options) {
        options.forEach(option => {
            if (option.name === "text") {
                this.text = option.value;
            }
        })
    }
}
