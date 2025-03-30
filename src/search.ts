import { daycount } from "kolmafia";
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
			min?: number;
			hightier?: boolean;
			item?: wardrobeItem;
	  }
	| undefined;

export function formatModifierSearchCriteria(msc: modifierSearchCriteria): string {
	return `<tr><td>${msc?.modifier}</td><td>${msc?.min}</td></tr>`;
}

function wardrobeMatchesSearch(
	famEquipCriterion: modifierSearchCriteria,
	criteria: modifierSearchCriteria[],
	wardResult: wardrobeItemResults,
	minneeded: number
): boolean {
	// printHtml(formatModifierSearchCriteria(famEquipCriterion));
	// since most people are looking for days with 10-11 weight fam equipment,
	// it's best to just check that first.
	if (globalOptions.requirefamequip && famEquipCriterion !== undefined) {
		const collarMod = wardResult.collar.modifiers[0];
		// roll for a fam equip is always a number, but typescript apparently doesn't figure that out.
		const famEquipRoll: number = typeof collarMod.roll === "number" ? collarMod.roll : 0;
		if (
			collarMod.mod !== famEquipCriterion.modifier ||
			famEquipRoll < (famEquipCriterion.min ?? 0)
		) {
			return false;
		} else {
			minneeded -= 1;
		}
	}

	const nonCollarMods = [...wardResult.shirt.modifiers, ...wardResult.hat.modifiers];
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
			if (targetModifiers.some((m) => m === nonCollarMods[j].mod)) {
				nonCollarMods[j].match = true;
				matchedCriteria.push(criterion);
				matched = true;
				break;
			}
		}
		if (!matched) {
			unmatchedCriteria.push(criterion);
			if (unmatchedCriteria.length > maxunmatched) {
				return false;
			}
		}
	}
	return matchedCriteria.length >= minneeded;
}

export function findWardrobeMatches(): wardrobeItemResults[] {
	const totalModifiers = globalOptions.tier * 2 + 1;
	const minneeded =
		globalOptions.minmatched <= totalModifiers ? globalOptions.minmatched : totalModifiers;
	const endkolday = daycount() + globalOptions.days + 1;
	const matches: wardrobeItemResults[] = [];
	// sort modifier search criteria so generic searches are later in the search
	// list, allowing each result to match the most specific search criteria possible.
	const criteria = globalOptions.mods.sort((mod1, mod2) => {
		return mod1.generic === mod2.generic ? 0 : mod1.generic ? 1 : -1;
	});
	const famEquipCriteria = criteria.filter((c) =>
		wardrobeFamEquipModifiers.some((m) => m === c.modifier)
	);
	const nonCollarCriteria = criteria.filter(
		(c) => !wardrobeFamEquipModifiers.some((m) => m === c.modifier)
	);
	for (let i = daycount() + 1; i < endkolday; i++) {
		const wardrobeResult = getWardrobeForDay(i);
		if (
			wardrobeMatchesSearch(famEquipCriteria[0], nonCollarCriteria, wardrobeResult, minneeded)
		) {
			const len = matches.push(wardrobeResult);
			if (len === globalOptions.max) {
				break;
			}
		}
	}
	return matches;
}
