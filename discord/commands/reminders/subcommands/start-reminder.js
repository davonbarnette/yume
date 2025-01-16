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

    let runningReminders = await genstrapi.reminders.findMany({
        filters: {
            discordUser: strapiUser.id,
        },
    })

    let doraUrl = 'https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHFyampvZms3M25oc3M5ZXhnZHZtcnRwc2ZldDA4eTVtY3VyaHptbSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/THPTt9Bu80tgI/giphy.gif'

    if (!runningReminders || runningReminders.length >= 5) {
        let embed = getGeneralErrorEmbed()
            .setTitle(":hourglass: Start Reminder")
            .setAuthor({name: "Noob", iconURL: doraUrl})
            .setThumbnail(doraUrl)
            .setImage(doraUrl)
            .setDescription("No")
            .setFooter({text: "You may only have 5 reminders running at a time.", iconURL: doraUrl})
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }

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
