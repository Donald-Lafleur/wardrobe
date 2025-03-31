import { globalOptions } from "./config";
import { convertToLocalDate } from "./dateconv";
import { rolledModifier, wardrobeItemResults } from "./generate";
import { getModStrengthRange } from "./roll";
import { wardrobeHatModifiers, wardrobeShirtModifiers } from "./wardrobe";

function formatRoll(roll: number | { min: number; max: number } | undefined): string {
	if (roll === undefined) {
		return "N/A";
	}
	if (typeof roll === "number") {
		return roll.toString();
	}
	return `${roll?.min}-${roll?.max}`;
}

function formatModifier(modroll: rolledModifier): string {
	const matchColor = globalOptions.matchcolor;
	const roll =
		typeof modroll.roll === "number"
			? `${modroll.roll}`
			: `${modroll.roll.min}-${modroll.roll.max}`;
	const range = globalOptions.showrange ? ` (${formatRoll(getModStrengthRange(modroll.mod))})` : "";
	// TODO: option to include range in parens is there's room
	const modString = `${modroll.mod}: ${roll}${range}`;
	// return modroll.match ? `<b>${modString}</b>` : modString;
	return modroll.match ? `<font color="${matchColor}">${modString}</font>` : modString;
}

export function formatMatchesTableHtml(matches: wardrobeItemResults[]): string {
	const tier = globalOptions.tier;
	const htmlTableRows = [];
	htmlTableRows.push(
		`<table border="1"><tr><th>Date</th><th>Collar</th><th colspan="${tier}">Shirt</th><th colspan="${tier}">Hat</th></tr>`
	);
	for (let i = 0; i < matches.length; i++) {
		htmlTableRows.push(formatHtmlTableRow(matches[i]));
	}
	return `${htmlTableRows.join("")}</table>`
		.replace(/Damage Absorption/g, "DA")
		.replace(/Damage Reduction/g, "DR")
		.replace(/Monster Level/g, "ML")
		.replace(/Maximum/g, "Max")
		.replace(/Damage/g, "Dmg")
		.replace(/Resistance/g, "Res")
		.replace(/Familiar/, "Fam")
		.replace(/Experience/, "Exp");
}

const hatMods = wardrobeHatModifiers.map((m) => m.toString());
const shirtMods = wardrobeShirtModifiers.map((m) => m.toString());

function sortHatModifiers(mod1: rolledModifier, mod2: rolledModifier): number {
	return hatMods.indexOf(mod1.mod.toString()) - hatMods.indexOf(mod2.mod.toString());
}

function sortShirtModifiers(mod1: rolledModifier, mod2: rolledModifier): number {
	return shirtMods.indexOf(mod1.mod.toString()) - shirtMods.indexOf(mod2.mod.toString());
}

function formatHtmlTableRow(ward: wardrobeItemResults): string {
	const mods = [
		...ward.collar.modifiers,
		...ward.hat.modifiers.sort(sortHatModifiers),
		...ward.shirt.modifiers.sort(sortShirtModifiers),
	]
		.map((mod) => `<td>${formatModifier(mod)}</td>`)
		.join("");
	return `<tr><td>${convertToLocalDate(ward.day, "yyyy-MM-dd")}</td>${mods}</tr>`;
}

export function formatHtml(ward: wardrobeItemResults): string {
	const tier = globalOptions.tier;
	const htmlTableRows = [];
	htmlTableRows.push(
		`<table border="1"><thead><th>Item</th><th>Modifier</th><th>Roll</th></thead>`
	);

	if (ward.collar !== undefined) {
		htmlTableRows.push(
			`<tr><td>Collar</td><td>${ward.collar?.modifiers[0].mod}</td><td>${ward.collar?.modifiers[0].roll}</td></tr>`
		);
	}
	if (ward.hat !== undefined) {
		const hatmods = ward.hat?.modifiers;
		for (let i = 0; i < globalOptions.tier; i++) {
			htmlTableRows.push(
				`<tr>${i === 0 ? `<td rowspan="${tier}">Hat</td>` : ""}<td>${
					hatmods[i].mod
				}</td><td>${formatRoll(hatmods[i].roll)}</td></tr>`
			);
		}
	}
	if (ward.shirt !== undefined) {
		const shirtmods = ward.shirt?.modifiers;
		for (let i = 0; i < globalOptions.tier; i++) {
			htmlTableRows.push(
				`<tr>${i === 0 ? `<td rowspan="${tier}">Shirt</td>` : ""}<td>${
					shirtmods[i].mod
				}</td><td>${formatRoll(shirtmods[i].roll)}</td></tr>`
			);
		}
	}
	htmlTableRows.push(`</table>`);
	return htmlTableRows.join("");
}
