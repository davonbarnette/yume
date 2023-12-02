import {Command} from "#utils"
import execute from './execute';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "loot",
    aliases: ["loot"],
    description: "Add loot to a chest, sort them by rarity.",
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
                .setName("players")
                .setDescription("Type your players' names, comma separated")
        )
        .addIntegerOption(option =>
            option
                .setRequired(true)
                .setName("items")
                .setMaxValue(56)
                .setMinValue(0)
                .setDescription("Number of occupied chest slots")
        )
}

export default new Command(params);
