import Spell, { SpellPrefab } from "./Spell";
import Entity from "../entities/Entity.ts";
import { prefab_undefinedType } from "./types/Undefined.ts";



export const prefab_none: SpellPrefab = {
    title: 'Empty',
    description: 'This spell is played when player or opponent don\'t have a valid spell to play',
    type: prefab_undefinedType,
};

export default class None extends Spell {
    constructor() {
        super(prefab_none);
    }

    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        throw new Error("None spell should never be able to perform its action");
    }
}