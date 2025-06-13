import { ClassIdentifier, ClassPrefab } from "./SpellClass.ts";
import Color from "../../Color.ts";
import ClassPriority from "../../sequences/ClassPriority.ts";



export const CLASS_ASSASSIN: ClassIdentifier = "Assassin";
export const CLASS_BRAWLER: ClassIdentifier = "Brawler";
export const CLASS_CLERIC: ClassIdentifier = "Cleric";
export const CLASS_RANGER: ClassIdentifier = "Ranger";
export const CLASS_RULE_BREAKER: ClassIdentifier = "Rule-Breaker";
export const CLASS_GUARDIAN: ClassIdentifier = "Guardian";
export const CLASS_MAGE: ClassIdentifier = "Mage";
export const CLASS_NECROMANCER: ClassIdentifier = "Necromancer";



const priority = new ClassPriority(1000);



export const CLASS_UNDEFINED: ClassIdentifier = "undefined";
export const prefab_undefinedClass: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_UNDEFINED,
    color: Color.fromHex("#ffffff"),
    winning: [],
    loosing: []
}



export const prefab_brawler: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_BRAWLER,
    color: Color.fromHex("#ef8f8f"),
    winning: [CLASS_ASSASSIN, CLASS_RANGER, CLASS_GUARDIAN],
    loosing: [CLASS_CLERIC, CLASS_RULE_BREAKER, CLASS_MAGE, CLASS_NECROMANCER],
}

export const prefab_cleric: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_CLERIC,
    color: Color.fromHex("#abef8f"),
    winning: [CLASS_BRAWLER, CLASS_GUARDIAN, CLASS_NECROMANCER],
    loosing: [CLASS_ASSASSIN, CLASS_RANGER, CLASS_RULE_BREAKER, CLASS_MAGE],
}

export const prefab_assassin: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_ASSASSIN,
    color: Color.fromHex("#8fd6ef"),
    winning: [CLASS_CLERIC, CLASS_RANGER, CLASS_MAGE],
    loosing: [CLASS_BRAWLER, CLASS_RULE_BREAKER, CLASS_GUARDIAN, CLASS_NECROMANCER],
}

export const prefab_ranger: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_RANGER,
    color: Color.fromHex("#9b8fef"),
    winning: [CLASS_CLERIC, CLASS_GUARDIAN, CLASS_NECROMANCER],
    loosing: [CLASS_ASSASSIN, CLASS_BRAWLER, CLASS_RULE_BREAKER, CLASS_MAGE],
}

export const prefab_ruleBreaker: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_RULE_BREAKER,
    color: Color.fromHex("#ef8fd2"),
    winning: [CLASS_ASSASSIN, CLASS_BRAWLER, CLASS_CLERIC, CLASS_RANGER, CLASS_MAGE, CLASS_NECROMANCER],
    loosing: [CLASS_RULE_BREAKER, CLASS_GUARDIAN],
}

export const prefab_guardian: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_GUARDIAN,
    color: Color.fromHex("#ffffff"),
    winning: [CLASS_ASSASSIN, CLASS_RULE_BREAKER, CLASS_MAGE],
    loosing: [CLASS_BRAWLER, CLASS_CLERIC, CLASS_RANGER, CLASS_NECROMANCER]
}

export const prefab_mage: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_MAGE,
    color: Color.fromHex("#8f8fef"),
    winning: [CLASS_BRAWLER, CLASS_CLERIC, CLASS_RANGER],
    loosing: [CLASS_ASSASSIN, CLASS_RULE_BREAKER, CLASS_GUARDIAN],
}

export const prefab_necromancer: ClassPrefab = {
    priority: priority.unique(),
    name: CLASS_NECROMANCER,
    color: Color.fromHex("#000000"),
    winning: [CLASS_ASSASSIN, CLASS_BRAWLER, CLASS_GUARDIAN],
    loosing: [CLASS_CLERIC, CLASS_RANGER, CLASS_RULE_BREAKER],
}
