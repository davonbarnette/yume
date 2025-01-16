import cron from "node-cron";
import {sendReminders} from "#root/cron-jobs/send-reminders.js";
import Logger from "#logger";

export function initDiscordCron(client) {
    cron.schedule('* * * * *', () => {
        sendReminders(client)
    })
    Logger.debug("Discord cron jobs initialized")
}
