import cron from "node-cron";
import {sendReminders} from "#root/cron-jobs/send-reminders.js";
import {cgoDayReset} from "#root/cron-jobs/cgo-day-reset.js";
import Logger from "#logger";


export function initDiscordCron(client, localCache) {
    cron.schedule('* * * * *', () => {
        sendReminders(client, localCache)
    })
    cron.schedule('* 19 * * *', () => {
        cgoDayReset(client, localCache)
    }, {
        scheduled: true,
        timezone: "America/New_York"
    })
    Logger.debug("Discord cron jobs initialized")
}
