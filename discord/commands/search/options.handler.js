import {OptionsHandler} from "#utils"

export class SearchOptionsHandler extends OptionsHandler {
    documentId;
    discordUserId;

    constructor(options, discordUserId) {
        super();
        this.discordUserId = discordUserId;
        this.setOptions(options);
    }

    setOptions(options) {
        options.forEach(option => {
            if (option.name === "type") {
                this.type = option.value
            }
        })
    }
}
