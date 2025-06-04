import Color from "../../Color.ts";
import { TypePrefab } from "./Type.ts";
import { TYPE_ID_ASSASSIN, TYPE_ID_BRAWLER, TYPE_ID_HEALER } from "./ids.ts";




export const prefab_brawler: TypePrefab = {
    name: TYPE_ID_BRAWLER,
    color: Color.fromHex("#691a06"),
    winning: [TYPE_ID_ASSASSIN],
    loosing: [TYPE_ID_HEALER]
}