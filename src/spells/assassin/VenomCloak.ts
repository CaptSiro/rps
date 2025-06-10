import Spell, { SpellPrefab } from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { prefab_venomCloakEffect } from "../../effects/prefabs.ts";
import { is } from "../../../lib/std.ts";
import VenomCloakEffect from "../../effects/VenomCloakEffect.ts";
import { showInfo } from "../../core.ts";
import { prefab_assassin } from "../class/prefabs.ts";



export const prefab_venomCloak: SpellPrefab = {
    name: "Venom Cloak",
    description: "The caster puts on Venom Cloak that adds stack of venom to target it physical spell was used. This cloak stays on until the venom stacks are used up",
    class: prefab_assassin,
}

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