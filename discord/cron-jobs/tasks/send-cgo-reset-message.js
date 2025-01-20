import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs";
import {bold, inlineCode, time, TimestampStyles, underline} from "discord.js";
import {getGeneralEmbed} from "#utils";

export async function sendCgoResetMessage(client, localCache) {
    const curDay = dayjs()
    const events = await genstrapi.events.findMany({
        filters: {
            end: {
                $gt: curDay.toISOString()
            }
        },
        sort: "start:asc",
        populate: "*"
    })
    const upRotations = await genstrapi.equipmentRotations.findMany({
        sort: "end:asc",
        populate: "*"
    })

    let curDesc = `:green_square: ${bold("Today's events and rotations")}\n\n`
    let upcomingDesc = `:orange_square: ${bold("Upcoming events and rotations")}\n\n`

    curDesc += `${underline("Events")}\n`
    upcomingDesc += `${underline("Events")}\n`
    events.forEach(event => {
        const {end, start, name} = event
        let endDay = dayjs(end)
        let startDay = dayjs(start)
        if (curDay.isAfter(startDay)) {
            curDesc += `- ${name} ⟶ Ends ${time(endDay.toDate(), TimestampStyles.LongDate)}\n`
        } else {
            upcomingDesc += `- ${name} ⟶ Starts ${time(startDay.toDate(), TimestampStyles.LongDate)}\n`
        }
    })


    let curUpRotation = upRotations[0]
    curDesc += `\n${underline("Up Equipment Rotation")}\n`

    let curRotationDesc = "- "
    curUpRotation.capyEquipments.forEach(eq => {
        const {name} = eq
        let equipmentEmojiName = name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, '')
        const curEmoji = client.emojis.cache.find(emoji => emoji.name === equipmentEmojiName)
        curRotationDesc += `${curEmoji} `
    })
    curDesc += `${curRotationDesc}\n`

    let nextUpRotation = upRotations[1]
    upcomingDesc += `\n${underline("Up Equipment Rotation")} — ${time(new Date(nextUpRotation.start), TimestampStyles.RelativeTime)}\n`

    let nextRotationDesc = "- "
    nextUpRotation.capyEquipments.forEach(eq => {
        const {name} = eq
        let equipmentEmojiName = name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, '')
        const curEmoji = client.emojis.cache.find(emoji => emoji.name === equipmentEmojiName)
        nextRotationDesc += `${curEmoji} `
    })
    upcomingDesc += `${nextRotationDesc}\n`


    let desc = `The Capybara Go! reset is here. Here's some information about today.\n\n${curDesc}\n${upcomingDesc}\n${inlineCode("/rotations equipment")} — See all equipment rotations\n${inlineCode("/rotations growth")} — See all growth event rotations\n${inlineCode("/rotations events")} — See all events`
    let servers = await genstrapi.servers.findMany({
        populate: "*"
    })

    for (let i = 0; i < servers.length; i++) {
        const {defaultRemindersChannel} = servers[i];
        const {discordChannelId} = defaultRemindersChannel

        if (defaultRemindersChannel) {
            let channel = await localCache.getChannelById(discordChannelId)
            const embed = getGeneralEmbed()
                .setTitle("Capybara Go! Day Reset")
                .setDescription(desc)
            channel.send({
                embeds: [embed]
            })
        }

    }
}
