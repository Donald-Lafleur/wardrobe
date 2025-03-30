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
