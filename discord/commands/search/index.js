import {Command} from "#utils"
import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";
import {availableCollections} from "#settings";
import Case from "case";

let params = {
    name: "search",
    aliases: ["search"],
    description: "Search by type from the Capybara Go! database",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Search Capybara Go! database')
                .setRequired(true)
                .addChoices(availableCollections.map(collection => ({
                    name: Case.title(collection), value: collection
                })))
        )

}

export default new Command(params);
