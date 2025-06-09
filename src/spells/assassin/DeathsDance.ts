import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import StatChange from "../../effects/StatChange.ts";
import { prefab_sharpSpeedIncrease } from "../../effects/prefabs.ts";
import { instantiate, showInfo } from "../../core.ts";
import { prefab_assassin } from "../class/prefabs.ts";



export const prefab_deathsDance: SpellPrefab = {
    title: "Death's Dance",
    description: "Sharply increases evasion for 3 rounds",
    class: prefab_assassin,
};

export default class DeathsDance extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([caster.getName() + ' sharply increased chance of attack evasion']);
        const buff = instantiate(prefab_sharpSpeedIncrease);
        buff.lifespan = 3;
        await caster.addEffect(new StatChange(buff, caster, target));
    }
}