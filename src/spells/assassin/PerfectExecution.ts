import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { showInfo } from "../../core.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { prefab_assassin } from "../class/prefabs.ts";



export const prefab_perfectExecution: SpellPrefab = {
    name: "Perfect Execution",
    description: "If the target is below 20% health execute the target immediately, if not Perfect Execution fails",
    class: prefab_assassin,
    power: Number.POSITIVE_INFINITY
}

export default class PerfectExecution extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const targetStats = target.getStats();
        if (target.getCurrentHealth() / targetStats.maxHealth > .20) {
            await showInfo(["Perfect Execution failed"]);
            return;
        }

        await showInfo([caster + " executed " + target]);
        await caster.dealDamage(target, new Damage(
            DamageType.TRUE,
            targetStats.maxHealth,
        ));
    }
}