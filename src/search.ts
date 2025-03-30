import { daycount, print } from "kolmafia";
import { globalOptions } from "./config";
import { getWardrobeForDay, wardrobeItemResults } from "./generate";
import {
	genericModifierToSpecific,
	wardrobeFamEquipModifiers,
	wardrobeItem,
	wardrobeModifier,
} from "./wardrobe";

export type modifierSearchCriteria =
	| {
			modifier: wardrobeModifier;
			generic: boolean;
			min: number;
			hightier?: boolean;
			item?: wardrobeItem;
	  }
	| undefined;

export function formatModifierSearchCriteria(msc: modifierSearchCriteria): string {
	return `<tr><td>${msc?.modifier}</td><td>${msc?.min}</td></tr>`;
}

function wardrobeMatchesSearch(
	collarCriterion: modifierSearchCriteria,
	criteria: modifierSearchCriteria[],
	wardResult: wardrobeItemResults,
	minneeded: number
): boolean {
	// since most people are looking for days with 10-11 weight fam equipment,
	// it's best to just check that first.
	if (collarCriterion !== undefined) {
		const collarMod = wardResult.collar.modifiers[0];
		// roll for a fam equip is always a number, but typescript apparently doesn't figure that out.
		const collarRoll: number = typeof collarMod.roll === "number" ? collarMod.roll : 0;
		if (collarMod.mod === collarCriterion.modifier && collarRoll >= (collarCriterion.min ?? 0)) {
			collarMod.match = true;
			minneeded -= 1;
		} else if (globalOptions.requirefamequip) {
			return false;
		}
	}

	const nonCollarMods = [...wardResult.shirt.modifiers, ...wardResult.hat.modifiers];
	// we could just count the unmatched ones, but I imagine keeping them will be useful
	// for debugging at some point.
	const unmatchedCriteria: modifierSearchCriteria[] = [];
	const matchedCriteria: modifierSearchCriteria[] = [];
	// total number of available modifiers - the minimum that MUST be matched, which
	// has been decremented if we've already matched on the fam equip modifier
	const maxunmatched = nonCollarMods.length - minneeded;

	for (let i = 0; i < criteria.length; i++) {
		const criterion = criteria[i];
		const targetModifiers: wardrobeModifier[] = criterion.generic
			? genericModifierToSpecific[criterion.modifier]
			: [criterion.modifier];
		let matched = false;
		for (let j = 0; j < nonCollarMods.length; j++) {
			if (nonCollarMods[j].match === true) {
				continue;
			}
			if (targetModifiers.includes(nonCollarMods[j].mod)) {
				// TODO: figure out a cleaner way to get the values from the roll union type.
				const roll: number =
					typeof nonCollarMods[j].roll === "number"
						? (nonCollarMods[j].roll as number)
						: (nonCollarMods[j].roll as { min: number; max: number }).max;
				if (roll >= criterion.min) {
					nonCollarMods[j].match = true;
					matchedCriteria.push(criterion);
					matched = true;
					break;
				}
			}
		}
		if (!matched) {
			unmatchedCriteria.push(criterion);
			if (unmatchedCriteria.length > maxunmatched) {
				return false;
			}
		}
	}
	// repeat pass to mark all additional matching modifiers for result printing.
	// can't be done easily above because we don't know whether we have something
	// like "stat, stat, stat". We only need to look at matched criteria, since
	// unmatched criteria will continue to go unmatched.
	for (let i = 0; i < matchedCriteria.length; i++) {
		const criterion = matchedCriteria[i];
		const targetModifiers: wardrobeModifier[] = criterion.generic
			? genericModifierToSpecific[criterion.modifier]
			: [criterion.modifier];
		for (let j = 0; j < nonCollarMods.length; j++) {
			if (nonCollarMods[j].match === true) {
				continue;
			}
			if (targetModifiers.includes(nonCollarMods[j].mod)) {
				nonCollarMods[j].match = true;
			}
		}
	}
	return matchedCriteria.length >= minneeded;
}

export function findWardrobeMatches(): wardrobeItemResults[] {
	const totalModifiers = globalOptions.tier * 2 + 1;
	const minneeded =
		globalOptions.minmatched <= totalModifiers
			? Math.min(globalOptions.minmatched, globalOptions.mods.length)
			: totalModifiers;
	print(`${minneeded}`);
	const endkolday = daycount() + globalOptions.days + 1;
	const matches: wardrobeItemResults[] = [];
	// sort modifier search criteria so generic searches are later in the search
	// list, allowing each result to match the most specific search criteria possible.
	// also order identical searches from highest roll requirement to lowest, so that
	// lower requirements won't mark higher rolls as already taken by a match.
	const criteria = globalOptions.mods.sort((mod1, mod2) => {
		return mod1.generic === mod2.generic ? mod2.min - mod1.min : mod1.generic ? 1 : -1;
	});
	const collarCriteria = criteria.filter(
		(c) => wardrobeFamEquipModifiers.some((m) => m === c.modifier) // can't use includes without modifying the types
	);
	const nonCollarCriteria = criteria.filter(
		(c) => !wardrobeFamEquipModifiers.some((m) => m === c.modifier)
	);
	for (let i = daycount() + 1; i < endkolday; i++) {
		const wardrobeResult = getWardrobeForDay(i);
		if (wardrobeMatchesSearch(collarCriteria[0], nonCollarCriteria, wardrobeResult, minneeded)) {
			const len = matches.push(wardrobeResult);
			if (len === globalOptions.maxresults) {
				break;
			}
		}
	}
	return matches;
}
