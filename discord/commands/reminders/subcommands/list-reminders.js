import {genstrapi} from "#root/apis/index.js";
import {EmbedBuilder, inlineCode, italic, time, TimestampStyles} from "discord.js";
import dayjs from "dayjs";
import {BaseUtils, getGeneralEmbed} from "#utils";

export async function listReminders(params) {
    const {
        parentInteraction, client, discordUserId,
        optionsHandler, strapiUser, strapiGuild
    } = params

    let reminders = await genstrapi.reminders.findMany({
        filters: {
            discordUser: strapiUser.id,
            reminderSent: false,
            end: {
                $gt: dayjs().toISOString()
            }
        },
        sort: "id:asc"
    })

    if (reminders) {
        let remindersListDescription = "No weminders"
        if (reminders.length > 0) {
            let maxLength = reminders[reminders.length - 1].id.toString().length
            maxLength = maxLength < 3 ? 3 : maxLength
            remindersListDescription = ""
            reminders.forEach((reminder) => {
                remindersListDescription += `\n${inlineCode(BaseUtils.stringToMaxSize(reminder.id.toString(), maxLength))} ⟶ Ends · ${time(new Date(reminder.end), TimestampStyles.ShortDateTime)}${reminder.message ? ` ▸ ${italic(reminder.message)}` : ""}`
            })
        }

        let embed = getGeneralEmbed()
            .setTitle(":hourglass: Your Weminders")
            .setDescription(remindersListDescription)
            .setColor(0x7289DA)
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }
}
