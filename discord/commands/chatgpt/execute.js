import {EmbedBuilder} from "discord.js"
import {ChatGPTApi} from "#apis/chatgpt"
import {ChatGPTOptionsHandler} from "./options.handler"

export default async (parentInteraction, client, discordUserId) => {
    await parentInteraction.deferReply()
    let options = parentInteraction.options._hoistedOptions
    let chatgptOptionsHandler = new ChatGPTOptionsHandler(options, discordUserId)
    let completion = await ChatGPTApi.createChatCompletion(chatgptOptionsHandler.text)

    if (!completion.error) {
        let helpEmbed = new EmbedBuilder()
            .setTitle(chatgptOptionsHandler.text)
            .setDescription(completion.choices[0].message.content)
            .setColor(0x7289DA)

        return parentInteraction.editReply({
            embeds: [helpEmbed]
        })
    } else {
        return parentInteraction.editReply(`Hey, u fucked up, stop that: ${completion.error}`)
    }
}





