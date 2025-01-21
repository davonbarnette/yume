import {genstrapi} from "#root/apis/index.js";
import {
    bold,
    hyperlink, italic,
    time,
    TimestampStyles, underline
} from "discord.js";
import {BaseUtils, getGeneralEmbed, getGeneralErrorEmbed} from "#utils";
import dayjs from "dayjs";

export async function getGrowthRotation(params) {
    const {
        parentInteraction, client,
        // strapiUser, discordUserId, optionsHandler,
    } = params
    let growthEvents = await genstrapi.events.findMany({
        sort: "end:asc",
        filters: {
          type: "growth"
        },
        populate: "*"
    })

    if (!growthEvents || growthEvents.length === 0) {
        let embed = getGeneralErrorEmbed()
            .setTitle(":calendar: Events")
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }

    let eventsDescription = `Capybara Go! Events consist of ${growthEvents.length} main growth events. Each main growth event has extra growth events that usually start 2 days after the main growth event has started.\n\n`
    growthEvents.forEach((event, i) => {
        const {start, capyResource, numRounds, resourcesNeededPerRound, name, subgrowthEvents} = event
        let text = `${bold(`:blue_square: ${name} Event starts ⟶`)} ${time(new Date(start), TimestampStyles.LongDate)}`
        if (i === 0) {
            text = `${bold(`:green_square: Current: ${name} Event`)}`
        } else if (i === 1) {
            text = `${bold(`:orange_square: Next: ${name} Event starts ⟶`)} ${time(new Date(start), TimestampStyles.RelativeTime)}`
        }
        const resourceEmojiName = capyResource.name.replace(/ /g, "_").replace(/[^a-zA-Z0-9_]/g, '')
        const curEmoji = client.emojis.cache.find(emoji => emoji?.name === resourceEmojiName)
        const fullResource = curEmoji ? `${curEmoji} ${bold(capyResource.name)}` : bold(capyResource.name)
        let eventsDesc = `${text}\n* ${bold(BaseUtils.numberWithCommas(resourcesNeededPerRound))} ${fullResource} needed per round for ${bold(`${numRounds} rounds`)}\n* ${bold(BaseUtils.numberWithCommas(numRounds * resourcesNeededPerRound))} ${fullResource} to complete the entire event`

        eventsDescription += `${eventsDesc}\n\n${underline("Extra Growth Events")}\n`

        if (subgrowthEvents.length === 0) {
            eventsDescription += italic("No extra growth events")
        } else {
            subgrowthEvents.forEach(sge => {
                const {numDaysAfterGrowthEvent, eventLengthInDays, name} = sge
                let subgrowthEventDesc = `- ${name}`
                let startDay = dayjs(start).add(numDaysAfterGrowthEvent, "days")
                let endDay = startDay.add(eventLengthInDays, "days")
                if (dayjs().isAfter(startDay)) {
                    subgrowthEventDesc += ` — Ends ${time(endDay.toDate())}`
                } else {
                    subgrowthEventDesc += ` — Starts ${time(startDay.toDate())}`
                }
                eventsDescription += `${subgrowthEventDesc}\n`

            })
        }
        eventsDescription += `\n\n`
    })

    eventsDescription += `Check out the ${hyperlink("Capybara Go! Growth Events Wiki", "https://capybara-go.game-vault.net/wiki/Growth_Events")} for details on specific events.`

    let embed = getGeneralEmbed()
        .setTitle(":calendar: Events")
        .setDescription(eventsDescription)

    return parentInteraction.editReply({
        embeds: [embed]
    })
}
