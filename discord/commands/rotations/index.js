import {Command} from "#utils"
import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";
import {Subcommands} from "./subcommands/keys.js";

let params = {
    name: "rotations",
    aliases: ["rot"],
    description: "Get information on the current rotations",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.equipment.key)
                .setDescription("Get the current UP Equipment Rotation")
        )
}

export default new Command(params);



