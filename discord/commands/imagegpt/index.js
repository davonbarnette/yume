import {Command} from "#utils"
import execute from './execute';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "imagegpt",
    aliases: ["igpt"],
    description: "Uses image generation for ChatGPT",
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
                .setDescription("The prompt you would like ChatGPT to use when generating your image")
        )
}

export default new Command(params);



