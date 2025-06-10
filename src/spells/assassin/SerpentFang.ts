import Entity from "../../entities/Entity.ts";
import { power, showInfo } from "../../core.ts";
import { Venom } from "../../effects/Venom.ts";
import { prefab_venom } from "../../effects/effect_prefabs.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import Spell from "../Spell.ts";



export default class SerpentFang extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([`${caster} stabbed ${target}, penetrating a small dose of venom into victim's body`]);
        const stats = caster.getStats();

        await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength,
            power(this.prefab, 20))
        );

        await target.addEffect(new Venom(prefab_venom, caster, target));
    }
}