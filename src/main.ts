import { daycount, printHtml } from "kolmafia";
import { Args } from "grimoire-kolmafia";
import { formatModifierSearchCriteria, globalOptions } from "./config";
import { formatHtml, getWardrobeForDay } from "./generate";
import { possibleRollsTable } from "./wardrobe";

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
		printHtml(formatHtml(getWardrobeForDay(globalOptions.kolday)));
		return;
	}

	const searchCriteria = globalOptions.mods?.map((modSearch) => {
		return formatModifierSearchCriteria(modSearch);
	});
	if (searchCriteria !== undefined) {
		printHtml(
			`<table border="1"><tr><th>Modifier</th><th>Min Roll</th></tr>${searchCriteria?.join(
				""
			)}</table>`
		);
	}
	printHtml(formatHtml(getWardrobeForDay(daycount())));
}
