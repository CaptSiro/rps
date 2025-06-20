import Spell from "../Spell.ts";
import { power, showInfo } from "../../core.ts";
import Entity from "../../entities/Entity.ts";
import { is } from "../../../lib/std.ts";
import Heal from "../../health/Heal.ts";
import { EffectType } from "../../effects/EffectType.ts";



export default class Paper extends Spell {
    async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const info = showInfo([
            caster.getName() + ' healed'
        ]);

        caster.heal(new Heal(
            caster.getStats().intelligence,
            power(this.prefab, 20)
        ));

        const [effect, index] = caster.findEffect(effect => effect.getType() === EffectType.HARMFUL);
        if (!is(effect)) {
            await info;
            return;
        }

        await caster.removeEffect(index);
        await info;
    }
}