import Entity, { EntityStats } from "../entities/Entity.ts";
import Spell from "../spells/Spell.ts";
import { Prefab } from "../core.ts";
import Damage from "../health/Damage.ts";
import Heal from "../health/Heal.ts";
import { Immunity } from "../Immunity.ts";



export type EffectPrefab = {
    name: string,
    lifespan?: number,
}

export default class Effect {
    protected round: number;

    protected constructor(
        protected caster: Entity,
        protected target: Entity,
        protected name: string,
        protected lifespan: number = Number.POSITIVE_INFINITY
    ) {
        this.round = 0;
    }

    public toString(): string {
        return this.getName();
    }



    public getName(): string {
        return this.name;
    }

    public isHarmful(): boolean {
        return false;
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
        return this.round >= this.lifespan;
    }

    public getRemovedMessage(): string {
        return 'Effect removed';
    }

    public is(prefab: Prefab): boolean {
        return this.name === prefab.name;
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

    public onTakenDamage(damage: Damage): Immunity {
        return Immunity.NOT_IMMUNE;
    }

    public onEffectAdded(effect: Effect): Immunity {
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