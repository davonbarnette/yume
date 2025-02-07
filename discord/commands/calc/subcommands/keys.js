import {calculateChestGrowth} from "./calculate-chest-growth.js";


export const Subcommands = {
    chests: {
        key: 'chests',
        execute: calculateChestGrowth
    },
}
