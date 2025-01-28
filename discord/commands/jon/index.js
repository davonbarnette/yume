import {Command} from "#utils"
import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "jon",
    aliases: ["jon"],
    description: "What does the jon say",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
}

export default new Command(params);
