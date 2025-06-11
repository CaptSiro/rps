import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { randomInt } from "../../../lib/std.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { power, showInfo } from "../../core.ts";



export default class Berserk extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const hits = randomInt(3, 6);
        const stats = caster.getStats();

        for (let i = 0; i < hits; i++) {
            const dealt = await caster.dealDamage(target, new Damage(
                DamageType.PHYSICAL,
                stats.strength,
                power(this.prefab, 30)
            ));

            if (dealt <= 0) {
                continue;
            }

            await showInfo([
                caster + " smashed " + target,
                caster + " takes recoil damage",
            ]);

            await caster.dealDamage(caster, new Damage(
                DamageType.TRUE,
                dealt * .20,
                power(this.prefab, 30)
            ));
        }
    }
}