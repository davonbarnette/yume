import {Command} from "#utils"
import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";
import {Subcommands} from "./subcommands/keys.js";

let params = {
    name: "rem",
    aliases: ["rem"],
    description: "Set a reminder.",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.sdc.key)
                .setDescription("Set the default channel for reminders in this Server.")
                .addChannelOption(option =>
                    option
                        .setName("channel")
                        .setDescription("Default channel to be used")
                        .setRequired(true)
                        .addChannelTypes(0)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.spar.key)
                .setDescription("Set your personal AFK reminder max time.")
                .addNumberOption(option =>
                    option
                        .setName("afk_hours")
                        .setDescription("Hours")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(24)
                )
                .addNumberOption(option =>
                    option
                        .setName("afk_minutes")
                        .setDescription("Minutes")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(59)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.sar.key)
                .setDescription("Start your personal AFK Rewards reminder. Must use /rem spar before using this command.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.s.key)
                .setDescription("Start a reminder.")
                .addNumberOption(option =>
                    option
                        .setName("hours")
                        .setDescription("Hours")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(24)
                )
                .addNumberOption(option =>
                    option
                        .setName("minutes")
                        .setDescription("Minutes")
                        .setRequired(true)
                        .setMinValue(0)
                        .setMaxValue(59)
                )
                .addStringOption(option =>
                    option.setName("message")
                        .setDescription("Attach a message to your reminder")
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.lr.key)
                .setDescription("List your currently active reminders.")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.rat.key)
                .setDescription("Delete a reminder using its ID")
                .addNumberOption(option =>
                    option.setName("del_rem_id")
                        .setDescription("The ID of the reminder (use /rem lr to get your IDs)")
                        .setRequired(true)
                )
        )
}

export default new Command(params);



