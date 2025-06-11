import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import Heal from "../../health/Heal.ts";
import { power, showInfo } from "../../core.ts";
import HealingPackageEffect from "../../effects/HealingPackageEffect.ts";
import { prefab_healingPackageEffect } from "../../effects/_prefabs_effect.ts";



export default class HealingPackage extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        if (caster.getMissingHealth() <= 1) {
            await caster.addEffect(new HealingPackageEffect(prefab_healingPackageEffect, caster, target));
            await showInfo([caster + " stored Healing Package for later"]);
        }

        const stats = caster.getStats();
        caster.heal(new Heal(
            stats.intelligence,
            power(this.prefab, 30)
        ));

        await showInfo([caster + " healed"]);
    }
}