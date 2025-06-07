import Color from "../../Color.ts";
import { ClassPrefab } from "./SpellClass.ts";
import { CLASS_ASSASSIN, CLASS_BRAWLER, CLASS_CASTER, CLASS_RANGER } from "./ids.ts";




export const prefab_brawler: ClassPrefab = {
    name: CLASS_BRAWLER,
    color: Color.fromHex("#ef8f8f"),
    winning: [CLASS_ASSASSIN],
    loosing: [CLASS_CASTER, CLASS_RANGER]
}