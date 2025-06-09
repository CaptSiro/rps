import { showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import Spell, { SpellPrefab } from "../Spell.ts";
import { prefab_brawler } from "../class/prefabs.ts";



export const prefab_rock: SpellPrefab = {
    title: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.',
    class: prefab_brawler,
};

export default class Rock extends Spell {
    async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([caster.getName() + ' hit ' + target.getName()]);
        await target.takeDamage(caster.getStats().strength * 2 + target.getMissingHealth() * 0.05);
    }
}