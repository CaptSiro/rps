import Entity from "../entities/Entity.ts";



export enum DamageType {
    TRUE,
    PHYSICAL,
    MAGIC,
}

export default class Damage {
    protected initiator: Entity | any;
    protected target: Entity | any;

    public constructor(
        protected type: DamageType,
        protected base: number,
        protected power: number = 10,
    ) {}



    public isAvoidable(): boolean {
        return this.type === DamageType.PHYSICAL;
    }

    public getInitiator(): Entity {
        return this.initiator;
    }

    public setInitiator(initiator: Entity): void {
        this.initiator = initiator;
    }

    public getTarget(): Entity {
        return this.target;
    }

    public setTarget(target: Entity): void {
        this.target = target;
    }

    public getType(): DamageType {
        return this.type;
    }

    public setType(type: DamageType): void {
        this.type = type;
    }

    public getBase(): number {
        return this.base;
    }

    public setBase(base: number): void {
        this.base = base;
    }

    public getPower(): number {
        return this.power;
    }

    public setPower(power: number): void {
        this.power = power;
    }

    public getAmount(absorption: number): number {
        const d = this.base * (this.power / 10);
        if (this.type === DamageType.TRUE) {
            return d;
        }

        return d * (1 - absorption);
    }
}