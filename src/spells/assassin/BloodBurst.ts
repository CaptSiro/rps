import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { power, showInfo } from "../../core.ts";
import { createBleedingPrefab, prefab_bleeding } from "../../effects/_prefabs_effect.ts";
import { is } from "../../../lib/std.ts";
import DamageOverTime from "../../effects/DamageOverTime.ts";
import Damage, { DamageType } from "../../health/Damage.ts";



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
            bleeding = new DamageOverTime(createBleedingPrefab(stats.dexterity), caster, target);
            await target.addEffect(bleeding);
        }

        await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength,
            power(this.prefab, 40) * multiplier
        ));
    }
}