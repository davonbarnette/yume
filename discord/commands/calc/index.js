import {Command} from "#utils"
import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";
import {Subcommands} from "./subcommands/keys.js";

let params = {
    name: "calc",
    aliases: ["calc"],
    description: "Calculate",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
        .addSubcommand(subcommand =>
            subcommand
                .setName(Subcommands.chests.key)
                .setDescription("Calculate your Chest Growth")
                .addNumberOption(option =>
                    option.setName("bronze")
                        .setDescription("Number of bronze chests")
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName("silver")
                        .setDescription("Number of silver chests")
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName("gold")
                        .setDescription("Number of gold chests")
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName("pet")
                        .setDescription("Number of pet chests")
                        .setRequired(true)
                )
                .addNumberOption(option =>
                    option.setName("gem")
                        .setDescription("Number of gem chests")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option.setName('mileage')
                        .setDescription('Current chest mileage')
                        .addChoices(
                            {name: 'Silver - 20', value: 'silver_20'},
                            {name: 'Silver - 30', value: 'silver_30'},
                            {name: 'Gold - 40', value: 'gold_40'},
                            {name: 'Pet - 80', value: 'pet_80'},
                            {name: 'Gold - 60', value: 'gold_60'},
                            {name: 'Gem - 100', value: 'gem_100'},
                            {name: 'Gold - 80', value: 'gold_80'},
                            {name: 'Pet - 120', value: 'pet_120'},
                            {name: 'Gem - 180', value: 'gem_180'},
                        )
                )
                .addNumberOption(option =>
                    option.setName("mileage_points")
                        .setDescription("Current chest mileage points")
                )
        )
}

export default new Command(params);



