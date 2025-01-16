import {genstrapi} from "#root/apis/index.js";
import {channelMention, Colors, EmbedBuilder} from "discord.js";
import {getGeneralEmbed} from "#utils";

export async function setDefaultChannel(params) {
    const {
        parentInteraction, client,
        optionsHandler,
        // strapiUser, discordUserId,
    } = params
    const {guildId} = parentInteraction

    let strapiGuild = await genstrapi.servers.findFirst({
        filters: {discordGuildId: guildId},
        populate: "*"
    })

    if (!strapiGuild) {
        let guild = await client.guilds.fetch(guildId)
        strapiGuild = await genstrapi.servers.create({
            name: guild.name,
            discordGuildId: guildId
        })
    }

    let strapiChannel = await genstrapi.channels.findFirst({
        filters: {discordChannelId: optionsHandler.channel},
        populate: "*"
    })
    if (!strapiChannel) {
        let discordChannel = client.channels.fetch(optionsHandler.channel)
        strapiChannel = await genstrapi.channels.create({
            name: discordChannel.name,
            discordChannelId: optionsHandler.channel,
            discordServer: {
                connect: [strapiGuild.documentId]
            }
        })
    }

    if (!strapiChannel){
        return parentInteraction.editReply("Ewwow uwu")
    }

    if (strapiGuild.defaultRemindersChannel?.documentId !== strapiChannel.documentId) {
        let updatedGuild = await genstrapi.servers.update(strapiGuild.documentId, {
            defaultRemindersChannel: {
                connect: [strapiChannel.documentId]
            }
        })
        if (!updatedGuild){
            return parentInteraction.editReply("Ewwow uwu")
        }
    } else {
        let sdcEmbed = getGeneralEmbed()
            .setTitle(":hourglass: Set Default Reminders Channel")
            .setDescription(`The default reminders channel is already set to ${channelMention(optionsHandler.channel)}.`)
            .setColor(Colors.Orange)
        return parentInteraction.editReply({
            embeds: [sdcEmbed]
        })
    }

    let sdcEmbed = getGeneralEmbed()
        .setTitle(":hourglass: Set Default Reminders Channel")
        .setDescription(`You have successfully set the default reminder channel to ${channelMention(optionsHandler.channel)}.`)
        .setColor(Colors.Green)
    return parentInteraction.editReply({
        embeds: [sdcEmbed]
    })
}
