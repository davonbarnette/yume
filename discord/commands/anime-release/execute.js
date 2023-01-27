import {JikanAPI} from "#apis/jikan"
import {AnimeReleaseOptionsHandler} from "./options.handler"
import {EmbedBuilder} from "discord.js"

export default async (parentInteraction, client, discordUserId) => {
    let options = parentInteraction.options._hoistedOptions
    let arReleaseHandler = new AnimeReleaseOptionsHandler(options, discordUserId)
    let animeReleased = await JikanAPI.getSchedules(arReleaseHandler.day)
    let helpEmbed = new EmbedBuilder()
        .setTitle(`Searching for animes released on ${arReleaseHandler.day}`)
        .setDescription("Type !help for commands.")
        .setColor(0x7289DA)

    animeReleased = animeReleased.filter(a => a.title_english !== null)

    let fields = animeReleased.map(anime => ({
        name: anime.title_english,
        value: anime.url,
        inline:true,
    }))
    helpEmbed.addFields(fields)

    return parentInteraction.reply({embeds: [helpEmbed]})
}




