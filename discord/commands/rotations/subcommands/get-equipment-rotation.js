import {genstrapi} from "#root/apis/index.js";
import {
    bold,
    channelMention,
    Colors,
    hideLinkEmbed,
    hyperlink,
    PermissionsBitField,
    time,
    TimestampStyles
} from "discord.js";
import {getGeneralEmbed, getGeneralErrorEmbed} from "#utils";

export async function getEquipmentRotation(params) {
    const {
        parentInteraction, client,
        // strapiUser, discordUserId, optionsHandler,
    } = params
    let rotations = await genstrapi.equipmentRotations.findMany({
        sort: "end:asc",
        populate: ["capyEquipments"]
    })

    if (!rotations|| rotations.length === 0) {
        let embed = getGeneralErrorEmbed()
            .setTitle(":arrows_counterclockwise: Equipment Rotation")
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }

    let rotationsDescription = "Capybara Go! UP Equipment Rotation:\n\n"
    rotations.forEach((rotation, i) => {
        let text = `${bold(`:blue_square: \u1CBCRotation starts ⟶`)} ${time(new Date(rotation.start), TimestampStyles.LongDate)}`
        if (i === 0){
            text = `${bold(`:green_square: \u1CBCCurrent rotation`)}`
        } else if (i === 1){
            text = `${bold(`:orange_square: \u1CBCNext rotation starts ⟶`)} ${time(new Date(rotation.start), TimestampStyles.RelativeTime)}`
        }
        let rotationDesc = `${text}\n\n`
        rotation.capyEquipments.forEach((equipment, i) => {
            const isLast = i === rotation.capyEquipments.length - 1
            let equipmentName = equipment.name
            if (equipmentName === "Bishop Staff"){
                equipmentName = "Bishop Staff (The Fingerer)"
            }
            let equipmentEmojiName = equipment.name.replace(/ /g,"_").replace(/[^a-zA-Z0-9_]/g, '')
            const curEmoji = client.emojis.cache.find(emoji => emoji.name === equipmentEmojiName)
            rotationDesc += `${curEmoji ? `${curEmoji} \u1CBC—\u1CBC `: ""}${equipmentName} ${isLast ? "" : "\n"}`
        })
        rotationsDescription += `${rotationDesc}\n\n\n`
    })

    rotationsDescription += `Check out the ${hyperlink("Capybara Go! Equipments Wiki", "https://capybara-go.game-vault.net/wiki/Equipment")} for details on specific equipment.`

    let sdcEmbed = getGeneralEmbed()
        .setTitle(":arrows_counterclockwise: Equipment Rotation")
        .setDescription(rotationsDescription)

    return parentInteraction.editReply({
        embeds: [sdcEmbed]
    })
}
