import Spell from "./Spell";



/** @type {SpellDefinition} */
export const prefab_emptySpell = {
    title: 'Empty',
    description: 'This spell is played when player or opponent don\'t have a valid spell to play'
};

export default class EmptySpell extends Spell {
    constructor() {
        super(prefab_emptySpell);
    }

    async perform(caster, target, targetSpell) {
        throw new Error("EmptySpell should never be able to perform its action");
    }
}