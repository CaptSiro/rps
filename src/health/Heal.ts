export default class Heal {
    public constructor(
        protected base: number,
        protected power: number = 1 / .15,
    ) {}



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

    public getAmount(): number {
        return this.base * this.power * .15;
    }
}