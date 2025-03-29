import RNG from "kol-rng";
import { wardrobeModifier } from "./wardrobe";

export type modifierRollInputs = {
	base: number;
	growth: number;
	roll: number;
	rollGrowth: number;
};

export function rollForTier(rng: RNG, tier: number, inputs: modifierRollInputs): number {
	return (
		inputs.base +
		inputs.growth * (tier - 1) +
		rng.mtRand.roll(0, inputs.roll + inputs.rollGrowth * (tier - 1))
	);
}

const familiarDmgRollInputs = {
	base: 15,
	growth: 15,
	roll: 10,
	rollGrowth: 10,
};

const resistanceRollInputs = {
	base: 1,
	growth: 1,
	roll: 2,
	rollGrowth: 0,
};

const baseStatRollInputs = {
	base: 10,
	growth: 10,
	roll: 2,
	rollGrowth: 2,
};

const maxResourceRollInputs = {
	base: 10,
	growth: 20,
	roll: 20,
	rollGrowth: 0,
};

const dmgReductionRollInputs = {
	base: 1,
	growth: 3,
	roll: 4,
	rollGrowth: 0,
};

const dmgAbsorptionRollInputs = {
	base: 10,
	growth: 10,
	roll: 5,
	rollGrowth: 5,
};

const elemDmgRollInputs = {
	base: 4,
	growth: 4,
	roll: 2,
	rollGrowth: 2,
};

const itemDropRollInputs = {
	base: 3,
	growth: 5,
	roll: 5,
	rollGrowth: 0,
};

const meatDropRollInputs = {
	base: 5,
	growth: 10,
	roll: 10,
	rollGrowth: 0,
};

const monsterLevelRollInputs = {
	base: 0,
	growth: 5,
	roll: 10,
	rollGrowth: 0,
};

const hpRegenMinRollInputs = {
	base: 2,
	growth: 2,
	roll: 2,
	rollGrowth: 0,
};

const mpRegenMinRollInputs = {
	base: 3,
	growth: 3,
	roll: 2,
	rollGrowth: 0,
};

const regenMaxRollInputs = {
	base: 5,
	growth: 5,
	roll: 5,
	rollGrowth: 0,
};

export function rollModStrength(
	rng: RNG,
	mod: wardrobeModifier,
	tier: number
): number | { min: number; max: number } {
	if (tier > 5 || tier < 1) {
		throw new Error(`Invalid value for tier ${tier}`);
	}
	let min = 0;
	let max = 0;
	let modifierRollInputs = { base: 0, growth: 0, roll: 0, rollGrowth: 0 };
	switch (mod) {
		case "Muscle":
		case "Mysticality":
		case "Moxie":
			modifierRollInputs = baseStatRollInputs;
			break;
		case "Hot Resistance":
		case "Cold Resistance":
		case "Stench Resistance":
		case "Sleaze Resistance":
		case "Spooky Resistance":
			modifierRollInputs = resistanceRollInputs;
			break;
		case "Maximum MP":
		case "Maximum HP":
			modifierRollInputs = maxResourceRollInputs;
			break;
		case "Damage Reduction":
			modifierRollInputs = dmgReductionRollInputs;
			break;
		case "Damage Absorption":
			modifierRollInputs = dmgAbsorptionRollInputs;
			break;
		case "Hot Damage":
		case "Cold Damage":
		case "Stench Damage":
		case "Sleaze Damage":
		case "Spooky Damage":
		case "Hot Spell Damage":
		case "Cold Spell Damage":
		case "Stench Spell Damage":
		case "Sleaze Spell Damage":
		case "Spooky Spell Damage":
			modifierRollInputs = elemDmgRollInputs;
			break;
		case "Item Drop":
			modifierRollInputs = itemDropRollInputs;
			break;
		case "Meat Drop":
			modifierRollInputs = meatDropRollInputs;
			break;
		case "Monster Level":
			modifierRollInputs = monsterLevelRollInputs;
			break;
		case "HP Regen":
			min = rollForTier(rng, tier, hpRegenMinRollInputs);
			max = rollForTier(rng, tier, regenMaxRollInputs);
			break;
		case "MP Regen":
			min = rollForTier(rng, tier, mpRegenMinRollInputs);
			max = rollForTier(rng, tier, regenMaxRollInputs);
			break;
		case "Familiar Damage":
			modifierRollInputs = familiarDmgRollInputs;
			break;
		case "Familiar Experience":
			// Familiar experience doesn't have any randomness to it.
			return tier;
		case "Familiar Weight":
			// due to being inversely related this one can't use the same approach as the rest
			return tier * 2 + 5 - rng.roll(2);
	}
	if (min !== 0) {
		return { min: min, max: max };
	}
	return rollForTier(rng, tier, modifierRollInputs);
}
