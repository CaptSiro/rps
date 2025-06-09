import Spell, { SpellPrefab } from "./Spell";
import Entity from "../entities/Entity.ts";
import { prefab_undefinedClass } from "./class/prefabs.ts";
import { Outcome } from "./class/SpellClass.ts";



export const prefab_none: SpellPrefab = {
    name: 'Empty',
    description: 'This spell is played when player or opponent don\'t have a valid spell to play',
    class: prefab_undefinedClass,
};

export default class None extends Spell {
    constructor() {
        super(prefab_none);
    }

    async perform(outcome: Outcome, caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        throw new Error("None spell should never be able to perform its action");
    }
}