import { power, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import { createBleedingPrefab } from "../../effects/_prefabs_effect.ts";
import DamageOverTime from "../../effects/DamageOverTime.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import Spell from "../Spell.ts";



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
            new DamageOverTime(createBleedingPrefab(stats.dexterity), caster, target)
        );
    }
}