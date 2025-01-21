import {genstrapi} from "#root/apis/index.js";
import {
    bold,
    hyperlink, italic,
    time,
    TimestampStyles, underline
} from "discord.js";
import {BaseUtils, getGeneralEmbed, getGeneralErrorEmbed} from "#utils";
import dayjs from "dayjs";
import {CAPY_EVENT_TYPES} from "#root/utils/enums.js";

export async function getEvents(params) {
    const {
        parentInteraction, client,
        // strapiUser, discordUserId, optionsHandler,
    } = params
    let events = await genstrapi.events.findMany({
        sort: "start:asc",
        filters: {
            end: {
                $gt: dayjs().toISOString()
            },
        },
        populate: "*"
    })

    if (!events || events.length === 0) {
        let embed = getGeneralErrorEmbed()
            .setTitle(":calendar: Events")
        return parentInteraction.editReply({
            embeds: [embed]
        })
    }

    const upcomingEvents = []
    const currentEvents = []

    events.forEach(event => {
        const {start} = event
        let curDay = dayjs()
        let startDay = dayjs(start)

        if (curDay.isAfter(startDay)) {
            currentEvents.push(event)
        } else {
            upcomingEvents.push(event)
        }
    })

    let eventsDescription = ``
    eventsDescription += `${bold(":green_square: Current Events")}\n\n`
    currentEvents.forEach(curEvent => {
        const {name, end} = curEvent
        let endDay = dayjs(end)
        let text = `- ${name} Event ⟶ ends ${time(endDay.toDate(), TimestampStyles.RelativeTime)}\n`
        eventsDescription += text
    })

    eventsDescription += `\n${bold(":orange_square: Upcoming Events")}\n\n`
    upcomingEvents.forEach(curEvent => {
        const {name, start} = curEvent
        let startDay = dayjs(start)
        let text = `- ${time(startDay.toDate(), TimestampStyles.LongDate)} ⟶ ${name} Event\n`
        eventsDescription += text
    })

    let embed = getGeneralEmbed()
        .setTitle(":calendar: Events")
        .setDescription(eventsDescription)

    return parentInteraction.editReply({
        embeds: [embed]
    })
}
