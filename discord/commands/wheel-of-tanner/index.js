import {Command} from "#utils"
import execute from './execute';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "wheeloftanner",
    aliases: ["wheel"],
    description: "Spin the wheel, let fate decide",
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
                .setDescription("Type your options, comma separated")
        )
}

export default new Command(params);
