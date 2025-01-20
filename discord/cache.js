export class LocalCache {
    constructor(client) {
        this.guilds = new Map()
        this.channels = new Map()
        this.client = client
    }

    async getGuildById(guildId){
        let cachedGuild = this.guilds.get(guildId)
        if (!cachedGuild){
            let guild = await this.client.guilds.fetch(guildId)
            if (guild) {
                this.guilds.set(guildId, guild)
                cachedGuild = guild
            }
        }
        return cachedGuild
    }

    async getChannelById(channelId){
        let cachedChannel = this.channels.get(channelId)
        if (!cachedChannel){
            let channel = await this.client.channels.fetch(channelId)
            if (channel) {
                this.channels.set(channelId, channel)
                cachedChannel = channel
            }
        }
        return cachedChannel
    }
}
