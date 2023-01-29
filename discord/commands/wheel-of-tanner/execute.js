import {EmbedBuilder} from "discord.js"
import {BaseUtils} from "#utils"
import {WoTOptionsHandler} from "./options.handler"
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (parentInteraction, client, discordUserId) => {
    let options = parentInteraction.options._hoistedOptions
    let wotOptionsHandler = new WoTOptionsHandler(options, discordUserId)
    let decision = BaseUtils.pickRandomElement(wotOptionsHandler.choices)
    let wheelEmbed = new EmbedBuilder()
        .setTitle("The Wheel of Tanner")
        .setDescription(wotOptionsHandler.choices.join(", "))
        .setColor(0x7289DA)
        .setImage("attachment://wheeloftanner.gif")

    wheelEmbed.addFields(
        {
            name: "and the winner is...",
            value: `🔴🟠🟡🟢🔵🟣\n${decision}\n🟣🔵🟢🟡🟠🔴`,
            inline: true,
        }
    )

    return parentInteraction.reply({
        embeds: [wheelEmbed],
        files: [path.resolve(__dirname, "../../media/wheeloftanner.gif")]
    })
}
