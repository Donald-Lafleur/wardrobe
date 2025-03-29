import { Args, ParseError } from "grimoire-kolmafia";
import { wardrobeHighTierModifiers, wardrobeItem, wardrobeModifier } from "./wardrobe";

type modifierSearchCriteria =
	| {
			modifier: wardrobeModifier;
			min?: number;
			hightier?: boolean;
			item?: wardrobeItem;
	  }
	| undefined;

export function formatModifierSearchCriteria(msc: modifierSearchCriteria): string {
	return `<tr><td>${msc?.modifier}</td><td>${msc?.min}</td></tr>`;
}

type modifierAliases = {
	modifier: wardrobeModifier;
	aliases: string[];
};

const modifiersWithAliases: modifierAliases[] = [
	{ modifier: "Familiar Weight", aliases: ["famwt"] },
	{ modifier: "Familiar Damage", aliases: ["fam dmg"] },
	{ modifier: "Familiar Experience", aliases: ["famxp"] },
	{ modifier: "Muscle", aliases: [] },
	{ modifier: "Moxie", aliases: [] },
	{ modifier: "Mysticality", aliases: ["myst"] },
	{ modifier: "Hot Resistance", aliases: ["hot resist"] },
	{ modifier: "Cold Resistance", aliases: ["cold resist"] },
	{ modifier: "Sleaze Resistance", aliases: ["sleaze resist"] },
	{ modifier: "Stench Resistance", aliases: ["stench resist"] },
	{ modifier: "Spooky Resistance", aliases: ["spooky resist"] },
	{ modifier: "Maximum HP", aliases: ["hp"] },
	{ modifier: "Maximum MP", aliases: ["mp"] },
	{ modifier: "HP Regen", aliases: [] },
	{ modifier: "MP Regen", aliases: [] },
	{ modifier: "Damage Absorption", aliases: ["da"] },
	{ modifier: "Damage Reduction", aliases: ["dr"] },
	{ modifier: "Item Drop", aliases: ["item"] },
	{ modifier: "Meat Drop", aliases: ["meat"] },
	{ modifier: "Monster Level", aliases: ["ml"] },
	{ modifier: "Hot Damage", aliases: [] },
	{ modifier: "Sleaze Damage", aliases: [] },
	{ modifier: "Cold Damage", aliases: [] },
	{ modifier: "Stench Damage", aliases: [] },
	{ modifier: "Spooky Damage", aliases: [] },
	{ modifier: "Hot Spell Damage", aliases: ["hot spell"] },
	{ modifier: "Sleaze Spell Damage", aliases: ["sleaze spell"] },
	{ modifier: "Cold Spell Damage", aliases: ["cold spell"] },
	{ modifier: "Stench Spell Damage", aliases: ["stench spell"] },
	{ modifier: "Spooky Spell Damage", aliases: ["spooky spell"] },
	{ modifier: "Stat", aliases: [] },
	{ modifier: "Resistance", aliases: ["res"] },
	{ modifier: "Elemental Damage", aliases: ["elemental", "elem dmg"] },
	{ modifier: "Elemental Spell Damage", aliases: ["spell damage", "spell dmg"] },
];

// Returns a string that is the lowercase concatenation of the beginning
// of each word in the input string up to at most the 3rd letter of each word.
function toPrefixes(mod: string): string {
	return mod
		.split(" ")
		.map((w) => w.substring(0, Math.min(w.length, 3)))
		.join("")
		.toLowerCase();
}

// Generic aliases are: spaces removed, dmg instead of damage,
// per-word-prefixs (hp regen -> hpreg, sleaze spell damage -> slespedam),
// the last 2 combined (sleaze spell damage -> slespedmg)
function genericAliases(mod: wardrobeModifier): string[] {
	return [
		mod.replace(" ", ""),
		toPrefixes(mod),
		mod.replace("damage", "dmg"),
		toPrefixes(mod.replace("damage", "dmg")),
	].reduce((prev: string[], mod) => (prev.some((m) => m === mod) ? prev : [...prev, mod]), []);
}

const allModifierAliases = [
	...modifiersWithAliases.map(({ modifier, aliases }) => {
		return { modifier: modifier, aliases: [...aliases, ...genericAliases(modifier)] };
	}),
];

function parseModifierSearchString(
	modSearchString: string
): modifierSearchCriteria[] | ParseError | undefined {
	const mods = modSearchString.split(", ");
	const parseErrors: ParseError[] = [];
	const searchCriteria: (modifierSearchCriteria | undefined)[] = mods.map((modstring: string) => {
		const modRoll = modstring.trim().match(/\d+$/);
		const min = modRoll === null ? 0 : parseInt(modRoll[0]);
		const mod = modstring.replace(/\d+$/, "").trim().toLowerCase();
		const modMatches = allModifierAliases.filter(
			({ modifier, aliases }) =>
				modifier.toLowerCase() === mod ||
				aliases.some((alias: string) => alias === mod) || // aliases before lowercase-includes to catch "res" as allres option
				modifier.toLowerCase().includes(mod) ||
				toPrefixes(modifier) === toPrefixes(mod)
		);
		if (modMatches.length > 1) {
			parseErrors.push(
				new ParseError(
					`Multiple different modifiers matched for ${modstring}:\n${modMatches
						.map((m) => m.modifier)
						.join(", ")}`
				)
			);
			return;
		}
		if (modMatches.length === 0) {
			parseErrors.push(new ParseError(`No modifier matched for search: ${modstring}`));
			return;
		}
		const matchedModifier = modMatches[0].modifier;
		return {
			modifier: matchedModifier,
			min: min,
			hightier: matchedModifier in wardrobeHighTierModifiers,
		};
	});
	const validSearchCriteria: modifierSearchCriteria[] = searchCriteria.filter(
		(p) => p !== undefined
	);
	return parseErrors.length === 0 ? validSearchCriteria : parseErrors[0];
}

export const globalOptions = Args.create(
	"wardrobe",
	"Search for days when wardrobe-o-matic's futuristic items will have specific modifiers when opened above a specific level.",
	{
		rolls: Args.flag({
			help: "Print the table of possible rolls for each modifier at each tier organized by item it appears on and stop.",
			default: false,
		}),
		max: Args.number({
			help: "Maxmimum number of succesful search results to print out",
			default: 10,
			setting: "wardrobe_maxResults",
		}),
		days: Args.number({
			help: "The maximum number of days into the future to look",
			default: 365,
			hidden: true, // not implemented yet
		}),
		mods: Args.custom<modifierSearchCriteria[]>(
			{
				help: "Comma separated list of modifiers to search for along with optional colon separated minimum values all wrapped in quotation marks, e.g. \"fam weight:10, sleaze damage:15, moxie:30, hot res\". Use 'stat', 'resistance', 'elemental damage', or 'elemental spell damage' to match any element or stat, e.g., \"familiar weight 10, stat 30, res\". Run 'wardrobe ranges' to see the possible values for each modifier at each tier.",
			},
			parseModifierSearchString,
			"string"
		),
		tier: Args.number({
			help: "The tier of wardrobe items to search within. This corresponds to the level at which you plan to use the wardrobe-o-matic.",
			options: [
				[1, "Opened from level 1-4"],
				[2, "Opened from level 5-9"],
				[3, "Opened from level 10-14"],
				[4, "Opened from level 15-19"],
				[5, "Opened from level 20+"],
			],
			setting: "wardrobe_defaultTier",
			default: 3,
		}),
		minmatched: Args.number({
			help: "Number of modifiers from the search string to require be present before a result is considered a match. Allows searching for more modifiers than can be present on the items. If not specified, all modifiers are required to be present (unless that would be impossible, in which case once every modifier slot that could match does the result is considered a match)",
			hidden: true, // not implemented yet
		}),
		requirefamequip: Args.boolean({
			help: "Require that any familiar equipment modifier specified be present on all matches.",
			default: true,
			hidden: true, // not implemented yet
		}),
	}
);
