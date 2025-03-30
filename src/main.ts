import { daycount, print, printHtml } from "kolmafia";
import { Args } from "grimoire-kolmafia";
import { globalOptions } from "./config";
import { formatHtml, getWardrobeForDay } from "./generate";
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
		print(`No search criteria defined, printing the next week of wardrobe results`);
		for (let i = daycount() + 1; i < daycount() + 8; i++) {
			printHtml(formatHtml(getWardrobeForDay(i)));
		}
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
	results.forEach((result) => {
		printHtml(formatHtml(result));
	});
	return;
	// print(convertToLocalDate(8086));
	// printHtml(formatHtml(getWardrobeForDay(daycount())));
}
