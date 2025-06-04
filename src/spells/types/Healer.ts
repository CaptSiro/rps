import { TypePrefab } from "./Type.ts";
import Color from "../../Color.ts";
import { TYPE_ID_ASSASSIN, TYPE_ID_BRAWLER, TYPE_ID_HEALER } from "./ids.ts";




export const prefab_healer: TypePrefab = {
    name: TYPE_ID_HEALER,
    color: Color.fromHex("#a0de59"),
    loosing: [TYPE_ID_ASSASSIN],
    winning: [TYPE_ID_BRAWLER]
}