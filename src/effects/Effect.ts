import Entity from "../entities/Entity.ts";
import GameEvent, { GAME_EVENT_ROUND_END, GAME_EVENT_ROUND_START, GameEvent_onEvent } from "../GameEvent.ts";



export default abstract class Effect implements GameEvent {
    protected readonly name: string;

    protected caster: Entity;
    protected target: Entity;



    protected constructor(caster: Entity, target: Entity, name: string) {
        this.caster = caster;
        this.target = target;
        this.name = name;
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

    public doRemove(): boolean {
        return false;
    }

    public getRemovedMessage(): string {
        return 'Effect removed';
    }

    public getName(): string {
        return this.name;
    }



    public async proc(): Promise<void> {}



    public abstract onBind(): Promise<void>;

    public abstract onRoundEnd(): Promise<void>;

    public abstract onRoundStart(): Promise<void>;

    public async onEvent(event: string): Promise<void> {
        await GameEvent_onEvent(event, this);
    }
}