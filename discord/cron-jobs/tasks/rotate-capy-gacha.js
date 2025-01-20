import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs";

export async function rotateCapyGacha(){
    const capyGachaEvent = await genstrapi.events.findFirst({
        filters: {
            name: "Capy Gacha"
        },
    })

    if (capyGachaEvent){
        const {end, documentId, start} = capyGachaEvent
        let curDay = dayjs()
        let endDay = dayjs(end)
        let startDay = dayjs(start)
        if (curDay.isAfter(endDay)){
            await genstrapi.events.update(documentId, {
                start: startDay.add(7, 'days').toISOString(),
                end: endDay.add(7, 'days').toISOString()
            })
        }
    }
}
