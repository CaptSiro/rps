import Spell from "./Spell";
import { showInfo } from "../core";
import DamageAfterRound, { prefab_bleeding } from "../effect/DamageAfterRound";



/** @type {SpellDefinition} */
export const prefab_scissors = {
    title: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.'
};

export default class Scissors extends Spell {
    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     */
    async perform(caster, target, targetSpell) {
        await showInfo([caster.getName() + ' cut ' + target.getName()]);
        await target.takeDamage(caster.definition.strength * 0.1 + target.definition.maxHealth * 0.05);
        await target.addEffect(new DamageAfterRound(prefab_bleeding, caster, target));
    }
}