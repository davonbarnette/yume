import {Command} from "#utils"
import execute from './execute.js';
import autocomplete from './autocomplete.js';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "findone",
    aliases: ["findone"],
    description: "Search by name from the Capybara Go! database",
    execute,
    autocomplete,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
        .addStringOption(option =>
            option.setName('name')
                .setDescription('Search by name')
                .setRequired(true)
                .setAutocomplete(true))

}

export default new Command(params);
