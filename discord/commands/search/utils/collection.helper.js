import {getGeneralEmbed, ButtonActionsHandler} from "#utils"
import {SearchRecordEmbed} from "#root/commands/search/description-by-collection.js";

export class CollectionHelper extends ButtonActionsHandler {
    records
    discordUserId
    paginator

    constructor(records, collectionName, paginator) {
        super()
        this.records = records
        this.paginator = paginator
    }

    setRecords(records) {
        this.records = records
        return this
    }

    get description() {
        let description = ""
        this.paginator.items.forEach(record => {
            description += `${new SearchRecordEmbed(record).description}\n\n`
        })
        return description
    }

    get collectionEmbed() {
        return getGeneralEmbed()
            .setTitle(`:card_box: Search`)
            .setDescription(this.description)
            .setFooter({text: `Showing ${this.paginator.startingItemNumber}-${this.paginator.endingItemNumber} of ${this.paginator.total}`})
    }
}
