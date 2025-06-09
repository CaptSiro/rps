import Entity from "../entities/Entity.ts";



export default abstract class Effect {
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

    public abstract onBattleStart(): Promise<void>;

    public abstract onRoundStart(): Promise<void>;

    public abstract onRoundEnd(): Promise<void>;
}