import Entity from "../../entities/Entity.ts";
import { prefab_venomCloakEffect } from "../../effects/effect_prefabs.ts";
import { is } from "../../../lib/std.ts";
import VenomCloakEffect from "../../effects/VenomCloakEffect.ts";
import { showInfo } from "../../core.ts";
import Spell from "../Spell.ts";



export default class VenomCloak extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        const [effect] = caster.findEffect(x => x.is(prefab_venomCloakEffect));
        if (is(effect)) {
            await showInfo([`${caster} cannot put on another ${this}. Spell failed`]);
            return;
        }

        await caster.addEffect(new VenomCloakEffect(
            prefab_venomCloakEffect,
            caster,
            target
        ));
        await showInfo([caster + " put on " + this]);
    }
}