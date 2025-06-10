import { power, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import Spell from "../Spell.ts";



export default class Rock extends Spell {
    async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([caster.getName() + ' hit ' + target.getName()]);

        await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            caster.getStats().strength,
            power(this.prefab, 40)
        ));
    }
}