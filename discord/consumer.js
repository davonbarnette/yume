import {DISCORD_SETTINGS} from "#settings"
import {Client, Events} from "discord.js"
const {DISCORD_TOKEN} = process.env
import logger from '#logger'
import {initDiscordCron} from "#root/discord-cron.js";

export class DiscordConsumer {

    constructor(commandsRegistry) {

        this.client = new Client({intents: DISCORD_SETTINGS.INTENTS})
        this.client.commands = commandsRegistry

        this.client.login(DISCORD_TOKEN);

        this.client.on(Events.ClientReady, this.onReady)
        this.client.on(Events.Warn, this.onWarn)
        this.client.on(Events.Error, this.onError)
        this.client.on(Events.InteractionCreate, this.onInteractionCreate)
    }

    onReady = () => {
        logger.success(`${this.client.user.username} ready!`)
        this.client.user.setActivity(`/help`)
        initDiscordCron(this.client)
    }

    onWarn = (info) => {
        logger.warn(info)
    }

    onError = (err) => {
        logger.error(err);
    }

    onInteractionCreate = async (interaction) => {
        if (interaction.isCommand()) {
            let command = this.client.commands.get(interaction.commandName)
            if (command) {
                await command.execute(interaction, this.client, interaction.user.id)
            }
        }
    }
}
