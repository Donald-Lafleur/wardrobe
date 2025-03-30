import { daycount, print, printHtml } from "kolmafia";
import { Args } from "grimoire-kolmafia";
import { globalOptions } from "./config";
import { getWardrobeForDay } from "./generate";
import { formatHtml, formatMatchesTableHtml } from "./results";
import { findWardrobeMatches, formatModifierSearchCriteria } from "./search";
import { possibleRollsTable } from "./wardrobe";
import { convertToLocalDate, dateToKoLDaycount } from "./dateconv";

export function main(args = ""): void {
	Args.fill(globalOptions, args);
	if (globalOptions.help) {
		Args.showHelp(globalOptions);
		return;
	}

	if (globalOptions.rolls) {
		printHtml(possibleRollsTable);
		return;
	}

	if (globalOptions.kolday !== undefined) {
		print(convertToLocalDate(globalOptions.kolday));
		printHtml(formatHtml(getWardrobeForDay(globalOptions.kolday)));
		return;
	}

	if (globalOptions.enddate !== undefined) {
		globalOptions.days = dateToKoLDaycount(globalOptions.enddate) - daycount();
	}

	const searchCriteria = globalOptions.mods?.map((modSearch) => {
		return formatModifierSearchCriteria(modSearch);
	});

	if (searchCriteria !== undefined) {
		print(`Searching for wardrobes using the following search criteria\n`);
		printHtml(
			`<table border="1"><tr><th>Modifier</th><th>Min Roll</th></tr>${searchCriteria?.join(
				""
			)}</table>`
		);
	} else {
		print(
			`No search modifier search criteria provided, printing the next week of wardrobe results\n`
		);
		const wardrobes = [];
		for (let i = daycount() + 1; i < daycount() + 8; i++) {
			wardrobes.push(getWardrobeForDay(i));
		}
		printHtml(formatMatchesTableHtml(wardrobes));
		return;
	}

	if (globalOptions.minmatched === undefined) {
		globalOptions.minmatched = searchCriteria.length;
	}

	const results = findWardrobeMatches();
	if (results.length === 0) {
		print(`No matching wardrobe results found`);
		return;
	}

	// results.forEach((result) => {
	// 	printHtml(formatHtml(result));
	// });
	printHtml(formatMatchesTableHtml(results));
	return;
}
