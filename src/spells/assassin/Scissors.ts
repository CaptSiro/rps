import Spell, { SpellPrefab } from "../Spell.ts";
import { power, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import { prefab_assassin } from "../class/prefabs.ts";
import { createBleedingPrefab } from "../../effects/prefabs.ts";
import DamageOnEvent from "../../effects/DamageOnEvent.ts";
import Damage, { DamageType } from "../../health/Damage.ts";



export const prefab_scissors: SpellPrefab = {
    name: 'Scissors',
    description: 'Cut opponent for small amount of damage and add one stack of bleeding.',
    class: prefab_assassin,
    power: 20,
};

export default class Scissors extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        await showInfo([caster.getName() + ' cut ' + target.getName()]);

        await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength,
            power(this.prefab, 20)
        ));

        await target.addEffect(
            new DamageOnEvent(createBleedingPrefab(stats.dexterity), caster, target)
        );
    }
}