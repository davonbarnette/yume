import {genstrapi} from "#root/apis/index.js";
import {getGeneralEmbed, getGeneralErrorEmbed} from "#utils";
import {Colors, inlineCode} from "discord.js";

export async function deleteReminder(params) {
    const {
        parentInteraction, client, discordUserId,
        optionsHandler, strapiUser, strapiGuild
    } = params
    const {del_rem_id} = optionsHandler
    let reminder = await genstrapi.reminders.findByCanonicalId(del_rem_id, {populate: "*"})
    if (strapiUser.discordUserId && reminder.discordUser.discordUserId === strapiUser.discordUserId) {
        await genstrapi.reminders.delete(reminder.documentId)
        let embed = getGeneralEmbed()
            .setTitle(":hourglass: Remove Reminder")
            .setDescription(`You have successfully removed reminder with ID: ${inlineCode(reminder.id)}. You will no longer be pingused when this reminder expires.`)
            .setColor(Colors.Green)
        return parentInteraction.editReply({
            embeds: [embed]
        })
    } else {
        let embed = getGeneralErrorEmbed()
            .setTitle(":hourglass: Remove Reminder")
            .setDescription(`Reminder with ID: ${reminder.id} is not your reminder, you siwwy dingus.`)
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }
}
