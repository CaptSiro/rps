import Color from "../../Color.ts";



export type TypeIdentifier = string;

export type TypePrefab = {
    name: TypeIdentifier,
    color: Color,
    loosing: TypeIdentifier[],
    winning: TypeIdentifier[]
}

export type Loss = -1;
export type Draw = 0;
export type Win = 1;
export type Outcome = Loss|Draw|Win;

export const WIN: Win = 1;
export const LOSS: Loss = -1;
export const DRAW: Draw = 0;



export default class Type {
    public static outcome(caller: Type[], opponent: Type[]): Outcome {
        // sum = sum_i^n(sum_j^m(compare(c_i, o_j)))
        const sum = caller.reduce((s, callerType) => {
            return s + opponent.reduce((ss, opponentType) => {
                return ss + callerType.compare(opponentType);
            }, 0);
        }, 0);

        const sign = Math.sign(sum);
        if (sign === -0) {
            return DRAW;
        }

        return sign as Outcome;
    }



    public constructor(
        protected prefab: TypePrefab
    ) {}



    public getName(): string {
        return this.prefab.name;
    }

    public getColor(): Color {
        return this.prefab.color;
    }

    public compare(opponent: Type): Outcome {
        if (this.prefab.loosing.includes(opponent.getName())) {
            return LOSS;
        }

        if (this.prefab.winning.includes(opponent.getName())) {
            return WIN;
        }

        return DRAW;
    }
}