import Spell, { SpellPrefab } from "./Spell";
import { showInfo } from "../core";
import { Opt } from "../../lib/types.ts";
import Entity from "../entities/Entity.ts";
import Effect from "../effects/Effect.ts";
import { prefab_healer } from "./types/Healer";



export const prefab_paper: SpellPrefab = {
    title: 'Paper',
    description: 'Heals caster, removes one harmful effect, and disables opponent\'s spell for 1 round',
    type: prefab_healer,
};

export default class Paper extends Spell {
    async perform(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        // todo
        //  - strength -> healPower
        caster.heal(caster.getDefinition().strength);

        let effect: Opt<Effect> = undefined;
        const effects = caster.getEffects();
        for (let i = 0; i < effects.length; i++) {
            if (effects[i].isHarmful()) {
                effect = effects[i];
                effects.splice(i, 1);
                break;
            }
        }

        await showInfo([
            caster.getName() + ' healed'
        ]);
    }
}