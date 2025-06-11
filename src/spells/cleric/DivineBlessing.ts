import Spell from "../Spell.ts";
import Entity, { EntityStats } from "../../entities/Entity.ts";
import { instantiate } from "../../core.ts";
import { prefab_sharpStatIncrease } from "../../effects/_prefabs_effect.ts";
import { assert, randomItem } from "../../../lib/std.ts";
import StatChange from "../../effects/StatChange.ts";



export default class DivineBlessing extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const statCategories: (keyof EntityStats)[] = [
            "evasiveness",
            // "luck",
            "toughness",
            "maxHealth",
            "intelligence",
            "strength",
            "dexterity"
        ];

        const buff = instantiate(prefab_sharpStatIncrease);
        buff.lifespan = 1;
        buff.stat = assert(randomItem(statCategories));

        await caster.addEffect(new StatChange(buff, caster, target));
    }
}