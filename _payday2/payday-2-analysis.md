---
title: Payday 2 Analysis
description: An in-depth technical analysis of various aspects of Payday 3.
date: 2026-06-06T23:31:15.497Z
preview: ""
tags: []
categories: []
author: Jacket430
category:
    - Payday 2
layout: post
mermaid: false
lastmod: 2026-06-06T23:34:01.252Z
slug: payday-2-analysis
---
It has been many long years since "The Long Guide" has been updated. Since Payday 2 has changed so much during that time, much of the information found in that guide is now incorrect. The purpose of this guide is to provide a modern, in-depth, and technically accurate analysis of Payday 2's systems. 

Some of these systems may seem self-explanatory, but they all have underlying mechanics that are not immediately apparent. This guide will delve into the math and mechanics behind these systems to provide a comprehensive understanding of how they work, for the mentally-ill masochists out there.

All information in this analysis comes straight from the game's decompiled LUA code to ensure accuracy, as the wiki is often a poor source of information. No external resources have been used in the creation of this analysis; everything comes straight from the game's code.

Any corrections, suggestions, or other feedback can be sent as pull requests to the project's [GitHub repository](https://github.com/jacket430/jacket430.github.io).

Thanks for reading!

\- Avery (Jacket430)

---

## Armor
Armor is a secondary health bar, a protective shield that sits *on top* of your health. It is *not* damage reduction, damage resistance, or a percentage. It's a pool of hit points that enemies have to break through before they can damage your health (with exceptions, we'll get to it...)

**A note on terminology**:
- "Skills" refers to abilities from the **skill tree**
- "Perks" refers to abilities from **perk decks**

---

### Base Stats

| Stat | Value | Notes |
| Base Armor | 2 | Every player starts with this much armor. |
| Base Health | 23 | Every player starts with this much health. |
| Armor Regen Delay | 3s | The time it takes for armor to begin regenerating after taking damage, uninterrupted by suppression or taking new damage. |
| Armor Regen Delay (Solo) | 1.75s | Faster recharge when playing solo. |
| Dodge Chance | 0% | Base chance to avoid incoming bullets.

> **Note**: Other values exist internally, (`ARMOR_STEPS = 1`, `ARMOR_DAMAGE_REDUCTION = 0`, and `ARMOR_DAMAGE_REDUCTION_STEPS` with the values `{1, 0.6, 0.7, 0.8, 0.9, 0.95, 0.97, 0.98, 0.99}`). However, since the game is hard-coded to return a "0" for `ARMOR_DAMAGE_REDUCTION` and return a "1" for `ARMOR_STEPS`, these values are never used. Seems to be leftover code.

---

### Armor Types
- **Base Armor**: 2 (5 on console) - The base value of armor that all players start with, before any bonuses from armor type, skills, or perks.
- **Armor Rating** (bonus armor granted by armor type) - A flat bonus to armor that is added to the base value, before any bonuses from skills or perks.

| Armor Type | Armor Rating |
|---|---|
| Two-Piece Suit | 0 |
| Lightweight Ballistic Vest | 3 |
| Ballistic Vest | 4 |
| Heavy Ballistic Vest | 5 |
| Flak Jacket | 7 |
| Combined Tactical Vest | 11 |
| Improved Combined Tactical Vest | 15 |

#### Additional stats per armor level:

Max Ammo Multiplier:
> Multiplies the total max ammo the player can hold at a given time.

| Armor Type | Max Ammo Multiplier | Notes |
|---|---|---|
| Two-Piece Suit | 1x | Base level max ammo capacity.
| Lightweight Ballistic Vest | 1.02x | 2% bonus ammo capacity.
| Ballistic Vest | 1.04x | 4% bonus ammo capacity.
| Heavy Ballistic Vest | 1.06x | 6% bonus ammo capacity.
| Flak Jacket | 1.8x | 80% bonus max ammo capacity (!!!)
| Combined Tactical Vest | 1.10x | 10% bonus max ammo capacity.
| Improved Combined Tactical Vest | 1.12x | 12% bonus max ammo capacity.

Ex-President Health Storage Cap (flat value, then multiplied by 1.5x.):
> When you kill enemies while armor > 0, you store health up to this cap. When armor breaks, the stored health is converted to armor regen. Keep in mind values are displayed x10 in game.

| Armor Type | Storage Cap (flat value) | Max Stored Health |
|---|---|---|
| Two-Piece Suit | 14 | 21 |
| Lightweight Ballistic Vest | 13.5 | 20.25 |
| Ballistic Vest | 12.5 | 18.75 |
| Heavy Ballistic Vest | 12 | 18 |
| Flak Jacket | 10.5 | 15.75 |
| Combined Tactical Vest | 9.5 | 14.25 |
| Improved Combined Tactical Vest | 4 | 6 |

Ex-President Armor Regen Rate:

> How fast armor regenerates after breaking (flat value, then multiplied by 1.4x). Base armor regen rate is = 1x (this would be equal to 3s, or 1.75s when playing solo) and resets to 0 when armor is full. The armor rate bonus from kills only applies during the regen window (after armor breaks, before it fills). 19.6 flat + 1x base regen = 20.6x increase.

| Armor Type | Armor Regen Rate (flat value) | Added Regen Per Kill |
|---|---|---|
| Two-Piece Suit | 14 | 19.6 |
| Lightweight Ballistic Vest | 13.5 | 18.9 |
| Ballistic Vest | 12.5 | 17.5 |
| Heavy Ballistic Vest | 12 | 16.8 |
| Flak Jacket | 10.5 | 14.7 |
| Combined Tactical Vest | 9.5 | 13.3 |
| Improved Combined Tactical Vest | 4 | 5.6 |