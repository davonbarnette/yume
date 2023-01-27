import { REST, Routes } from "discord.js"
import {DISCORD_SETTINGS} from "#settings"
import commandsRegistry from "#commands-registry"

const {
    CLIENT_ID,
    DISCORD_TOKEN,
} = DISCORD_SETTINGS;

const rest = new REST({version: '10'}).setToken(DISCORD_TOKEN);

(async () => {
    let commands = [];
    let values = [...commandsRegistry.values()];
    for (let i = 0; i < values.length; i++) {
        const command = values[i];
        if (!command.disabled) {
            let slashCommand = await command.getSlashCommand();
            commands.push(slashCommand);
        }
    }

    try {
        console.log('Started refreshing application (/) commands.');
        await rest.put(
                Routes.applicationCommands(CLIENT_ID),
                {body: commands},
            );
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();
