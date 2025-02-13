import {GatewayIntentBits} from "discord.js";

export const APP_SETTINGS = {
    PORT: process.env.PORT || 8080,
    HOST: process.env.HOST || 'http://localhost'
}
export const DISCORD_SETTINGS = {
    CLIENT_ID: process.env.CLIENT_ID,
    DISCORD_TOKEN: process.env.DISCORD_TOKEN,
    COMMAND_TEST_GUILD_IDS: process.env.COMMAND_TEST_GUILD_IDS.split(","),
    INTENTS: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
    ]
}
export const VALORANT_API_ENDPOINT = process.env.VALORANT_API_ENDPOINT
export const JIKAN_API_ENDPOINT = process.env.JIKAN_API_ENDPOINT
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export const availableCollections = [
    'equipments',
    'legacies',
    'inheritances',
    'pets',
    'mounts',
    'artifacts',
    'skills',
]
