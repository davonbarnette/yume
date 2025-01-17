import {RotationsOptionsHandler} from "./options.handler.js"
import {Subcommands} from "./subcommands/keys.js";


export default async (parentInteraction, client, discordUserId) => {
    await parentInteraction.deferReply()
    const {user, options: parentOptions} = parentInteraction
    const {_hoistedOptions, _subcommand} = parentOptions

    const optionsHandler = new RotationsOptionsHandler(_hoistedOptions, discordUserId)
    const execute = Subcommands[_subcommand].execute

    if (execute) {
        return await execute({
            parentInteraction, client, discordUserId,
            optionsHandler,
        })
    }
    return parentInteraction.editReply(`Thanks`)
}





