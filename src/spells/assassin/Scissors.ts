import Spell, { SpellPrefab } from "../Spell.ts";
import { instantiate, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import { prefab_assassin } from "../class/prefabs.ts";
import { createBleedingPrefab, prefab_bleeding } from "../../effects/prefabs.ts";
import DamageOnEvent from "../../effects/DamageOnEvent.ts";



export const prefab_scissors: SpellPrefab = {
    title: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.',
    class: prefab_assassin,
};

export default class Scissors extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        await showInfo([caster.getName() + ' cut ' + target.getName()]);
        await target.takeDamage(stats.strength);

        await target.addEffect(
            new DamageOnEvent(createBleedingPrefab(stats.dexterity), caster, target)
        );
    }
}