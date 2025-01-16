import {BaseUtils, getGeneralEmbed, getGeneralErrorEmbed} from "#utils";
import {bold, Colors, time, TimestampStyles} from "discord.js";
import {genstrapi} from "#root/apis/index.js";

export function setPersonalAfkTimer(params) {
    const {
        parentInteraction, client, discordUserId,
        optionsHandler, strapiUser, strapiGuild
    } = params

    const {afk_hours, afk_minutes} = optionsHandler

    let updatedStrapiUser = genstrapi.users.update(strapiUser.documentId, {
        afkReminderHours: afk_hours,
        afkReminderMinutes: afk_minutes
    })

    if (updatedStrapiUser) {
        let sdcEmbed = getGeneralEmbed()
            .setTitle(":hourglass: Set Capybara Go! AFK Rewards Reminder")
            .setDescription(`You have set your Capybara Go! Rewards max time for ${bold(`${afk_hours} ${BaseUtils.nounToPlural('hour', afk_hours)}`)} and ${bold(`${afk_minutes} ${BaseUtils.nounToPlural('minute', afk_minutes)}`)}.`)
            .setColor(Colors.Green)
        return parentInteraction.editReply({
            embeds: [sdcEmbed]
        })
    } else {
        let embed = getGeneralErrorEmbed()
            .setTitle(":hourglass: Set Capybara Go! AFK Rewards Reminder")
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }
}
