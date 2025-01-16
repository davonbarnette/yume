import express from 'express'
import logger from '#logger'
import {DiscordConsumer} from "#root/consumer.js"
import commandsRegistry from "#commands-registry"
import {APP_SETTINGS, DISCORD_SETTINGS} from "#settings";
import cron from 'node-cron'
const app = express()

app.get('/', (req, res) => {
  res.send('Success')
})

app.listen(APP_SETTINGS.PORT, () => {
  logger.debug(`Running with configuration`, APP_SETTINGS, DISCORD_SETTINGS)
  logger.debug(`Listening at ${APP_SETTINGS.HOST}:${APP_SETTINGS.PORT}}`)
})

new DiscordConsumer(commandsRegistry)
