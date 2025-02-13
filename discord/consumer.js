import {availableCollections, DISCORD_SETTINGS} from "#settings"
import {Client, Events} from "discord.js"

const {DISCORD_TOKEN} = process.env
import logger from '#logger'
import {initDiscordCron} from "#root/discord-cron.js";
import {notify} from "#root/startup-tasks/notify.js";
import {LocalCache} from "#root/cache.js";
import {GenstrapiSearch} from "#root/apis/genstrapi/search.js";

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
        this.client.genstrapiCache = new GenstrapiSearch(availableCollections)
        this._localCache = new LocalCache(this.client)
        notify(this.client, this._localCache)
        initDiscordCron(this.client, this._localCache)
    }

    onWarn = (info) => {
        logger.warn(info)
    }

    onError = (err) => {
        logger.error(JSON.stringify(err));
    }

    onInteractionCreate = async (interaction) => {
        if (interaction.isCommand()) {
            let command = this.client.commands.get(interaction.commandName)
            if (command) {
                await command.execute(interaction, this.client, interaction.user.id)
            }
        } else if (interaction.isAutocomplete()) {
            const command = this.client.commands.get(interaction.commandName);

            if (!command) {
                console.error(`No command matching ${interaction.commandName} was found.`);
                return;
            }
            try {
                await command.autocomplete(interaction, this.client, interaction.user.id);
            } catch (error) {
                console.error(error);
            }
        }
    }
}
