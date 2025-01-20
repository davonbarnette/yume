import Logger from "#logger";
import {rotateUpEquipment} from "#root/cron-jobs/tasks/rotate-up-equipment.js";
import {rotateGrowthEvents} from "#root/cron-jobs/tasks/rotate-growth-events.js";
import {rotateSubgrowthEvents} from "#root/cron-jobs/tasks/rotate-subgrowth-events.js";
import {rotateCapyGacha} from "#root/cron-jobs/tasks/rotate-capy-gacha.js";
import {sendCgoResetMessage} from "#root/cron-jobs/tasks/send-cgo-reset-message.js";

export async function cgoDayReset(client, localCache) {
    Logger.debug("Starting cgoDayReset cron job")
    await rotateUpEquipment()
    await rotateGrowthEvents()

    // Must rotate growth events before rotating subgrowth events
    await rotateSubgrowthEvents()
    await rotateCapyGacha()
    await sendCgoResetMessage(client, localCache)
    Logger.debug("Finished cgoDayReset cron job")
}
