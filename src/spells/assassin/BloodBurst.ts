import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { showInfo } from "../../core.ts";
import { createBleedingPrefab, prefab_bleeding } from "../../effects/prefabs.ts";
import { is } from "../../../lib/std.ts";
import DamageOnEvent from "../../effects/DamageOnEvent.ts";



export default class BloodBurst extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        let [bleeding, index] = target.findEffect(x => x.is(prefab_bleeding));
        const multiplier = is(bleeding) ? 2 : 1;

        if (is(bleeding)) {
            await showInfo([`${caster} strikes ${target} reopening healing wound`]);
            bleeding.setLifespan(5);
        } else {
            await showInfo([`${caster} strikes ${target}`]);
            bleeding = new DamageOnEvent(createBleedingPrefab(stats.dexterity), caster, target);
            await target.addEffect(bleeding);
        }

        await target.takeDamage(stats.strength * multiplier, false, true);
    }
}