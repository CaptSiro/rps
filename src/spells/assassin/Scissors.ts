import Spell, { SpellPrefab } from "../Spell.ts";
import { instantiate, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import DamageOnEvent, { prefab_bleeding } from "../../effects/DamageOnEvent.ts";
import { prefab_assassin } from "../class/prefabs.ts";



export const prefab_scissors: SpellPrefab = {
    title: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.',
    class: prefab_assassin
};

export default class Scissors extends Spell {
    async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        await showInfo([caster.getName() + ' cut ' + target.getName()]);
        await target.takeDamage(stats.strength);

        const bleeding = instantiate(prefab_bleeding);
        bleeding.constant = stats.dexterity * 0.3;
        await target.addEffect(new DamageOnEvent(bleeding, caster, target));
    }
}