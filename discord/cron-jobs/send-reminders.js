import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs";
import {bold, userMention} from "discord.js";
import Logger from "#logger";

let guildsCache = new Map()
let channelsCache = new Map()

export async function sendReminders(client) {
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
        let cachedGuild = guildsCache.get(discordGuildId)
        let cachedChannel = channelsCache.get(defaultRemindersChannel.discordChannelId)


        if (!cachedGuild) {
            let guild = await client.guilds.fetch(discordGuildId)
            if (guild) {
                guildsCache.set(discordGuildId, guild)
                cachedGuild = guild
            }
        }
        if (!cachedChannel) {
            let channel = await client.channels.fetch(defaultRemindersChannel.discordChannelId)
            if (channel) {
                channelsCache.set(defaultRemindersChannel.discordChannelId, channel)
                cachedChannel = channel
            }
        }

        if (cachedGuild && cachedChannel && discordUser) {
            await genstrapi.reminders.delete(reminder.documentId)
            await cachedChannel.send(`${message ? `${bold(message)}` : ""} | Hewwo, ${userMention(discordUser.discordUserId)}, the time is now. Here's your reminder. This reminder has expired and is now deletused.`)
        }
    }
    Logger.debug("Cron job sendReminders has finished")
}
