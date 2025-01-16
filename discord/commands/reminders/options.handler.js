import {OptionsHandler} from "#utils"

export class RemindersOptionsHandler extends OptionsHandler {
    channel;
    hours
    minutes
    afk_hours
    afk_minutes
    discordUserId;

    constructor(options, discordUserId) {
        super();
        this.discordUserId = discordUserId;
        this.setOptions(options);
    }

    setOptions(options) {
        options.forEach(option => {
            switch (option.name) {
                case "channel":
                    this.channel = option.value
                    break
                case "hours":
                    this.hours = option.value
                    break
                case "minutes":
                    this.minutes = option.value
                    break
                case "afk_hours":
                    this.afk_hours = option.value
                    break
                case "afk_minutes":
                    this.afk_minutes = option.value
                    break
                case "message":
                    this.message = option.value
                    break
                case "del_rem_id":
                    this.del_rem_id = option.value
            }
        })
    }
}
