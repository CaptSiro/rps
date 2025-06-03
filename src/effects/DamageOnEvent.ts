import Effect from "./Effect";
import { showInfo } from "../core";
import { GAME_EVENT_ROUND_END } from "../GameEvent.ts";
import Entity from "../entities/Entity.ts";



export type DamageOnEventDefinition = {
    name: string,
    event: string,
    rounds: number,
    constant?: number,
    maxHealth?: number,
    currentHealth?: number,
    missingHealth?: number,
    reduceAble?: boolean
}

export const prefab_bleeding: DamageOnEventDefinition = {
    name: 'Bleeding',
    event: GAME_EVENT_ROUND_END,
    rounds: 5,
    maxHealth: .05
};

export default class DamageOnEvent extends Effect {
    protected definition: DamageOnEventDefinition;
    protected processed: number;

    public constructor(
        definition: DamageOnEventDefinition,
        caster: Entity,
        target: Entity
    ) {
        super(caster, target, definition.name);
        this.definition = definition;
        this.processed = 0;
    }



    public isHarmful(): boolean {
        return true;
    }

    public doRemove(): boolean {
        return this.processed >= this.definition.rounds;
    }

    public getRemovedMessage(): string {
        return this.target.getName() + ' healed ' + this.name;
    }

    public calculateDamage(): number {
        return (this.definition.constant ?? 0)
            + this.target.getCurrentHealth() * (this.definition.currentHealth ?? 0)
            + this.target.getMaxHealth() * (this.definition.maxHealth ?? 0)
            + this.target.getMissingHealth() * (this.definition.missingHealth ?? 0);
    }



    public async proc(): Promise<void> {
        await showInfo([this.target.getName() + ' is effected by ' + this.name]);
        await this.target.takeDamage(this.calculateDamage(), false, this.definition.reduceAble ?? false);
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
        if (event === this.definition.event) {
            await this.proc();
        }

        return super.onEvent(event);
    }
}
