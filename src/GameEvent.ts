export const GAME_EVENT_ROUND_START = 'round_start'
export const GAME_EVENT_ROUND_END = 'round_end'



export async function GameEvent_onEvent(event: string, object: GameEvent): Promise<void> {
    switch (event) {
        case GAME_EVENT_ROUND_START: return await object.onRoundStart();
        case GAME_EVENT_ROUND_END: return await object.onRoundEnd();
    }
}

export default interface GameEvent {
    onRoundStart(): Promise<void>;

    onRoundEnd(): Promise<void>;

    onEvent(event: string): Promise<void>;
}