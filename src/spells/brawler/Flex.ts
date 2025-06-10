import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { showInfo } from "../../core.ts";
import { prefab_intimidated } from "../../effects/effect_prefabs.ts";
import Intimidated from "../../effects/Intimidated.ts";
import { prefab_brawler } from "../class/prefabs.ts";



export const prefab_flex: SpellPrefab = {
    name: "Flex",
    description: "Caster and target flexes their strength. The stronger will intimidate the weaker lowering their strength and toughness. Intimidation stacks upto 3 times",
    class: prefab_brawler,
}

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