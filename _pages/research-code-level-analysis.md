---
layout: research-story
title: From profiling tools to programmatic analysis
description: Measuring code-level performance and making the resulting data easier to analyze.
topic: Performance analysis
nav_section: /research/
permalink: /research/code-level-performance-analysis/
---

## Choosing what to measure

Profilers connect execution time to functions and calling contexts, but their measurement methods affect both application overhead and the information available for diagnosis.

In my ISC 2022 work, I compared **Caliper, HPCToolkit, TAU, and Score-P** using AMG, LULESH, and Quicksilver. I evaluated runtime overhead, memory use, output size, and the completeness and correctness of call graphs across profiling methods, sampling intervals, and process counts. I also extended Hatchet with readers for Score-P and TAU profiling data, enabling comparisons across the tools.

## Why data quality matters

For the tool versions and configurations tested, profilers could identify similar expensive functions while ranking them differently. Some configurations also produced incomplete calling contexts. Evaluating overhead alongside these differences gives a more useful basis for choosing a profiler than considering collection cost alone.

## Making analysis reusable

My later work on **Chopper** addresses the next step: turning profile data into repeatable analyses. Its high-level Python interface automates common investigations such as load imbalance, hot paths, scaling bottlenecks, and performance variability. This connects my evaluation of measurement tools with my contributions to programmatic performance analysis in Hatchet.

## Papers and software

- [Profiling-tool evaluation · ISC 2022](https://dl.acm.org/doi/10.1007/978-3-031-07312-0_11) · [PDF](https://pssg.cs.umd.edu/assets/papers/2022-05-tool-comparison-isc.pdf) · [Code](https://github.com/hpcgroup/profiling-tools-eval-isc22) · [Citation]({{ '/publications/#cankur2022profiling' | relative_url }})
- [Automated Programmatic Performance Analysis of Parallel Programs · 2024 preprint](https://arxiv.org/abs/2401.13150)
- [Hatchet: software and my contributions]({{ '/software/hatchet/' | relative_url }})
