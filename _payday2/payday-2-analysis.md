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

### Base Armor Values
On PC, each player has a base armor value of **2**. Players on the console version have a base value of **5**. For the purposes of this guide, I will only be referring to the PC values, unless noted.

Wearing armor adds a bonus to the base value, and impacts a variety of other stats:

| Armor | Bonus | Max | Ammo Pickup | Speed | Conceal. | Dodge | Steadiness | Stamina
| TPS | 0 | 2 | 1.0x | 1.05x | 30 | +5% | 1.0x | 1.025x |
| LBV | +3 | 5 | 1.02x | 1.025x | 26 | -5% | 0.96x | 1.0x |
| BV | +4 | 6 | 1.04x | 1.0x | 23 | -10% | 0.92x | 0.95x |
| HBV | +5 | 7 | 1.06x | 0.95x | 21 | -15% | 0.85x | 0.9 |
| FJ | +7 | 9 | 1.8x | 0.75x | 18 | -20% | 0.8x | 0.85x |
| CTV | +11 | 13 | 1.1x | 0.65x | 12 | -25% | 0.7x | 0.8x |
| ICTV | +15 | 17 | 1.12x | 0.575x | 1 | -55% | 0.5x | 0.7x |

### Max Armor Calculation
Max Armor is the sum of your base armor + armor type bonus + skill/perk bonuses x total armor multiplier.

> **Max Armor = (Base Armor + Armor Bonus + Flat Bonuses) x Armor Multiplier**

#### Components
**Base Armor**: 2

**Armor Bonus**: Associated armor's bonus stat (listed above).

**Flat Bonuses**:
- **Die Hard Aced**: +2 armor while wearing any "Ballistic Vest"
- **Anarchist (Tiers 3/5/7)**: Adds 1x/1.1x/1.2x of your total *reduced* health as a flat armor bonus.
- **Crew Chief**: 1.1x if you have Crew Chief equipped, 1.05x if a teammate has Crew Chief equipped.
