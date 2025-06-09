import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { power, showInfo } from "../../core.ts";
import { createBleedingPrefab, prefab_bleeding } from "../../effects/prefabs.ts";
import { is } from "../../../lib/std.ts";
import DamageOnEvent from "../../effects/DamageOnEvent.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { prefab_assassin } from "../class/prefabs.ts";



export const prefab_bloodBurst: SpellPrefab = {
    name: "Blood Burst",
    description: "Strike the target for moderate amount of damage. Add or replenish Bleeding effect for 5 rounds on target. If the target was bleeding before the strike, deal double the base damage",
    class: prefab_assassin,
    power: 40,
};

export default class BloodBurst extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        let [bleeding] = target.findEffect(x => x.is(prefab_bleeding));
        const multiplier = is(bleeding) ? 2 : 1;

        if (is(bleeding)) {
            await showInfo([`${caster} strikes ${target} reopening healing wound`]);
            bleeding.setLifespan(5);
        } else {
            await showInfo([`${caster} strikes ${target}`]);
            bleeding = new DamageOnEvent(createBleedingPrefab(stats.dexterity), caster, target);
            await target.addEffect(bleeding);
        }

        await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength,
            power(this.prefab, 40) * multiplier
        ));
    }
}