import {RemindersOptionsHandler} from "./options.handler.js"
import {genstrapi} from "#apis/genstrapi"
import {Subcommands} from "./subcommands/keys.js";
import {channelMention, EmbedBuilder, Colors, bold, inlineCode} from "discord.js";


export default async (parentInteraction, client, discordUserId) => {
    await parentInteraction.deferReply()
    const {user, options: parentOptions} = parentInteraction
    const {_hoistedOptions, _subcommand} = parentOptions

    let strapiUser = await genstrapi.users.findFirstOrCreate({
        filters: {discordUserId: user.id},
        populate: "*"
    }, {
        username: user.username,
        discordUserId: user.id
    })

    const optionsHandler = new RemindersOptionsHandler(_hoistedOptions, discordUserId)
    const execute = Subcommands[_subcommand].execute

    let strapiGuild = await genstrapi.servers.findFirst({
        filters: {discordGuildId: parentOptions.guildId},
        populate: "*"
    })
    if (_subcommand !== Subcommands.sdc.key) {
        if (!strapiGuild) {
            let sdcEmbed = new EmbedBuilder()
                .setTitle("Error")
                .setDescription(`You must set a default channel before using any commands. Use ${inlineCode("/rem sdc")} first you siwwy dingus.`)
                .setColor(Colors.Red)
            return parentInteraction.editReply({
                embeds: [sdcEmbed]
            })
        }
    }

    if (execute) {
        return await execute({
            parentInteraction, client, discordUserId,
            optionsHandler, strapiUser, strapiGuild
        })
    }
    return parentInteraction.editReply(`Thanks`)
}





