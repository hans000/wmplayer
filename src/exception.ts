const name = 'wmplayer'

export function error(msg: string) {
    return new Error(`[${name} error]: ${msg}`)
}

export function warn(msg: string) {
    return console.error(`[${name} warn]: ${msg}`)
}

