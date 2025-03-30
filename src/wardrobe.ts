export type wardrobeItem = "shirt" | "hat" | "collar";
export const statModifiers = ["Muscle", "Mysticality", "Moxie"] as const;
export type statModifier = typeof statModifiers[number];
export const elementalDamageModifiers = [
	"Hot Damage",
	"Cold Damage",
	"Stench Damage",
	"Sleaze Damage",
	"Spooky Damage",
] as const;
export type elementalDamageModifier = typeof elementalDamageModifiers[number];
export const elementalSpellDamageModifiers = [
	"Hot Spell Damage",
	"Cold Spell Damage",
	"Stench Spell Damage",
	"Sleaze Spell Damage",
	"Spooky Spell Damage",
] as const;
export type elementalSpellDamageModifier = typeof elementalSpellDamageModifiers[number];
export const resistanceModifiers = [
	"Hot Resistance",
	"Cold Resistance",
	"Stench Resistance",
	"Sleaze Resistance",
	"Spooky Resistance",
] as const;
export type resistanceModifier = typeof resistanceModifiers[number];

export const wardrobeHatModifiers = [
	// "Muscle",
	// "Mysticality",
	// "Moxie",
	...statModifiers,
	"Maximum HP",
	"Maximum MP",
	"HP Regen",
	"MP Regen",
	// "Hot Damage",
	// "Cold Damage",
	// "Stench Damage",
	// "Sleaze Damage",
	// "Spooky Damage",
	...elementalDamageModifiers,
	// "Hot Spell Damage",
	// "Cold Spell Damage",
	// "Stench Spell Damage",
	// "Sleaze Spell Damage",
	// "Spooky Spell Damage",
	...elementalSpellDamageModifiers,
	"Item Drop",
	"Meat Drop",
	"Monster Level",
] as const;
export type wardrobeHatModifier = typeof wardrobeHatModifiers[number];
export const wardrobeShirtModifiers = [
	// "Muscle",
	// "Mysticality",
	// "Moxie",
	...statModifiers,
	// "Hot Resistance",
	// "Cold Resistance",
	// "Stench Resistance",
	// "Sleaze Resistance",
	// "Spooky Resistance",
	...resistanceModifiers,
	"Maximum HP",
	"Maximum MP",
	"HP Regen",
	"MP Regen",
	"Damage Reduction",
	"Damage Absorption",
	"Item Drop",
	"Meat Drop",
	"Monster Level",
] as const;
export type wardrobeShirtModifier = typeof wardrobeShirtModifiers[number];

export const wardrobeFamEquipModifiers = [
	"Familiar Weight",
	"Familiar Damage",
	"Familiar Experience",
] as const;
export type wardrobeFamEquipModifier = typeof wardrobeFamEquipModifiers[number];

export const genericModifiers = [
	"Stat",
	"Resistance",
	"Elemental Damage",
	"Elemental Spell Damage",
] as const;
export type genericModifier = typeof genericModifiers[number];

export const genericModifierToSpecific = {
	Stat: statModifiers,
	Resistance: resistanceModifiers,
	"Elemental Damage": elementalDamageModifiers,
	"Elemental Spell Damage": elementalSpellDamageModifiers,
};

export type wardrobeModifier =
	| wardrobeShirtModifier
	| wardrobeHatModifier
	| wardrobeFamEquipModifier
	| genericModifier;

export const wardrobeHighTierModifiers = [
	"Familiar Experience",
	"Item Drop",
	"Meat Drop",
	"Monster Level",
] as const;
export type wardrobeHighTierModifier = typeof wardrobeHighTierModifiers[number];

export const collarBaseNames = ["pet tag", "collar", "pet sweater"];
export const collarAdjectives = [
	"hyperchromatic",
	"pearlescent",
	"bright",
	"day-glo",
	"luminescent",
	"vibrant",
	"earthy",
	"oversaturated",
	"partially transparent",
	"opaque",
	"faded",
	"metallic",
	"shiny",
	"glow-in-the-dark",
	"neon",
	"prismatic",
	"incandescent",
	"polychromatic",
	"opalescent",
	"psychedelic",
	"kaleidoscopic",
];
export const shirtAdjectives = [
	"galvanized",
	"double-creased",
	"double-breasted",
	"foil-clad",
	"aluminum-threaded",
	"electroplated",
	"carbon-coated",
	"phase-changing",
	"liquid cooled",
	"conductive",
	"radation-shielded",
	"nanotube-threaded",
	"moisture-wicking",
	"shape-memory",
	"antimicrobial",
	"liquid-cooled",
];

export const shirtMaterials = [
	"gabardine",
	"mylar",
	"polyester",
	"double-polyester",
	"triple-polyester",
	"rayon",
	"wax paper",
	"aluminum foil",
	"synthetic silk",
	"xylon",
	"gore-tex",
	"kapton",
	"flannel",
	"silk",
	"cotton",
	"wool",
	"linen",
];

export const shirtMaterialQualities = ["super", "ultra", "mega", "hyper"];

export const shirtBaseNames = [
	"jersey",
	"Neo-Hawaiian shirt",
	"t-shirt",
	"dress shirt",
	"sweater",
	"sweatshirt",
];

export const hatAdjectives = [
	"nanoplated",
	"self-replicating",
	"autonomous",
	"fusion-powered",
	"fision-powered",
	"hyperefficient",
	"quantum",
	"nuclear",
	"magnetic",
	"laser-guided",
	"solar-powered",
	"psionic",
	"gravitronic",
	"biotronic",
	"neurolinked",
	"transforming",
	"meta-fashionable",
];

export const possibleRollsTable = `<table border="1" style="width:60%; align:center; text-align:center"><tr><th>Item</th><th>Modifier</th><th>T1</th><th>T2</th><th>T3</th><th>T4</th><th>T5</th></tr>
<tr><td>Shirt</td><td>Hot Resistance</td><td>1-3</td><td>2-4</td><td>3-5</td><td>4-6</td><td>5-7</td></tr>
<tr><td>Shirt</td><td>Cold Resistance</td><td>1-3</td><td>2-4</td><td>3-5</td><td>4-6</td><td>5-7</td></tr>
<tr><td>Shirt</td><td>Spooky Resistance</td><td>1-3</td><td>2-4</td><td>3-5</td><td>4-6</td><td>5-7</td></tr>
<tr><td>Shirt</td><td>Sleaze Resistance</td><td>1-3</td><td>2-4</td><td>3-5</td><td>4-6</td><td>5-7</td></tr>
<tr><td>Shirt</td><td>Stench Resistance</td><td>1-3</td><td>2-4</td><td>3-5</td><td>4-6</td><td>5-7</td></tr>
<tr><td>Shirt</td><td>Damage Reduction</td><td>1-5</td><td>4-8</td><td>7-11</td><td>10-14</td><td>13-17</td></tr>
<tr><td>Shirt</td><td>Damage Absorption</td><td>10-15</td><td>20-30</td><td>30-45</td><td>40-60</td><td>50-75</td></tr>
<tr><td>Hat</td><td>Hot Damage</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Cold Damage</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Spooky Damage</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Sleaze Damage</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Stench Damage</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Damage to Hot Spells</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Damage to Cold Spells</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Damage to Spooky Spells</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Damage to Sleaze Spells</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat</td><td>Damage to Stench Spells</td><td>4-6</td><td>8-12</td><td>12-18</td><td>16-24</td><td>20-30</td></tr>
<tr><td>Hat, Shirt</td><td>Muscle</td><td>10-12</td><td>20-24</td><td>30-36</td><td>40-48</td><td>50-60</td></tr>
<tr><td>Hat, Shirt</td><td>Mysticality</td><td>10-12</td><td>20-24</td><td>30-36</td><td>40-48</td><td>50-60</td></tr>
<tr><td>Hat, Shirt</td><td>Moxie</td><td>10-12</td><td>20-24</td><td>30-36</td><td>40-48</td><td>50-60</td></tr>
<tr><td>Hat, Shirt</td><td>Maximum HP</td><td>10-30</td><td>30-50</td><td>50-70</td><td>70-90</td><td>90-110</td></tr>
<tr><td>Hat, Shirt</td><td>Maximum MP</td><td>10-30</td><td>30-50</td><td>50-70</td><td>70-90</td><td>90-110</td></tr>
<tr><td>Hat, Shirt</td><td>Item Drop</td><td></td><td></td><td></td><td>18-23</td><td>23-28</td></tr>
<tr><td>Hat, Shirt</td><td>Meat Drop</td><td></td><td></td><td></td><td>35-45</td><td>45-55</td></tr>
<tr><td>Hat, Shirt</td><td>Monster Level</td><td></td><td></td><td></td><td>15-25</td><td>20-30</td></tr>
<tr><td>Hat, Shirt</td><td>HP Regen min</td><td>2-4</td><td>4-6</td><td>6-8</td><td>8-10</td><td>10-12</td></tr>
<tr><td>Hat, Shirt</td><td>HP Regen max</td><td>5-10</td><td>10-15</td><td>15-20</td><td>20-25</td><td>25-30</td></tr>
<tr><td>Hat, Shirt</td><td>MP Regen min</td><td>3-5</td><td>6-8</td><td>9-11</td><td>12-14</td><td>15-17</td></tr>
<tr><td>Hat, Shirt</td><td>MP Regen max</td><td>5-10</td><td>10-15</td><td>15-20</td><td>20-25</td><td>25-30</td></tr>
<tr><td>Fam Equip</td><td>Familiar Weight</td><td>5-7</td><td>7-9</td><td>9-11</td><td>11-13</td><td>13-15</td></tr>
<tr><td>Fam Equip</td><td>Familiar Damage</td><td>15-25</td><td>30-50</td><td>45-75</td><td>60-100</td><td>75-125</td></tr>
<tr><td>Fam Equip</td><td>Familiar Experience</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td></tr></table>`;
