import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs"
import {Colors, TimestampStyles, time, bold} from "discord.js";
import {BaseUtils} from "#utils";
import {getGeneralEmbed, getGeneralErrorEmbed} from "#utils";

export async function startReminder(params) {
    const {
        parentInteraction, client, discordUserId,
        optionsHandler, strapiUser, strapiGuild
    } = params
    const {hours, minutes, message} = optionsHandler

    const start = dayjs()
    const end = start.add(hours, "hours").add(minutes, "minutes").set("second", 0)
    let reminder = await genstrapi.reminders.create({
        start: start.toISOString(),
        end: end.toISOString(),
        message,
        discordUser: {connect: [strapiUser.id]},
        discordServer: {connect: [strapiGuild.id]}
    })

    if (reminder) {
        let sdcEmbed = getGeneralEmbed()
            .setTitle(":hourglass: Start Reminder")
            .setDescription(`You have set a reminder for ${bold(`${hours} ${BaseUtils.nounToPlural('hour', hours)}`)} and ${bold(`${minutes} ${BaseUtils.nounToPlural('minute', minutes)}`)}. You will be reminded at ${time(end.toDate(), TimestampStyles.ShortDateTime)}${message ? ` about: ${message}` : ""}.`)
            .setColor(Colors.Green)
        return parentInteraction.editReply({
            embeds: [sdcEmbed]
        })
    } else {
        let embed = getGeneralErrorEmbed()
            .setTitle(":hourglass: Start Reminder")
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }

}