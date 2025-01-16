import {setDefaultChannel} from './set-default-channel.js'
import {setPersonalAfkTimer} from './set-personal-afk-timer.js'
import {startAfkReminder} from './start-afk-reminder.js'
import {startReminder} from './start-reminder.js'
import {listReminders} from './list-reminders.js'
import {deleteReminder} from "./delete-reminder.js";

export const Subcommands = {
    sdc: {
        key: 'sdc',
        execute: setDefaultChannel
    },
    spar: {
        key: 'spar',
        execute: setPersonalAfkTimer
    },
    sar: {
        key: 'sar',
        execute: startAfkReminder
    },
    s: {
        key: 's',
        execute: startReminder
    },
    lr: {
        key: 'lr',
        execute: listReminders
    },
    rat: {
        key: 'rat',
        execute: deleteReminder
    },
}
