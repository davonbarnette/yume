import {userMention} from "discord.js";

export async function notify(client) {
    const {
        DEV_DISCORD_CHANNEL_ID,
        DEV_DISCORD_USER_ID,
        NODE_ENV
    } = process.env

    if (NODE_ENV === 'production') {
        if (DEV_DISCORD_CHANNEL_ID && DEV_DISCORD_USER_ID) {
            let channel = await client.channels.fetch(DEV_DISCORD_CHANNEL_ID)
            await channel.send(`${userMention(DEV_DISCORD_USER_ID)}, the production instance of yume has started.`)
        }
    }
}
