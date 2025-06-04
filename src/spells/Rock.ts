import { showInfo } from "../core";
import Entity from "../entities/Entity.ts";
import Spell, { SpellPrefab } from "./Spell";
import { prefab_brawler } from "./types/Brawler";



export const prefab_rock: SpellPrefab = {
    title: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.',
    type: prefab_brawler,
};

export default class Rock extends Spell {
    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([caster.getName() + ' hit ' + target.getName()]);
        await target.takeDamage(caster.getDefinition().strength + target.getMissingHealth() * 0.05);
    }
}