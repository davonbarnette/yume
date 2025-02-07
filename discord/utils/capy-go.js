export class ChestGrowthManager {
    numRounds = 4
    numTasksPerRound = 5
    maxTasksToComplete = this.numRounds * this.numTasksPerRound
    pointsRequiredPerTask = 1000
    rewardsPerTask = {divineHammers: 100, silverChests: 10, gems: 100}
    rewardsPerRound = {darkMoonTickets: 2, divineHammers: 1000, gems: 1000}
    rewardsPerChest = {bronze: 1, silver: 10, gold: 20, pet: 50, gem: 0}
    numChests = {bronze: 0, silver: 0, gold: 0, pet: 0, gem: 0}
    extraChests = {bronze: 0, silver: 0, gold: 0, pet: 0, gem: 0}
    initialChests = {bronze: 0, silver: 0, gold: 0, pet: 0, gem: 0}
    silverChestsFromRounds = 0
    totalPointsSpent = 0
    initialPointsSpent = 0
    numTasksCompleted = 0
    eventFinished = false
    curRewards = {darkMoonTickets: 0, divineHammers: 0, gems: 0, silverChests: 0}
    mileage = [
        "silver_20",
        "silver_30",
        "gold_40",
        "pet_80",
        "gold_60",
        "gem_100",
        "gold_80",
        "pet_120",
        "gem_180"
    ]
    curMileage = {
        chestType: undefined,
        points: 0,
        pointsSpent: 0,
        pointsRefunded: 0,
    }

    constructor(numChests, chestMileage) {
        this.numChests = {
            bronze: 0, silver: 0, gold: 0, pet: 0, gem: 0,
            ...numChests
        }
        this.initialChests = {
            bronze: 0, silver: 0, gold: 0, pet: 0, gem: 0,
            ...numChests
        }
        if (chestMileage?.chestType) {
            this.curMileage.chestType = chestMileage.chestType || "silver_20"
            this.curMileage.points = chestMileage.points || 0
        }
        this._init()
    }

    hasCompletedRound(round){
        return round <= this.data.roundsCompleted
    }
    hasCompletedTask(round, task){
        let curTask = round * task
        return this.numTasksCompleted >= curTask
    }

    get totalPointsInitial(){
        let points = 0
        Object.keys(this.initialChests).forEach(chestName => {
            points += this.initialChests[chestName] * this.rewardsPerChest[chestName]
        })
        return points
    }

    get sumPointsPerChest() {
        const sumPointsPerChest = {}
        Object.keys(this.numChests).forEach(chestName => {
            sumPointsPerChest[chestName] = this.numChests[chestName] * this.rewardsPerChest[chestName]
        })
        return sumPointsPerChest
    }

    get totalPoints() {
        let points = 0
        Object.keys(this.sumPointsPerChest).forEach(chestName => {
            points += this.sumPointsPerChest[chestName]
        })
        return points
    }

    get hasChestsLeft() {
        let hasChestsLeft = false
        Object.keys(this.numChests).forEach(chestType => {
            if (this.numChests[chestType] > 0) {
                hasChestsLeft = true
            }
        })
        return hasChestsLeft
    }

    _init() {
        this.initialPointsSpent = this.totalPoints
        while (this.hasChestsLeft && !this.eventFinished) {
            this.spendPoints()
        }
    }

    get data(){
        return {
            roundsCompleted: this.numRoundsCompleted,
            tasksCompleted: this.numTasksCompleted,
            rewards: this.rewards,
            totalPointsInitial: this.totalPointsInitial,
            extraChests: this.extraChests,
            extraPoints: this.extraPoints,
            initialChests: this.initialChests,
            totalPoints: this.totalPointsSpent,
            currentRound: Math.min(this.numRoundsCompleted + 1, this.numRounds),
            currentTask: Math.min((this.numTasksCompleted % this.numTasksPerRound) + 1, this.numTasksPerRound),
            pointsToCompleteCurrentTask: this.pointsRequiredPerTask - (this.totalPointsSpent % this.pointsRequiredPerTask),
            pointsToCompleteCurrentRound: this.pointsRequiredPerRound - (this.totalPointsSpent % (this.pointsRequiredPerRound)),
            pointsToCompleteEvent: this.pointsRequiredForEvent - this.totalPointsSpent,
            eventFinished: this.eventFinished
        }
    }

    get pointsRequiredPerRound(){
        return this.pointsRequiredPerTask * this.numTasksPerRound
    }

    get pointsRequiredForEvent(){
        return this.pointsRequiredPerRound * this.numRounds
    }

    get numRoundsCompleted(){
        const r = this.numTasksCompleted % this.numTasksPerRound
        return (this.numTasksCompleted - r) / this.numTasksPerRound
    }

    get rewards(){
        let rewards = {...this.curRewards}
        Object.keys(this.rewardsPerRound).forEach(reward => {
            rewards[reward] += this.rewardsPerRound[reward] * this.numRoundsCompleted
        })
        Object.keys(this.rewardsPerTask).forEach(reward => {
            rewards[reward] += this.rewardsPerTask[reward] * this.numTasksCompleted
        })
        return rewards
    }

    get extraPoints(){
        return this.totalPointsSpent - this.initialPointsSpent
    }

    spendPoints() {
        if (this.numTasksCompleted >= this.maxTasksToComplete) {
            this.numChests = {
                bronze: 0,
                silver: 0,
                gold: 0,
                pet: 0,
                gem: 0
            }
        }
        let curPointsFromChests = this.totalPoints
        let curMileagePoints = this.curMileage.points
        let curAvailableMileagePoints = curPointsFromChests + curMileagePoints
        let remainingFromPreviousRounds = this.totalPointsSpent % this.pointsRequiredPerTask
        let r = (curPointsFromChests + remainingFromPreviousRounds) % this.pointsRequiredPerTask
        this.totalPointsSpent += curPointsFromChests
        if (this.totalPointsSpent >= this.pointsRequiredPerTask * this.maxTasksToComplete){
            this.eventFinished = true
        }
        let numTasksCompleted = Math.round((curPointsFromChests + remainingFromPreviousRounds - r) / this.pointsRequiredPerTask)
        if ((curPointsFromChests + remainingFromPreviousRounds) < this.pointsRequiredPerTask){
            numTasksCompleted = 0
        }
        if ((this.numTasksCompleted + numTasksCompleted) > this.maxTasksToComplete){
            numTasksCompleted = this.maxTasksToComplete - this.numTasksCompleted
        }
        this.numTasksCompleted += numTasksCompleted
        this.silverChestsFromRounds += numTasksCompleted * this.rewardsPerTask.silverChests
        this.numChests = {
            bronze: 0,
            silver: numTasksCompleted * this.rewardsPerTask.silverChests,
            gold: 0,
            pet: 0,
            gem: 0
        }
        if (this.curMileage.chestType) {
            let milestone = this.mileage.indexOf(this.curMileage.chestType)
            let [chest, pointsNeeded] = this.mileage[milestone].split("_")
            if (pointsNeeded) {
                pointsNeeded = parseInt(pointsNeeded)
            }
            while (curAvailableMileagePoints > pointsNeeded) {
                this.numChests[chest]++
                this.extraChests[chest]++
                milestone += 1
                if (!this.mileage[milestone]) {
                    milestone = 0
                }
                curAvailableMileagePoints -= pointsNeeded
                const [curChest, curPointsNeeded] = this.mileage[milestone].split("_")
                chest = curChest
                pointsNeeded = parseInt(curPointsNeeded)
            }
            this.curMileage.chestType = this.mileage[milestone]
            this.curMileage.points = curAvailableMileagePoints
        }
    }
}
