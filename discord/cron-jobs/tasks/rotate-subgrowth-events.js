import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs";

export async function rotateSubgrowthEvents() {
    const subgrowthEvents = await genstrapi.events.findMany({
        filters: {
            type: "subgrowth",
            end: {
                $lt: dayjs().toISOString()
            }
        },
        sort: "end:asc",
        populate: ["growthEvent"]
    })

    if (subgrowthEvents && subgrowthEvents.length !== 0) {
        let currentEvent = growthEvents[0]
        let nextEvent = growthEvents[1]
        let lastEvent = growthEvents[growthEvents.length - 1]
        const {end} = currentEvent
        const curDay = dayjs().set('second', 59)
        const curEventEnd = dayjs(end)
        let curEventHasEnded = curEventEnd.isBefore(curDay)

        if (curEventHasEnded) {
            const lastEventEnd = dayjs(lastEvent.end)
            const newEnd = lastEventEnd.add(lastEvent.eventLengthInDays, 'day')
            return nextEvent
        } else {
            return currentEvent
        }
    }
}
