import Spell from "../Spell.ts";
import Entity from "../../entities/Entity.ts";
import { showInfo } from "../../core.ts";
import ShadowRealmEffect from "../../effects/ShadowRealmEffect.ts";
import { prefab_shadowRealmEffect } from "../../effects/prefabs.ts";



export default class ShadowRealm extends Spell {
    public async action(caster: Entity, target: Entity, targetSpell: Spell): Promise<void> {
        await caster.addEffect(new ShadowRealmEffect(prefab_shadowRealmEffect, caster, target));
        await showInfo([caster + " moved into the Shadow Realm"]);
    }
}