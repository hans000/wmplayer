import { PlayMode } from './type'
import { createPlayer } from './core/player'

export const create = createPlayer
export { PlayMode } from './type'

export default {
    create: createPlayer,
    PlayMode: PlayMode,
}