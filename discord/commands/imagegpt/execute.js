import {EmbedBuilder} from "discord.js"
import {ChatGPTApi} from "#apis/chatgpt"
import {ImageGPTOptionsHandler} from "./options.handler"

export default async (parentInteraction, client, discordUserId) => {
    await parentInteraction.deferReply()
    let options = parentInteraction.options._hoistedOptions
    let imageGptOptionsHandler = new ImageGPTOptionsHandler(options, discordUserId)
    let completion = await ChatGPTApi.createImage(imageGptOptionsHandler.text)

    completion.data[0].url

    if (!completion.error) {
        let helpEmbed = new EmbedBuilder()
            .setTitle(imageGptOptionsHandler.text)
            .setImage(completion.data[0].url)
            .setColor(0x7289DA)

        return parentInteraction.editReply({
            embeds: [helpEmbed]
        })
    } else {
        return parentInteraction.editReply('Hey, u fucked up, stop that ', completion.error)
    }
}





