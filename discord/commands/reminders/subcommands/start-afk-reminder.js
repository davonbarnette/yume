import dayjs from "dayjs";
import {genstrapi} from "#root/apis/index.js";
import {REMINDER_TYPES} from "#root/commands/reminders/types.js";
import {BaseUtils, getGeneralEmbed, getGeneralErrorEmbed} from "#utils";
import {bold, Colors, inlineCode, time, TimestampStyles} from "discord.js";

export async function startAfkReminder(params) {
    const {
        parentInteraction, client, discordUserId,
        optionsHandler, strapiUser, strapiGuild
    } = params

    function isNullOrUndefined(value){
        return value === undefined || value === null
    }

    if (isNullOrUndefined(strapiUser.afkReminderHours) || isNullOrUndefined(strapiUser.afkReminderMinutes)) {
        let embed = getGeneralErrorEmbed()
            .setTitle(":hourglass: Start Capybara Go! AFK Rewards Reminder")
            .setDescription(`You must set your personal AFK timer before you can use this command. You can set your personal AFK timer by using ${inlineCode(`/rem spar`)}`)
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }

    let curReminders = await genstrapi.reminders.findMany({
        filters: {
            type: REMINDER_TYPES.CAPYBARA_AFK_REWARDS,
            discordUser: strapiUser.id,
            end: {
                $gt: dayjs().toISOString()
            }
        }
    })

    if (curReminders) {
        if (curReminders.length === 0) {
            const start = dayjs()
            const end = start.add(strapiUser.afkReminderHours, "hours").add(strapiUser.afkReminderMinutes, "minutes").set("second", 0)
            let reminder = await genstrapi.reminders.create({
                start: start.toISOString(),
                end: end.toISOString(),
                type: REMINDER_TYPES.CAPYBARA_AFK_REWARDS,
                message: "Capybara Go! AFK Awards Reminder",
                discordUser: {connect: [strapiUser.id]},
                discordServer: {connect: [strapiGuild.id]}
            })
            if (reminder) {
                let embed = getGeneralEmbed()
                    .setTitle(":hourglass: Start Capybara Go! AFK Rewards Reminder")
                    .setDescription(`You have set a reminder for ${bold(`${strapiUser.afkReminderHours} ${BaseUtils.nounToPlural('hour', strapiUser.afkReminderHours)}`)} and ${bold(`${strapiUser.afkReminderMinutes} ${BaseUtils.nounToPlural('minute', strapiUser.afkReminderMinutes)}`)}. You will be reminded at ${time(end.toDate(), TimestampStyles.ShortDateTime)} about your Capybara Go! AFK Rewards.`)
                    .setColor(Colors.Green)
                return parentInteraction.editReply({
                    embeds: [embed]
                })
            } else {
                let embed = getGeneralErrorEmbed()
                    .setTitle(":hourglass: Start Capybara Go! AFK Rewards Reminder")
                return parentInteraction.editReply({
                    embeds: [embed]
                })
            }
        } else {
            let curAfkReminder = curReminders[0]
            let embed = getGeneralEmbed()
                .setTitle(":hourglass: Start Capybara Go! AFK Rewards Reminder")
                .setDescription(`You already have a Capybara Go! AFK Rewards Reminder that has not expired. Dewetus that guy using ${inlineCode(`/rem rat ${curAfkReminder.id}`)} before using this command again.`)
                .setColor(Colors.Orange)
            return parentInteraction.editReply({
                embeds: [embed]
            })
        }
    } else {
        let embed = getGeneralErrorEmbed()
            .setTitle(":hourglass: Start Capybara Go! AFK Rewards Reminder")
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }
}
