import {EmbedBuilder} from "discord.js"
import {BaseUtils} from "#utils"
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import {ValorantApi} from "#apis/valorant";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (parentInteraction, client, discordUserId) => {
    let res = await ValorantApi.getAgents();
    let agents = res.map(agent => agent.displayName);

    let decision = BaseUtils.getRandom(agents, 5)
    let wheelEmbed = new EmbedBuilder()
        .setTitle("Valorant Comp")
        .setColor(0x7289DA)

    wheelEmbed.addFields(
        {
            name: "Your 5-man",
            value: `${decision.join(", ")}`,
            inline: true,
        }
    )

    return parentInteraction.reply({
        embeds: [wheelEmbed],
    })
}
