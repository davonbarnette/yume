import {bold, codeBlock, hyperlink, quote, underline} from "discord.js";
import {getGeneralEmbed} from "#utils";
import Case from "case";

export const EMBEDS_BY_COLLECTION = {
    artifacts: {
        imageSize: 50,
        getDescription: (artifact) => {
            return addNewLine([
                `Artifacts special equipment that adds stat multipliers to the players and Ignore enemy Dodge Rate when upgraded. You do not need to equip artifacts to get the bonus stats and special effects.`,
                addNewLine([
                    addNewLine([
                        bold("Skill"),
                        artifact.skill
                    ], 1),
                    addNewLine([
                        bold("Passive"),
                        artifact.passive
                    ], 1)
                ], 2)
            ], 2)
        },
    },
    equipments: {
        imageSize: 100,
        getDescription: (equipment, link) => {
            return addNewLine([
                `Players can equip items in the Equipment tab in order to increase Capybara stats and buff different aspects of their builds.`,
                `Slot: ${bold(Case.title(equipment.type))}`,
                `${equipment.bonuses.base}.`,
                RecordEmbed.renderBonusDescription(equipment.bonuses)
            ], 2)
        },
    },
    inheritances: {
        imageSize: 100,
        getDescription: (inheritance, link) => {
            return addNewLine([
                `Inheritance is unlocked after reaching ${bold("Hero")} and is located in the ${bold("Elite")} tab where the Talents were. You can select one of the inheritances as active and it will apply the bonuses of the corresponding tree.`,
                addNewLine([
                    underline("Inheritance Tier Upgrades:"),
                    ...inheritance.bonuses.map((bonus, index) => `${index}. ${bold(bonus.name)} — ${bonus.description}`)
                ], 1),
                addNewLine([
                    underline("Inheritance Heroes:"),
                    ...inheritance.heroes.map(hero => `- ${hyperlink(hero.name, `${process.env.HITAGI_APP_URL}/capybarago/legacies/${hero.documentId}`)} — ${hero.bonuses.rare}`)
                ], 1)
            ], 2)
        },
    },
    legacies: {
        imageSize: 100,
        getDescription: (legacy, link) => {
            return addNewLine([
                `The ${bold("Elite")} tab gives you access to multiple upgrade trees where you can improve your ${bold("Elite")}, equip ${bold("Heroes")} and ${bold("Brands")} to help you in battles and boost your Builds. It unlocks upon finishing ${bold("Talents")} and reaching the Hero rank. They can be managed in the ${bold("Equipment")} menu. Heroes and Brands are mainly acquired using the Wishing but can be obtained from the event rewards. You can use Hero and Brand fragments and Books to activate and upgrade them. Inheritance Heroes use Elite Pact instead of Brand fragments.`,
                `Type: ${bold(Case.title(legacy.type))}`,
                legacy.inheritance ? `This hero comes from the ${hyperlink(legacy.inheritance.name, `${process.env.HITAGI_APP_URL}/capybarago/inheritances/${legacy.inheritance.documentId}`)} Inheritance tree.` : null,
                RecordEmbed.renderBonusDescription(legacy.bonuses)
            ], 2)
        },
    },
    mounts: {
        imageSize: 50,
        getDescription: (mount, link) => {
            return addNewLine([
                `Mounts are cosmetic equipment that add additional stat multipliers to the players and increase Dodge Rate when upgraded. You do not need to equip mounts to get the bonus stats and mount effects. With Advanced Mounts, you get a passive bonus that is globally activated when it is unlocked, and an optional equippable Skill that is only applied when it is equipped.`,
                `Type: ${bold("Advanced Mount")}`,
                addNewLine([
                    addNewLine([
                        bold("Skill"),
                        mount.skill
                    ], 1),
                    addNewLine([
                        bold("Passive"),
                        mount.passive
                    ], 1)
                ], 2)
            ], 2)
        },
    },
    pets: {
        imageSize: 100,
        getDescription: (pet, link) => {
            return addNewLine([
                `Pets help Capybara in the fight and provide additional stats and bonuses. They can be acquired through hatching Pet Eggs in the Pets tab. Duplicate pets can be used to upgrade (enhance) pets.`,
                addNewLine([
                    addNewLine([
                        bold("Battle Skill"),
                        pet.battleSkill
                    ], 1),
                ], 2)
            ], 2)
        },
    },
    skills: {
        imageSize: 100,
        getDescription: (skill, link) => {
            return addNewLine([
                `Skills improve combat capabilities and rewarded on level up or during adventure events.`,
                addNewLine([
                    addNewLine([
                        bold("Description"),
                        skill.description
                    ], 1),
                    addNewLine([
                        bold("Notes"),
                        skill.notesAndDetails || "None"
                    ], 1),
                ], 2)
            ], 2)
        },
    }
}

export class RecordEmbed {
    constructor(record) {
        this.record = record
        this.settings = EMBEDS_BY_COLLECTION[this.record.collectionName]
    }

    getImgUrl() {
        const {collectionName: incomingCn, name, imageName} = this.record
        let collectionName = incomingCn
        if (collectionName === "inheritances") {
            collectionName = "legacies"
        }
        const prefix = this.settings.imageSize
        let baseUrl = `${process.env.HITAGI_ASSETS_URL}/capybarago/${collectionName}/`
        if (prefix) {
            baseUrl += `${prefix}px-`
        }
        if (imageName) {
            baseUrl += imageName.split(" ").join("_") + '.png'
        } else {
            baseUrl += name.split(" ").join("_") + '.png'
        }

        return baseUrl
    }

    static get baseLink() {
        return `${process.env.HITAGI_APP_URL}/capybarago`
    }

    static get buildsLink() {
        return `${RecordEmbed.baseLink}/builds`
    }

    get link() {
        let collectionName = this.record.collectionName
        if (collectionName === "equipments") {
            collectionName = "equipment"
        }
        return `${RecordEmbed.baseLink}/${collectionName}/${this.record.documentId}`
    }

    get description() {
        let curDescription = quote(`See more information on ${hyperlink(this.record.name, this.link)}. You can also see builds containing ${this.record.name} ${hyperlink('here', RecordEmbed.buildsLink)}.`)
        curDescription += '\n\n'
        curDescription += this.settings.getDescription(this.record, this.link)
        return curDescription
    }

    get embed() {
        const imgUrl = this.getImgUrl()
        let embed = getGeneralEmbed()
            .setThumbnail(imgUrl)
            .setTitle(this.record.name)
            .setDescription(this.description)

        if (this.settings.getFields) {
            embed.setFields(this.settings.getFields(this.record))
        }

        return embed
    }

    static getBonusFields(bonuses) {
        const {id, base, ...rest} = bonuses
        return Object.keys(rest).map(bonusKey => (
            {name: Case.title(bonusKey), value: codeBlock(rest[bonusKey] || "None"), inline: true}
        ))
    }

    static renderBonusDescription(bonuses) {
        let bonusDescription = []
        const {id, base, ...rest} = bonuses
        Object.keys(rest).forEach(bonusKey => {
            bonusDescription.push(`${bold(Case.title(bonusKey))} — ${bonuses[bonusKey] || "None"}`)
        })
        return addNewLine(bonusDescription, 1)
    }
}

function addNewLine(array, linesBetween) {
    let str = ""
    let newLines = ""
    for (let i = 0; i < linesBetween; i++) {
        newLines += "\n"
    }
    array.forEach((arrayStr, i) => {
        if (arrayStr) {
            str += arrayStr
            if (i !== array.length - 1) {
                str += newLines
            }
        }
    })
    return str
}
