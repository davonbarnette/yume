import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs";

export async function rotateGrowthEvents() {
    const growthEvents = await genstrapi.events.findMany({
        filters: {
            type: "growth",
        },
        sort: "end:asc",
        populate: ["subgrowthEvents"]
    })

    if (growthEvents && growthEvents.length !== 0) {
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

            await genstrapi.events.update(currentEvent.documentId, {
                start: lastEventEnd.toISOString(),
                end: newEnd.toISOString()
            })
            return nextEvent
        } else {
            return currentEvent
        }
    }
}
