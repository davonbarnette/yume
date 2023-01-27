import {Command} from "#utils"

import execute from './execute.js';
import {SlashCommandBuilder} from "discord.js";

let params = {
    name: "anime-release",
    aliases: ["ar"],
    description: "Searches for anime coming out on specific days during the current season.",
    execute,
    disabled: false,
}

params.getSlashCommand = async () => {
    return new SlashCommandBuilder()
        .setName(params.name)
        .setDescription(params.description)
        .addStringOption(option =>
            option
                .setName("day")
                .setDescription("The day you want to search for anime. If no day is specified, uses the current day.")
                .addChoices(
                    {name: "Monday", value: "monday"},
                    {name: "Tuesday", value: "tuesday"},
                    {name: "Wednesday", value: "wednesday"},
                    {name: "Thursday", value: "thursday"},
                    {name: "Friday", value: "friday"},
                    {name: "Saturday", value: "saturday"},
                    {name: "Sunday", value: "sunday"},
                )
        )
}

export default new Command(params);



