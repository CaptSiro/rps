import Entity, { EntityStats } from "../entities/Entity.ts";
import Spell from "../spells/Spell.ts";
import { Prefab } from "../core.ts";
import Damage from "../health/Damage.ts";
import Heal from "../health/Heal.ts";
import { Immunity } from "../Immunity.ts";
import { EffectType } from "./EffectType.ts";



export type EffectPrefab = {
    name: string,
    type: EffectType,
    lifespan?: number,
};

export default class Effect<T extends EffectPrefab = EffectPrefab> {
    protected round: number;
    protected lifespan: number;

    public constructor(
        protected prefab: T,
        protected caster: Entity,
        protected target: Entity,
    ) {
        this.round = 0;
        this.lifespan = this.prefab.lifespan ?? Number.POSITIVE_INFINITY;
    }

    public toString(): string {
        return this.getName();
    }



    public getPrefab(): T {
        return this.prefab;
    }

    public getName(): string {
        return this.prefab.name;
    }

    public getType(): EffectType {
        return this.prefab.type;
    }

    public getCaster(): Entity {
        return this.caster;
    }

    public getTarget(): Entity {
        return this.target;
    }

    public getLifespan(): number {
        return this.lifespan;
    }

    public setLifespan(lifespan: number): void {
        this.lifespan = lifespan;
    }

    public doRemove(): boolean {
        return this.round > this.lifespan;
    }

    public getRemovedMessage(): string {
        return this + ' removed';
    }

    public is(prefab: Prefab): boolean {
        return this.prefab.name === prefab.name;
    }



    public async proc(): Promise<void> {}

    public modifyStats(stats: EntityStats): EntityStats {
        return stats;
    }

    public modifyDamage(damage: Damage): Damage {
        return damage;
    }

    public modifyHeal(heal: Heal): Heal {
        return heal;
    }

    public modifyDamageTaken(damage: Damage): Immunity {
        return Immunity.NOT_IMMUNE;
    }

    public async onDamageTaken(damage: Damage): Promise<void> {}

    public async onEffectAdded(effect: Effect): Promise<Immunity> {
        return Immunity.NOT_IMMUNE;
    }

    public async onRemove(): Promise<void> {}

    public async onBind(): Promise<void> {}

    public async onBattleStart(): Promise<void> {}

    public async onRoundStart(): Promise<void> {}

    public async onSpellPerform(spell: Spell): Promise<boolean> {
        return true;
    }

    public async onRoundEnd(): Promise<void> {
        this.round++;
    }
}