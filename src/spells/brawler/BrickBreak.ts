import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { power, showInfo } from "../../core.ts";
import { EffectType } from "../../effects/EffectType.ts";
import { is } from "../../../lib/std.ts";



export default class BrickBreak extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const lines = [caster + " hit " + target];

        const stats = caster.getStats();
        await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength,
            power(this.prefab, 40)
        ));

        const [defence, index] = target.findEffect(x => x.getType() === EffectType.DEFENSE);
        if (!is(defence)) {
            return;
        }

        lines.push(caster + " destroyed " + target + "'s " + defence);
        await showInfo(lines);
        await target.removeEffect(index);
    }
}