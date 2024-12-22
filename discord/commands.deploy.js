import {REST, Routes} from "discord.js"
import {DISCORD_SETTINGS} from "#settings"
import commandsRegistry from "#commands-registry"
import logger from "#logger";

const {
    CLIENT_ID,
    DISCORD_TOKEN,
    COMMAND_TEST_GUILD_IDS,
} = DISCORD_SETTINGS;

const rest = new REST({version: '10'}).setToken(DISCORD_TOKEN);

(async () => {
    const args = process.argv.slice(2)
    const env = args[0]
    const action = args[1]

    if (!env || !action) {
        logger.error("Must pass an environment and an action to Command Deploy.")
        return
    }

    const remoteCmds = await rest.get(Routes.applicationCommands(CLIENT_ID))
    logger.debug('Remote Commands', remoteCmds)

    logger.debug(`Running deploy --environment=${env} --action=${action}`)

    let commands = [];
    let values = [...commandsRegistry.values()];
    const commandNames = []
    for (let i = 0; i < values.length; i++) {
        const command = values[i];
        if (!command.disabled) {
            commandNames.push(command.name)
            let slashCommand = await command.getSlashCommand();
            commands.push(slashCommand);
        }
    }

    switch (action) {
        case 'register':
            try {
                let testServers = COMMAND_TEST_GUILD_IDS
                if (env === 'dev') {
                    for (let i = 0; i < testServers.length; i++) {
                        const testServer = testServers[i];
                        logger.debug(`Syncing [${commandNames.join(", ")}] to Guild: ${testServer}`)
                        await rest.put(
                            Routes.applicationGuildCommands(CLIENT_ID, testServer),
                            {body: commands},
                        );
                    }
                } else if (env === 'prod') {
                    logger.debug(`Syncing [${commandNames.join(", ")}] globally`)
                    await rest.put(
                        Routes.applicationCommands(CLIENT_ID),
                        {body: commands},
                    );
                }
                logger.debug('Successfully registered application Slash commands.');
            } catch (error) {
                logger.error(error);
            }
            break
        case 'clear':
            try {
                let testServers = COMMAND_TEST_GUILD_IDS
                if (env === 'dev') {
                    for (let i = 0; i < testServers.length; i++) {
                        const testServer = testServers[i];
                        logger.debug(`Clearing [${commandNames.join(", ")}] from Guild: ${testServer}`)
                        await rest.put(
                            Routes.applicationGuildCommands(CLIENT_ID, testServer),
                            {body: []},
                        );
                    }
                } else if (env === 'prod') {
                    logger.debug(`Clearing [${commandNames.join(", ")}] globally`)
                    await rest.put(
                        Routes.applicationCommands(CLIENT_ID),
                        {body: []},
                    );
                }
                logger.debug('Successfully cleared application Slash commands.');
            } catch (error) {
                logger.error(error);
            }
            break
        default:
            break
    }
})();
