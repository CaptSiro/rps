import Spell from "./Spell";
import { showInfo } from "../core";



/** @type {SpellDefinition} */
export const prefab_rock = {
    title: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.',
};

export default class Rock extends Spell {
    /**
     * @param {Entity} caster
     * @param {Entity} target
     * @param {Spell} targetSpell
     */
    async perform(caster, target, targetSpell) {
        await showInfo([caster.getName() + ' hit ' + target.getName()]);
        await target.takeDamage(caster.definition.strength + target.getMissingHealth() * 0.05);
    }
}