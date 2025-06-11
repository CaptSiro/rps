import Effect, { EffectPrefab } from "./Effect.ts";
import Entity, { EntityStats } from "../entities/Entity.ts";
import Damage from "../health/Damage.ts";
import Heal from "../health/Heal.ts";
import { Immunity } from "../Immunity.ts";
import Spell from "../spells/Spell.ts";
import { parallelize } from "../../lib/std.ts";



export default class CompoundEffect<T extends EffectPrefab = EffectPrefab> extends Effect<T> {
    protected effects: Effect[];

    public constructor(
        prefab: T,
        caster: Entity,
        target: Entity
    ) {
        super(prefab, caster, target);
        this.effects = [];
        this.init();
    }

    public init(): void {}



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

    public async proc(): Promise<void> {
        await parallelize(this.effects, x => x.proc());
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

    public modifyDamageTaken(damage: Damage): Immunity {
        for (const effect of this.effects) {
            if (effect.modifyDamageTaken(damage) === Immunity.IMMUNE) {
                return Immunity.IMMUNE;
            }
        }

        return Immunity.NOT_IMMUNE;
    }

    public modifyHeal(heal: Heal): Heal {
        return this.effects.reduce(
            (h, x) => x.modifyHeal(h),
            heal
        );
    }

    public async onDamageTaken(damage: Damage): Promise<void> {
        await parallelize(this.effects, x => x.onDamageTaken(damage));
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
        await parallelize(this.effects, x => x.onRemove());
    }

    public async onBind(): Promise<void> {
        await parallelize(this.effects, x => x.onBind());
    }

    public async onBattleStart(): Promise<void> {
        await parallelize(this.effects, x => x.onBattleStart());
    }

    public async onRoundStart(): Promise<void> {
        await parallelize(this.effects, x => x.onRoundStart());
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
        await parallelize(this.effects, x => x.onRoundEnd());
    }
}