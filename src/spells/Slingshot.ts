import Spell, { SpellPrefab } from "./Spell.ts";
import Entity from "../entities/Entity.ts";
import { showInfo } from "../core.ts";
import { prefab_ranger } from "./class/Ranger.ts";



export const prefab_slingshot: SpellPrefab = {
    title: "Slingshot",
    description: "Caster fires a small bullet at target dealing large amount of damage",
    class: prefab_ranger,
}

export default class Slingshot extends Spell {
    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        await target.takeDamage(stats.dexterity * 2 + target.getCurrentHealth() * 0.05);
        await showInfo([caster.getName() + " has landed the shot"]);
    }
}