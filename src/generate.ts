import RNG from "kol-rng";
import { globalOptions } from "./config";
import { rollModStrength } from "./roll";
import {
	collarAdjectives,
	collarBaseNames,
	collarColors,
	hatAdjectives,
	hatBaseModifiers,
	hatBaseNames,
	hatMetals,
	shirtAdjectives,
	shirtBaseNames,
	shirtMaterialQualities,
	shirtMaterials,
	wardrobeFamEquipModifier,
	wardrobeFamEquipModifiers,
	wardrobeHatModifier,
	wardrobeHatModifiers,
	wardrobeItem,
	wardrobeShirtModifier,
	wardrobeShirtModifiers,
} from "./wardrobe";

const maxRoll = 2147483648;

export type wardrobeItemResults = {
	day: number;
	shirt: wardrobeItemResult;
	hat: wardrobeItemResult;
	collar: wardrobeItemResult;
};

export type rolledModifier = {
	mod: wardrobeFamEquipModifier | wardrobeHatModifier | wardrobeShirtModifier;
	roll?: number | { min: number; max: number };
	match?: boolean;
};

export type wardrobeItemResult = {
	item: wardrobeItem;
	name?: string;
	image?: string;
	unknownRolls?: number[];
	modifiers: rolledModifier[];
	tier: number;
};

export function getFuturisticCollar(day: number, tier: number): wardrobeItemResult {
	const seed = day * 11393 + 2063;
	const rng = new RNG(seed);
	// ["Familiar Weight", "Familiar Damage", "Familiar Experience"]
	const collarModifiers = tier > 3 ? [0, 1, 2] : [0, 1];
	rng.shuffle(collarModifiers);
	const mod: wardrobeFamEquipModifier = wardrobeFamEquipModifiers[collarModifiers[0]];
	const image = rng.roll(0, 8);
	const unknownRolls = [];
	unknownRolls.push(rng.roll(maxRoll));
	const adjective = rng.pickOne(collarAdjectives);
	// each on it's own line so if we figure them out the git
	// changes will be clearer. These are probably to choose
	// the colors.
	unknownRolls.push(rng.roll(maxRoll));
	const conjunction = rng.mtRand.roll(0, 1) === 0 ? "-" : " and ";
	unknownRolls.push(rng.roll(maxRoll));
	const firstColor = rng.pickOne(collarColors);
	unknownRolls.push(rng.roll(maxRoll));
	let secondColor = rng.pickOne(collarColors);
	while (firstColor === secondColor) {
		secondColor = rng.pickOne(collarColors);
	}

	const strength = rollModStrength(rng, mod, tier);
	return {
		item: "collar",
		name: `${adjective} ${firstColor}${conjunction}${secondColor} ${collarBaseNames[image / 3]}`,
		unknownRolls: unknownRolls,
		image: `jw_pet${image + 1}`,
		modifiers: [
			{
				mod: mod,
				roll: strength,
			},
		],
		tier: tier,
	};
}

export function getFuturisticShirt(day: number, tier: number): wardrobeItemResult {
	const seed = day * 11391 + 2063;
	const rng = new RNG(seed);
	const shirtModifiers =
		tier > 3
			? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16]
			: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
	rng.shuffle(shirtModifiers);
	const image = rng.roll(0, 8);
	const unknownRolls = [];
	unknownRolls.push(rng.roll(maxRoll));
	const adjective = rng.pickOne(shirtAdjectives);
	const materialRoll = rng.roll(shirtMaterials.length - 1);
	let materialQuality = "";
	if (materialRoll > 11) {
		materialQuality = rng.pickOne(shirtMaterialQualities);
		while (materialQuality === "reroll") {
			materialQuality = rng.pickOne(shirtMaterialQualities);
		}
	}
	const baseName = rng.pickOne(shirtBaseNames);
	const mods: rolledModifier[] = shirtModifiers.slice(0, tier).map((n: number): rolledModifier => {
		return {
			mod: wardrobeShirtModifiers[n],
			roll: rollModStrength(rng, wardrobeShirtModifiers[n], tier),
		};
	});
	return {
		item: "shirt",
		name: `${adjective} ${materialQuality}${shirtMaterials[materialRoll]} ${baseName}`,
		unknownRolls: unknownRolls,
		image: `jw_shirt${image + 1}`,
		modifiers: mods,
		tier: tier,
	};
}

export function getFuturisticHat(day: number, tier: number): wardrobeItemResult {
	const seed = day * 11392 + 2063;
	const rng = new RNG(seed);
	const hatModifiers =
		tier > 3
			? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
			: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
	rng.shuffle(hatModifiers);
	const image = rng.roll(0, 8);
	const unknownRolls = [];

	unknownRolls.push(rng.roll(maxRoll));
	unknownRolls.push(rng.roll(maxRoll));
	unknownRolls.push(rng.roll(maxRoll));

	const adjective = rng.pickOne(hatAdjectives);

	unknownRolls.push(rng.roll(maxRoll));
	const firstMetal = rng.pickOne(hatMetals);
	unknownRolls.push(rng.roll(maxRoll));
	let secondMetal = rng.pickOne(hatMetals);
	while (firstMetal === secondMetal) {
		secondMetal = rng.pickOne(hatMetals);
	}
	const hatBaseModifier = rng.pickOne(hatBaseModifiers);
	const hatBaseName = rng.pickOne(hatBaseNames);

	const mods: rolledModifier[] = hatModifiers.slice(0, tier).map((n: number): rolledModifier => {
		return {
			mod: wardrobeHatModifiers[n],
			roll: rollModStrength(rng, wardrobeHatModifiers[n], tier),
		};
	});
	return {
		item: "hat",
		name: `${adjective} ${firstMetal}-${secondMetal} ${hatBaseModifier}${hatBaseName}`,
		unknownRolls: unknownRolls,
		image: `${image > 7 ? "h" : "j"}w_hat${image + 1}`,
		modifiers: mods,
		tier: tier,
	};
}

export function getWardrobeForDay(day: number): wardrobeItemResults {
	const tier = globalOptions.tier;
	return {
		day: day,
		collar: getFuturisticCollar(day, tier),
		hat: getFuturisticHat(day, tier),
		shirt: getFuturisticShirt(day, tier),
	};
}
