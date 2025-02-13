import Case from "case";
import Logger from "#logger";

export async function onCollect(
    buttonInteraction,
    collectionHelper,
    paginator,
    parentReply,
    parentInteraction,
    discordUserId
) {
    try {
        await collectionHelper.executeAction(buttonInteraction.customId);
        collectionHelper.setRecords(paginator.curItems);

        await parentInteraction.editReply({
            embeds: [collectionHelper.collectionEmbed],
            components: collectionHelper.discordComponentRows,
            withResponse: true
        })
        await buttonInteraction.deferUpdate()
    } catch (e) {
        Logger.error("Could not collect")
    }
}
