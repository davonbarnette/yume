import {getEquipmentRotation} from './get-equipment-rotation.js'
import {getGrowthRotation} from "./get-growth-rotation.js";
import {getEvents} from "./get-events.js";


export const Subcommands = {
    equipment: {
        key: 'equipment',
        execute: getEquipmentRotation
    },
    growth: {
        key: 'growth',
        execute: getGrowthRotation
    },
    events: {
        key: 'events',
        execute: getEvents,
    }
}
