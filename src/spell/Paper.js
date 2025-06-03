import Spell from "./Spell";
import { showInfo } from "../core";



/** @type {SpellDefinition} */
export const prefab_paper = {
    title: 'Paper',
    description: 'Heals caster, removes one harmful effect, and disables opponent\'s spell for 1 round'
};

export default class Paper extends Spell {
    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     */
    async perform(caster, target, targetSpell) {
        // todo
        //  - strength -> healPower
        caster.heal(caster.definition.strength);

        /** @type {Effect|undefined} */
        let effect = undefined;
        for (let i = 0; i < caster.effects.length; i++) {
            if (caster.effects[i].isHarmful()) {
                effect = caster.effects[i];
                caster.effects.splice(i, 1);
                break;
            }
        }

        await showInfo([
            caster.getName() + ' healed'
        ]);
    }
}