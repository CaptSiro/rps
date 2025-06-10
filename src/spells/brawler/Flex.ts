import Entity from "../../entities/Entity.ts";
import { showInfo } from "../../core.ts";
import { prefab_intimidated } from "../../effects/_prefabs_effect.ts";
import Intimidated from "../../effects/Intimidated.ts";
import Spell from "../Spell.ts";



export default class Flex extends Spell {
    protected async addIntimidated(caster: Entity, target: Entity): Promise<void> {
        const stacks = target.getEffectStacks(x => x.is(prefab_intimidated));
        if (stacks >= 3) {
            return;
        }

        await target.addEffect(new Intimidated(
            prefab_intimidated,
            caster,
            target
        ));
    }

    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        if (caster.getStats().strength < target.getStats().strength) {
            await this.addIntimidated(target, caster);
            await showInfo([`${caster} is weaker than ${target}. ${caster} is intimidated by ${target}'s strength`]);
            return;
        }

        await this.addIntimidated(caster, target);
        await showInfo([`${target} is intimidated by ${caster}'s strength`]);
    }
}