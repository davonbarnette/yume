import {userMention} from "discord.js";

export async function notify(client, localCache) {
    const {
        DEV_DISCORD_CHANNEL_ID,
        DEV_DISCORD_USER_ID,
        NODE_ENV
    } = process.env

    if (NODE_ENV === 'production') {
        if (DEV_DISCORD_CHANNEL_ID && DEV_DISCORD_USER_ID) {
            let channel = await localCache.getChannelById(DEV_DISCORD_CHANNEL_ID)
            await channel.send(`${userMention(DEV_DISCORD_USER_ID)}, the production instance of yume has started.`)
        }
    }
}
