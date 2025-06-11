import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import Binding from "../../effects/Binding.ts";
import { prefab_binding } from "../../effects/_prefabs_effect.ts";
import { instantiate, power } from "../../core.ts";
import Damage, { DamageType } from "../../health/Damage.ts";



export default class DeathGrip extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        const hit = await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength,
            power(this.prefab, 10)
        ));

        if (!hit) {
            return;
        }

        const binding = instantiate(prefab_binding);
        binding.damageBase = stats.strength * .20;
        await target.addEffect(new Binding(binding, caster, target));
    }
}