import Effect from "./Effect.ts";
import Damage from "../health/Damage.ts";
import { Immunity } from "../Immunity.ts";



export default class ShadowRealmEffect extends Effect {
    public modifyDamageTaken(damage: Damage): Immunity {
        return Immunity.IMMUNE;
    }

    public async onEffectAdded(effect: Effect): Promise<Immunity> {
        return Immunity.IMMUNE;
    }
}