import {Command} from "#utils"
import execute from './execute';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "deenguage",
    aliases: ["dng"],
    description: "Deenify any sentence (en => deen)",
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
                .setDescription("Type your sentence here")
        )
}

export default new Command(params);
