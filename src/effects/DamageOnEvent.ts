import Effect from "./Effect";
import { showInfo } from "../core";
import { GAME_EVENT_ROUND_END } from "../GameEvent.ts";
import Entity from "../entities/Entity.ts";



export type DamageOnEventPrefab = {
    name: string,
    event: string,
    rounds: number,
    constant?: number,
    maxHealth?: number,
    currentHealth?: number,
    missingHealth?: number,
    reduceAble?: boolean
}

export const prefab_bleeding: DamageOnEventPrefab = {
    name: 'Bleeding',
    event: GAME_EVENT_ROUND_END,
    rounds: 5,
    constant: 1
};

export default class DamageOnEvent extends Effect {
    protected processed: number;

    public constructor(
        protected prefab: DamageOnEventPrefab,
        caster: Entity,
        target: Entity
    ) {
        super(caster, target, prefab.name);
        this.processed = 0;
    }



    public isHarmful(): boolean {
        return true;
    }

    public getPrefab(): DamageOnEventPrefab {
        return this.prefab;
    }

    public doRemove(): boolean {
        return this.processed >= this.prefab.rounds;
    }

    public getRemovedMessage(): string {
        return this.target.getName() + ' healed ' + this.name;
    }

    public calculateDamage(): number {
        return (this.prefab.constant ?? 0)
            + this.target.getCurrentHealth() * (this.prefab.currentHealth ?? 0)
            + this.target.getMaxHealth() * (this.prefab.maxHealth ?? 0)
            + this.target.getMissingHealth() * (this.prefab.missingHealth ?? 0);
    }



    public async proc(): Promise<void> {
        await showInfo([this.target.getName() + ' is effected by ' + this.name]);
        await this.target.takeDamage(this.calculateDamage(), false, this.prefab.reduceAble ?? false);
        this.processed++;
    }



    // GameEvent
    public onBind(): Promise<void> {
        return Promise.resolve(undefined);
    }

    public onRoundEnd(): Promise<void> {
        return Promise.resolve(undefined);
    }

    public onRoundStart(): Promise<void> {
        return Promise.resolve(undefined);
    }

    public async onEvent(event: string): Promise<void> {
        if (event === this.prefab.event) {
            await this.proc();
        }

        return super.onEvent(event);
    }
}
