import {BaseUtils, ChestGrowthManager, getGeneralEmbed} from "#utils"
import {Colors, inlineCode, underline} from "discord.js";
import Case from "case";

export async function calculateChestGrowth(params) {
    const {
        parentInteraction, client, discordUserId, optionsHandler
        // strapiUser,
    } = params
    const chestGrowthManager = new ChestGrowthManager(
        optionsHandler.numChests, optionsHandler.curMileage
    )
    const {
        roundsCompleted,
        tasksCompleted,
        eventFinished,
        totalPointsInitial,
        rewards,
        extraChests,
        extraPoints,
        initialChests,
        totalPoints,
        currentRound,
        currentTask,
        pointsToCompleteCurrentRound,
        pointsToCompleteCurrentTask,
        pointsToCompleteEvent
    } = chestGrowthManager.data
    let rewardsDescription = ""
    Object.keys(rewards).forEach(reward => {
        rewardsDescription+= `${inlineCode(BaseUtils.numberWithCommas(rewards[reward]))} ${Case.title(reward)}\n`
    })
    let chestsDescription = ""
    Object.keys(initialChests).forEach(chestType => {
        let initialChest = initialChests[chestType]
        let icPoints = chestGrowthManager.rewardsPerChest[chestType] * initialChest
        let extraChest = extraChests[chestType]
        let ePoints = chestGrowthManager.rewardsPerChest[chestType] * extraChest
        let desc = `${underline(`${Case.title(chestType)} Chests`)}\n* ${BaseUtils.numberWithCommas(initialChest)} starting — ${BaseUtils.numberWithCommas(icPoints)} points\n* ${BaseUtils.numberWithCommas(extraChest)} from mileage — ${BaseUtils.numberWithCommas(ePoints)} points`
        if (chestType === "silver"){
            desc += `\n* ${BaseUtils.numberWithCommas(chestGrowthManager.silverChestsFromRounds)} from task rewards — ${BaseUtils.numberWithCommas(chestGrowthManager.silverChestsFromRounds * chestGrowthManager.rewardsPerChest[chestType])} points`
        }
        desc += "\n\n"
        chestsDescription += desc
    })
    let finishedDescription = `
    You have enough to finish this event ⟶ ${BaseUtils.numberWithCommas(chestGrowthManager.maxTasksToComplete * chestGrowthManager.pointsRequiredPerTask)} points
    `
    let notFinishedDescription = `
    Projected: Round ${currentRound} ⟶ Task ${currentTask} ⟶ ${chestGrowthManager.pointsRequiredPerTask - pointsToCompleteCurrentTask} Points
    \`${BaseUtils.numberWithCommas(totalPoints)}\` total points accrued
    \`${BaseUtils.numberWithCommas(pointsToCompleteCurrentTask)}\` more points needed to advance to next task
    \`${BaseUtils.numberWithCommas(pointsToCompleteCurrentRound)}\` more points needed to advance to next round
    \`${BaseUtils.numberWithCommas(pointsToCompleteEvent)}\` more points needed to complete event
    `
    let description = `
    :dart: **Your Progress**
    ${eventFinished ? finishedDescription : notFinishedDescription}
    :moneybag: **Total Rewards**
    
    ${rewardsDescription}
    :toolbox: **Chests**
    
    ${inlineCode(BaseUtils.numberWithCommas(totalPointsInitial))} points from current chests
    ${inlineCode(BaseUtils.numberWithCommas(extraPoints))} points from mileage chests and task rewards
    
    ${chestsDescription}
    `
    let embed = getGeneralEmbed()
        .setTitle(":abacus: Chest Gwouf Ebent Weeeawds Cawuwuwcuwator")
        .setDescription(description)
    return parentInteraction.editReply({
        embeds: [embed]
    })
}
