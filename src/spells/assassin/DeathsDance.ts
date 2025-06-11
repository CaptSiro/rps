import Entity from "../../entities/Entity.ts";
import StatChange from "../../effects/StatChange.ts";
import { prefab_sharpStatIncrease } from "../../effects/_prefabs_effect.ts";
import { instantiate, showInfo } from "../../core.ts";
import Spell from "../Spell.ts";



export default class DeathsDance extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await showInfo([caster.getName() + ' sharply increased chance of attack evasion']);
        const buff = instantiate(prefab_sharpStatIncrease);
        buff.lifespan = 3;
        buff.stat = "evasiveness";
        await caster.addEffect(new StatChange(buff, caster, target));
    }
}