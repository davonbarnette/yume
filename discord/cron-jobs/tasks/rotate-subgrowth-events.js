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
        for (let i = 0; i < subgrowthEvents.length; i++) {
            const {end, start, documentId} = subgrowthEvents[i]
            const curDay = dayjs().set('second', 59)
            const curEventEnd = dayjs(end)
            let curEventHasEnded = curDay.isAfter(curEventEnd)
            if (curEventHasEnded) {
                const sgeStartDay = dayjs(start).add(14, 'days')
                const sgeEndDay = dayjs(end).add(14, 'days')
                await genstrapi.events.update(documentId, {
                    start: sgeStartDay.toISOString(),
                    end: sgeEndDay.toISOString()
                })
            }
        }
    }
}
