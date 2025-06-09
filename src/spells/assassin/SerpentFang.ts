import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { power, showInfo } from "../../core.ts";
import { Venom } from "../../effects/Venom.ts";
import { prefab_venom } from "../../effects/prefabs.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { prefab_assassin } from "../class/prefabs.ts";



export const prefab_serpentFang: SpellPrefab = {
    name: "Serpent Fang",
    description: "Deal a small amount of damage and apply Venom effect",
    class: prefab_assassin,
    power: 20,
}

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