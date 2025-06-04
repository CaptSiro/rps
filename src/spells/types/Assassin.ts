import { TypePrefab } from "./Type.ts";
import Color from "../../Color.ts";
import { TYPE_ID_ASSASSIN, TYPE_ID_BRAWLER, TYPE_ID_HEALER } from "./ids.ts";



export const prefab_assassin: TypePrefab = {
    name: TYPE_ID_ASSASSIN,
    color: Color.fromHex("#2d6bd6"),
    loosing: [TYPE_ID_BRAWLER],
    winning: [TYPE_ID_HEALER],
}