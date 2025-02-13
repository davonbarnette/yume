export default async (parentInteraction, client, discordUserId) => {
    const focusedValue = parentInteraction.options.getFocused();
    const filtered = client.genstrapiCache.searchByName(focusedValue)
    await parentInteraction.respond(filtered)
}
