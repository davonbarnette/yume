import {EmbedBuilder} from "discord.js"
import {DeenguageOptionsHandler} from "./options.handler.js";

export default async (parentInteraction, client, discordUserId) => {
    let options = parentInteraction.options._hoistedOptions
    let deenguageOptionsHandler = new DeenguageOptionsHandler(options, discordUserId)

    let deenified = deenguageOptionsHandler.text
        .replace(/en/ig, "deen")

    let wheelEmbed = new EmbedBuilder()
        .setTitle("Deenguage")
        .setColor(0x7289DA)
        .setDescription(deenified)

    return parentInteraction.reply({
        embeds: [wheelEmbed],
    })
}
