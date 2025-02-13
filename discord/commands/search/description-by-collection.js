import {bold, codeBlock, hyperlink, quote, underline} from "discord.js";
import {getGeneralEmbed} from "#utils";
import Case from "case";

export const DESCRIPTIONS_BY_COLLECTION = {
    artifacts: {
        imageSize: 50,
        getDescription: (artifact) => {
            return addNewLine([
                addNewLine([
                    addNewLine([
                        bold("Skill"),
                        artifact.skill
                    ], 1),
                    addNewLine([
                        bold("Passive"),
                        artifact.passive
                    ], 1)
                ], 1)
            ], 1)
        },
    },
    equipments: {
        imageSize: 100,
        getDescription: (equipment) => {
            return addNewLine([
                `Slot: ${bold(Case.title(equipment.type))}`,
                `${equipment.bonuses.base}.`,
            ], 1)
        },
    },
    inheritances: {
        imageSize: 100,
        getDescription: (inheritance, link) => {
            return addNewLine([
                addNewLine([
                    underline("Inheritance Tier Upgrades:"),
                    ...inheritance.bonuses.map((bonus, index) => `${index}. ${bold(bonus.name)} — ${bonus.description}`)
                ], 1)
            ], 1)
        },
    },
    legacies: {
        imageSize: 100,
        getDescription: (legacy, link) => {
            return addNewLine([
                `Type: ${bold(Case.title(legacy.type))}`,
                `Epic Skill: ${legacy.bonuses.epic}`,
                legacy.inheritance ? `This hero comes from the ${hyperlink(legacy.inheritance.name, `${process.env.HITAGI_APP_URL}/capybarago/inheritances/${legacy.inheritance.documentId}`)} Inheritance tree.` : null,
            ], 1)
        },
    },
    mounts: {
        imageSize: 50,
        getDescription: (mount, link) => {
            return addNewLine([
                addNewLine([
                    addNewLine([
                        bold("Skill"),
                        mount.skill
                    ], 1),
                    addNewLine([
                        bold("Passive"),
                        mount.passive
                    ], 1)
                ], 1)
            ], 1)
        },
    },
    pets: {
        imageSize: 100,
        getDescription: (pet, link) => {
            return addNewLine([
                addNewLine([
                    addNewLine([
                        bold("Battle Skill"),
                        pet.battleSkill
                    ], 1),
                ], 1)
            ], 1)
        },
    },
    skills: {
        imageSize: 100,
        getDescription: (skill, link) => {
            return addNewLine([
                addNewLine([
                    addNewLine([
                        bold("Description"),
                        skill.description
                    ], 1),
                    addNewLine([
                        bold("Notes"),
                        skill.notesAndDetails || "None"
                    ], 1),
                ], 1)
            ], 1)
        },
    }
}

export class SearchRecordEmbed {
    constructor(record) {
        this.record = record
        this.settings = DESCRIPTIONS_BY_COLLECTION[this.record.collectionName]
    }

    static get baseLink() {
        return `${process.env.HITAGI_APP_URL}/capybarago`
    }

    static get buildsLink() {
        return `${SearchRecordEmbed.baseLink}/builds`
    }

    get link() {
        let collectionName = this.record.collectionName
        if (collectionName === "equipments") {
            collectionName = "equipment"
        }
        return `${SearchRecordEmbed.baseLink}/${collectionName}/${this.record.documentId}`
    }

    get description() {
        return addNewLine([
            hyperlink(this.record.name, this.link),
            this.settings.getDescription(this.record, this.link)
        ], 1)
    }
}

function addNewLine(array, linesBetween) {
    let str = ""
    let newLines = ""
    for (let i = 0; i < linesBetween; i++) {
        newLines += "\n"
    }
    const filtered = array.filter(arrayStr => !!arrayStr)
    filtered.forEach((arrayStr, i) => {
        str += arrayStr
        if (i !== filtered.length - 1) {
            str += newLines
        }
    })
    return str
}
