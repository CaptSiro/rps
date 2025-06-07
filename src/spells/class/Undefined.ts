import { ClassPrefab } from "./SpellClass.ts";
import Color from "../../Color.ts";
import { CLASS_UNDEFINED } from "./ids.ts";




export const prefab_undefinedClass: ClassPrefab = {
    name: CLASS_UNDEFINED,
    color: Color.fromHex("#ffffff"),
    winning: [],
    loosing: []
}