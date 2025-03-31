# WARDROBE

Wardrobe-o-matic script built using Captain Scotch's [kol-ts-starter](https://github.com/docrostov/kol-ts-starter).

## Setup

To install the script, use the following command in the KoLMafia CLI.

```text
git checkout Donald-Lafleur/wardrobe.git release
```

## Usage

For basic searching just provide the modifier you want and optionally the minimum value for that modifier.

```text
wardrobe mods "familiar weight 10"
```

Multiple search criteria should be comma separated, and can include names for groups of modifiers using "resistance", "stat", "elemental damage", and "elemental spell damage".

```text
wardrobe mods "fam weight 10, stat, elem spell dmg, elem dmg"
```

You can also specify more search criteria then you want to require be matched, if you want to search for results that have any combination of a set of desired modifiers. The `minmatched` argument specifies how many of the criteria need to be matched. By default, if a familiar equipment modifier is in the search criteria it is required to be matched. Currently using more than one familiar modifier search criteria is not supported.

```text
wardrobe mods "famwt 10, stat, elem spell dmg, sleaze res, hp regen" minmatched 3
```

Fuzzy matching is used to determine which modifiers to look for. At least anything that the maximizer in KoLmafia accepts should work, e.g., damage can be written dmg, Monster Level can be ml, etc., as well as a lot of things that the maximizer would reject such as sle spe dam for Sleaze Spell Damage.

So long as the modifier to search for can be uniquely matched it should work fine, with the exception that first letter abbreviations, e.g., DA, DR, ML, can only be used for modifiers that KoLmafia has abbreviations for, since there are too many duplicates to work around otherwise (three of the elements start with S). HP and MP are accepted for Maximum HP and Maximum MP.

```text
wardrobe mods "famexp, mox, myst, sle res, ste res, ml, da, dr" minmatched 2 tier 5
```
