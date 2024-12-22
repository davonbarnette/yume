import {Command} from "#utils"
import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "chatgpt",
    aliases: ["cgpt"],
    description: "Uses text completion for ChatGPT",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
        .addStringOption(option =>
            option
                .setRequired(true)
                .setName("text")
                .setDescription("The prompt you would like ChatGPT to answer")
        )
}

export default new Command(params);



