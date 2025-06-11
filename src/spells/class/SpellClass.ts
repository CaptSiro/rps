import Color from "../../Color.ts";



export type ClassIdentifier = string;

export type ClassPrefab = {
    name: ClassIdentifier,
    color: Color,
    loosing: ClassIdentifier[],
    winning: ClassIdentifier[]
};

export type Loss = -1;
export type Draw = 0;
export type Win = 1;
export type Outcome = Loss|Draw|Win;

export const WIN: Win = 1;
export const LOSS: Loss = -1;
export const DRAW: Draw = 0;



export default class SpellClass {
    public constructor(
        protected prefab: ClassPrefab
    ) {}



    public getName(): string {
        return this.prefab.name;
    }

    public getColor(): Color {
        return this.prefab.color;
    }

    public compare(opponent: SpellClass): Outcome {
        if (this.prefab.loosing.includes(opponent.getName())) {
            return LOSS;
        }

        if (this.prefab.winning.includes(opponent.getName())) {
            return WIN;
        }

        return DRAW;
    }
}