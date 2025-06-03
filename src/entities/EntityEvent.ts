import GameEvent, { GameEvent_onEvent } from "../GameEvent.ts";
import Spell from "../spells/Spell.ts";



export const ENTITY_EVENT_DRAW_SPELLS = 'draw_spells';
export const ENTITY_EVENT_CHOOSE_SPELL = 'choose_spell';



export async function EntityEvent_onEvent(event: string, object: EntityEvent): Promise<any> {
    switch (event) {
        case ENTITY_EVENT_CHOOSE_SPELL: return await object.onChooseSpell();
        default: return await GameEvent_onEvent(event, object);
    }
}

export default interface EntityEvent extends GameEvent {
    onDrawSpells(spell: Spell[]): Promise<void>;

    onChooseSpell(): Promise<Spell>;
}