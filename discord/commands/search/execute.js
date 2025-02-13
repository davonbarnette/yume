import {SearchOptionsHandler} from "./options.handler.js";
import {LocalPaginator} from "#root/utils/local.paginator.js";
import {CollectionHelper} from "#root/commands/search/utils/collection.helper.js";
import {onEnd} from "#root/commands/search/collectors/on.end.js";
import {onCollect} from "#root/commands/search/collectors/on.collect.js";

export default async (parentInteraction, client, discordUserId) => {
    let options = parentInteraction.options._hoistedOptions
    let searchOptions = new SearchOptionsHandler(options, discordUserId)
    const collectionName = searchOptions.type
    const records = client.genstrapiCache.getRecordsByCollection(collectionName)
    const paginator = new LocalPaginator(records, 5)
    const collectionHelper = new CollectionHelper(records, collectionName, paginator)
    collectionHelper.setActions([[
        {id: "first", label: "First", execute: async () => await paginator.toFirstPage()},
        {id: "previous", label: "Previous", execute: async () => await paginator.paginateLeft()},
        {id: "next", label: "Next", execute: async () => await paginator.paginateRight()},
        {id: "last", label: "Last", execute: async () => await paginator.toLastPage()}
    ]])
    let parentReply = await parentInteraction.reply({
        content: `Search`,
        embeds: [collectionHelper.collectionEmbed],
        components: collectionHelper.discordComponentRows,
        withResponse: true
    })
    const collector = parentInteraction.channel.createMessageComponentCollector({
        filter: (i) => !i.user.bot && i.user.id === parentInteraction.user.id,
        componentType: 2,
        time: 60_000
    })
    collector.on('collect', async i => onCollect(
        i,
        collectionHelper,
        paginator,
        parentReply,
        parentInteraction,
        discordUserId
    ));

    collector.on('end', (c, r) => onEnd(c, r, parentInteraction));

}
