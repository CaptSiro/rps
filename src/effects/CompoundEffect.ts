import Effect, { EffectPrefab } from "./Effect.ts";
import { EntityStats } from "../entities/Entity.ts";
import Damage from "../health/Damage.ts";
import Heal from "../health/Heal.ts";
import { Immunity } from "../Immunity.ts";
import Spell from "../spells/Spell.ts";
import { Producer } from "../../types.ts";



export default class CompoundEffect<T extends EffectPrefab = EffectPrefab> extends Effect<T> {
    protected effects: Effect[] = [];

    public add(effect: Effect): void {
        this.effects.push(effect);
    }

    public doRemove(): boolean {
        for (const effect of this.effects) {
            if (effect.doRemove()) {
                return true;
            }
        }

        return super.doRemove();
    }

    public async parallelize(producer: Producer<Effect, Promise<void>>): Promise<void> {
        const promises = new Array(this.effects.length);
        for (let i = 0; i < this.effects.length; i++) {
            promises[i] = producer(this.effects[i]);
        }

        await Promise.all(promises);
    }

    public async proc(): Promise<void> {
        await this.parallelize(x => x.proc());
    }

    public modifyStats(stats: EntityStats): EntityStats {
        return this.effects.reduce(
            (s, x) => x.modifyStats(s),
            stats
        );
    }

    public modifyDamage(damage: Damage): Damage {
        return this.effects.reduce(
            (d, x) => x.modifyDamage(d),
            damage
        );
    }

    public modifyHeal(heal: Heal): Heal {
        return this.effects.reduce(
            (h, x) => x.modifyHeal(h),
            heal
        );
    }

    public async onTakenDamage(damage: Damage): Promise<Immunity> {
        for (const effect of this.effects) {
            if (await effect.onTakenDamage(damage) === Immunity.IMMUNE) {
                return Immunity.IMMUNE;
            }
        }

        return Immunity.NOT_IMMUNE;
    }

    public async onEffectAdded(effect: Effect): Promise<Immunity> {
        for (const effect of this.effects) {
            if (await effect.onEffectAdded(effect) === Immunity.IMMUNE) {
                return Immunity.IMMUNE;
            }
        }

        return Immunity.NOT_IMMUNE;
    }

    public async onRemove(): Promise<void> {
        await this.parallelize(x => x.onRemove());
    }

    public async onBind(): Promise<void> {
        await this.parallelize(x => x.onBind());
    }

    public async onBattleStart(): Promise<void> {
        await this.parallelize(x => x.onBattleStart());
    }

    public async onRoundStart(): Promise<void> {
        await this.parallelize(x => x.onRoundStart());
    }

    public async onSpellPerform(spell: Spell): Promise<boolean> {
        for (const effect of this.effects) {
            if (!(await effect.onSpellPerform(spell))) {
                return false;
            }
        }

        return true;
    }

    public async onRoundEnd(): Promise<void> {
        await super.onRoundEnd();
        await this.parallelize(x => x.onRoundEnd());
    }
}