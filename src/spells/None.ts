import Spell from "./Spell";
import Entity from "../entities/Entity.ts";



/** @type {SpellDefinition} */
export const prefab_none = {
    title: 'Empty',
    description: 'This spell is played when player or opponent don\'t have a valid spell to play'
};

export default class None extends Spell {
    constructor() {
        super(prefab_none);
    }

    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        throw new Error("None spell should never be able to perform its action");
    }
}