export default async (parentInteraction, client, discordUserId) => {
    let messages = await parentInteraction.channel.messages.fetchPinned()
    let messagesToChoose = []
    let jonId = "134961040436887552"
    messages.forEach(msg => {
        if (msg.author.id === jonId) {
            messagesToChoose.push(msg)
        }
    })
    if (messagesToChoose.length > 0) {
        const randomIndex = Math.floor(Math.random() * messagesToChoose.length);
        const randomMessage = messagesToChoose[randomIndex];
        return randomMessage.reply("Remember that Jon said this")
    } else {
        return parentInteraction.reply('No jon messages :(')
    }
}
