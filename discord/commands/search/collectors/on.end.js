import Logger from "#logger";

export async function onEnd(collected, reason, parentInteraction) {
    if (reason === 'time') {
        try{
            await parentInteraction.editReply({content: "_You can no longer paginate through this view. Use the_ `search` _command again._", components: []})
        } catch (e) {
            Logger.error("Could not end interaction")
        }
    }
}
