import Entity from "../entities/Entity.ts";
import GameEvent, { GAME_EVENT_ROUND_END, GAME_EVENT_ROUND_START, GameEvent_onEvent } from "../GameEvent.ts";



export default abstract class Effect implements GameEvent {
    protected constructor(
        protected caster: Entity,
        protected target: Entity,
        protected name: string
    ) {}



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