import {genstrapi} from "#root/apis/index.js";
import dayjs from "dayjs";

export async function rotateUpEquipment() {
    let rotations = await genstrapi.equipmentRotations.findMany({
        sort: "end:asc",
    })
    if (rotations && rotations.length !== 0) {
        let currentRotation = rotations[0]
        let nextRotation = rotations[1]
        let lastRotation = rotations[rotations.length - 1]

        const {end} = currentRotation
        const curDay = dayjs().set('second', 59)
        const curRotationEnd = dayjs(end)
        let curRotationHasEnded = curRotationEnd.isBefore(curDay)

        if (curRotationHasEnded) {
            const lastRotationEnd = dayjs(lastRotation.end)
            const newEnd = lastRotationEnd.add(3, 'day')

            await genstrapi.equipmentRotations.update(currentRotation.documentId, {
                start: lastRotationEnd.toISOString(),
                end: newEnd.toISOString()
            })
            return nextRotation
        } else {
            return currentRotation
        }
    }
}
