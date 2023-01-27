import {Command} from "#utils"
import execute from './execute';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "valcomp",
    aliases: ["vc"],
    description: "Get a random 5-man val comp",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
}

export default new Command(params);
