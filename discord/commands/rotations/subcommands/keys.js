import {getEquipmentRotation} from './get-equipment-rotation.js'


export const Subcommands = {
    equipment: {
        key: 'equipment',
        execute: getEquipmentRotation
    },
}
