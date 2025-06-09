import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { power, showInfo } from "../../core.ts";
import { prefab_ranger } from "../class/prefabs.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { randomInt } from "../../../lib/std.ts";



export const prefab_slingshot: SpellPrefab = {
    name: "Slingshot",
    description: "Caster fires a small bullet at target dealing random amount of damage",
    class: prefab_ranger,
    power: 20
}

export default class Slingshot extends Spell {
    protected chooseBullet(): [string, number] {
        const bullets: [string, number][] = [
            ["pebble", 1],
            ["iron ball", 1.25]
        ];

        return bullets[randomInt(0, bullets.length)];
    }

    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();
        const [bullet, multiplier] = this.chooseBullet();

        await showInfo([`${caster} has shot ${bullet} at ${target}`]);
        await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.dexterity,
            power(this.prefab, 20) * multiplier
        ));
    }
}