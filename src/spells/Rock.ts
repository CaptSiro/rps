import Spell, { SpellDefinition } from "./Spell";
import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";



export const prefab_rock: SpellDefinition = {
    title: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.',
};

export default class Rock extends Spell {
    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([caster.getName() + ' hit ' + target.getName()]);
        await target.takeDamage(caster.getDefinition().strength + target.getMissingHealth() * 0.05);
    }
}