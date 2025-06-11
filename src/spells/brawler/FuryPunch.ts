import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { hp, power, showInfo } from "../../core.ts";



export default class FuryPunch extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();

        const dealt = await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength * .50 + hp(target.getMissingHealth()) * .50,
            power(this.prefab, 60)
        ));

        if (dealt <= 0) {
            return;
        }

        await showInfo([caster + " hit " + target]);
    }
}