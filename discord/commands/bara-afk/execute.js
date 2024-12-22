import {EmbedBuilder} from "discord.js"
import {BaraAfkOptionsHandler} from "./options.handler.js"

export default async (parentInteraction, client, discordUserId) => {
    await parentInteraction.deferReply()
    let options = parentInteraction.options._hoistedOptions
    let chatgptOptionsHandler = new BaraAfkOptionsHandler(options, discordUserId)

    // if (!completion.error) {
    //     let helpEmbed = new EmbedBuilder()
    //         .setTitle(chatgptOptionsHandler.text)
    //         .setDescription(completion.choices[0].message.content)
    //         .setColor(0x7289DA)
    //
    //     return parentInteraction.editReply({
    //         embeds: [helpEmbed]
    //     })
    // } else {
    //     return parentInteraction.editReply(`Hey, u fucked up, stop that: ${completion.error}`)
    // }
}





