import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs";
import {bold, userMention} from "discord.js";
import Logger from "#logger";

export async function sendReminders(client, localCache) {
    Logger.debug("Starting sendReminders cron job")
    let reminders = await genstrapi.reminders.findMany({
        filters: {
            reminderSent: false,
            end: {
                $lt: dayjs().toISOString(),
                $gt: dayjs().subtract(5, 'minutes').toISOString()
            }
        },
        populate: ["discordServer.defaultRemindersChannel", "discordUser"]
    })

    Logger.debug(`Sending out ${reminders.length} reminders`)

    for (let i = 0; i < reminders.length; i++) {
        const reminder = reminders[i];
        const {discordServer, discordUser, message} = reminder
        const {discordGuildId, defaultRemindersChannel} = discordServer
        let cachedGuild = await localCache.guilds.getGuildById(discordGuildId)
        let cachedChannel = await localCache.getChannelById(defaultRemindersChannel.discordChannelId)

        if (cachedGuild && cachedChannel && discordUser) {
            await genstrapi.reminders.delete(reminder.documentId)
            await cachedChannel.send(`${message ? `${bold(message)} | ` : ""}Hewwo, ${userMention(discordUser.discordUserId)}, the time is now. Here's your reminder. This reminder has expired and is now deletused.`)
        }
    }
    Logger.debug("Cron job sendReminders has finished")
}
