import {SearchOptionsHandler} from "./options.handler.js";
import {RecordEmbed} from "#root/commands/findone/embed-by-collection.js";
import {getGeneralErrorEmbed} from "#utils";

export default async (parentInteraction, client, discordUserId) => {
    let options = parentInteraction.options._hoistedOptions
    let searchOptions = new SearchOptionsHandler(options, discordUserId)
    const documentId = searchOptions.documentId
    const record = client.genstrapiCache.getRecordByDocumentId(documentId)
    if (!record) {
        return parentInteraction.reply({
            embeds: [getGeneralErrorEmbed()
                .setDescription("You've entered an invalid name.")]
        })
    }
    const handler = new RecordEmbed(record)
    return parentInteraction.reply({
        embeds: [handler.embed]
    })
}
