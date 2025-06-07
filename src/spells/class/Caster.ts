import { ClassPrefab } from "./SpellClass.ts";
import Color from "../../Color.ts";
import { CLASS_ASSASSIN, CLASS_BRAWLER, CLASS_CASTER } from "./ids.ts";




export const prefab_caster: ClassPrefab = {
    name: CLASS_CASTER,
    color: Color.fromHex("#abef8f"),
    loosing: [CLASS_ASSASSIN],
    winning: [CLASS_BRAWLER]
}