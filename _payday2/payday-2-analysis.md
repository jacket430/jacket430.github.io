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

