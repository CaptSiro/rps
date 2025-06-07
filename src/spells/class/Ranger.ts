import { ClassPrefab } from "./SpellClass.ts";
import { CLASS_ASSASSIN, CLASS_BRAWLER, CLASS_RANGER } from "./ids.ts";
import Color from "../../Color.ts";



export const prefab_ranger: ClassPrefab = {
    name: CLASS_RANGER,
    color: Color.fromHex("#9b8fef"),
    loosing: [CLASS_ASSASSIN],
    winning: [CLASS_BRAWLER],
}