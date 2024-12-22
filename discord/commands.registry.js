import fs from "fs";
import {Collection} from "discord.js";

let commandsRegistry = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => !file.endsWith('.js'));

for (const folder of commandFiles) {
	const {default: command} = await import(`./commands/${folder}/index.js`);
	commandsRegistry.set(command.name, command);
}

export default commandsRegistry;
