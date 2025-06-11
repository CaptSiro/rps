import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import Damage, { DamageType } from "../../health/Damage.ts";
import { power, showInfo } from "../../core.ts";
import Confusion from "../../effects/Confusion.ts";
import { prefab_confusion } from "../../effects/_prefabs_effect.ts";



export type HeadbuttPrefab = {
    confusionChance: number,
} & SpellPrefab;

export default class Headbutt extends Spell<HeadbuttPrefab> {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const stats = caster.getStats();

        const dealt = await caster.dealDamage(target, new Damage(
            DamageType.PHYSICAL,
            stats.strength,
            power(this.prefab, 50)
        ));

        if (dealt <= 0) {
            return;
        }

        if (Math.random() < this.prefab.confusionChance) {
            const effect = new Confusion(prefab_confusion, caster, target);
            await showInfo([`${caster} inflicted ${effect} to ${target}`]);
            await target.addEffect(effect);
        }

        await showInfo([
            caster + " headbutted " + target,
            caster + " takes recoil damage"
        ]);

        await caster.dealDamage(caster, new Damage(
            DamageType.TRUE,
            dealt * .20,
            power(this.prefab, 50)
        ));
    }
}