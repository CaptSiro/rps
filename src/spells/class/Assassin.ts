import { ClassPrefab } from "./SpellClass.ts";
import Color from "../../Color.ts";
import { CLASS_ASSASSIN, CLASS_BRAWLER, CLASS_CASTER, CLASS_RANGER } from "./ids.ts";



export const prefab_assassin: ClassPrefab = {
    name: CLASS_ASSASSIN,
    color: Color.fromHex("#8fd6ef"),
    loosing: [CLASS_BRAWLER],
    winning: [CLASS_CASTER, CLASS_RANGER],
}