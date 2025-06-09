import { power, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import Spell, { SpellPrefab } from "../Spell.ts";
import { prefab_brawler } from "../class/prefabs.ts";
import Damage, { DamageType } from "../../health/Damage.ts";



export const prefab_rock: SpellPrefab = {
    name: 'Rock',
    description: 'Deal heavy blow. The damage is bigger the lower the enemy\'s health is.',
    class: prefab_brawler,
    power: 40,
};

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