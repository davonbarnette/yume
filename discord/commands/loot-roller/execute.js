import {EmbedBuilder, codeBlock, bold, italic} from "discord.js"
import {BaseUtils} from "#utils"
import {lrOptionsHandlerClass} from "./options.handler"
import path, {dirname} from 'path';
import {fileURLToPath} from 'url';
import {table} from 'table'

const __dirname = dirname(fileURLToPath(import.meta.url));

export default async (parentInteraction, client, discordUserId) => {
    let options = parentInteraction.options._hoistedOptions
    let lrOptionsHandler = new lrOptionsHandlerClass(options, discordUserId)
    const numCol = 9
    const numRows = 6
    let matrix = []
    let curPlayerPool = [...lrOptionsHandler.players]
    let curCount = 0

    for (let row = 0; row < numRows; row++) {
        matrix.push([])
        for (let col = 0; col < numCol; col++) {
            const pickedPlayer = BaseUtils.pickRandomElement(curPlayerPool)
            curCount++
            if (curCount > lrOptionsHandler.numItems) {
                matrix[row].push("")
            } else {
                matrix[row].push(pickedPlayer)
            }

            const index = curPlayerPool.indexOf(pickedPlayer)
            curPlayerPool.splice(index, 1)
            if (curPlayerPool.length === 0) {
                curPlayerPool = [...lrOptionsHandler.players]
            }
        }
    }
    const playerTable = table(matrix, {
        border: {
            topBody: `─`,
            topJoin: `┬`,
            topLeft: `┌`,
            topRight: `┐`,

            bottomBody: `─`,
            bottomJoin: `┴`,
            bottomLeft: `└`,
            bottomRight: `┘`,

            bodyLeft: `│`,
            bodyRight: `│`,
            bodyJoin: `│`,

            joinBody: `─`,
            joinLeft: `├`,
            joinRight: `┤`,
            joinJoin: `┼`
        }
    })
    return parentInteraction.reply(bold("Loot Table\n") + italic("If the table looks weird, try shortening the players' names\n") + codeBlock(playerTable))
}
