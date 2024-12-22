import {Command} from "#utils"
import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "bara_afk",
    aliases: ["bafk"],
    description: "Set a reminder for your Capybara Go! AFK rewards.",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
}

export default new Command(params);



