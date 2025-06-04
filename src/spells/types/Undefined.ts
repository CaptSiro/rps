import { TypePrefab } from "./Type.ts";
import Color from "../../Color.ts";
import { TYPE_ID_UNDEFINED } from "./ids.ts";




export const prefab_undefinedType: TypePrefab = {
    name: TYPE_ID_UNDEFINED,
    color: Color.fromHex("#ffffff"),
    winning: [],
    loosing: []
}