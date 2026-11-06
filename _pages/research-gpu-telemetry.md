---
layout: research-story
title: Production GPU workloads through system telemetry
description: Understanding resource use and energy consumption across a production supercomputer.
topic: Operational data analytics
nav_section: /research/
permalink: /research/gpu-workload-telemetry/
---

## Looking beyond resource allocations

How do production jobs use the GPUs they request? Allocation records alone cannot explain compute activity, memory use, or differences between GPUs within a job.

I studied these questions using system-wide telemetry from **75,703 GPU jobs on NERSC’s Perlmutter**, collected between March 1 and April 1, 2025. Our analysis connects GPU hardware counters sampled every ten seconds with Slurm job metadata to examine utilization, workload characteristics, imbalance, and energy consumption.

## What the measurements reveal

Using the study’s criterion, **81% of jobs in this one-month dataset were memory-bound**, meaning that memory bandwidth limited their performance. At comparable GPU-hours, memory-bound jobs also tended to consume more energy than compute-bound jobs.

The study shows how telemetry can reveal differences hidden by allocation totals. That evidence can inform application optimization, resource sizing, capacity planning, and other operational decisions.

## Paper and artifacts

- [Published paper · IPDPS 2026](https://ieeexplore.ieee.org/abstract/document/11575343) · [PDF](https://pssg.cs.umd.edu/assets/papers/2026-05-ldms-ipdps.pdf) · [Citation]({{ '/publications/#cankur2026telemetry' | relative_url }})
- [Analysis code](https://github.com/hpcgroup/ldms-analysis-scripts-ipdps26) — notebooks for the paper’s figures; the underlying telemetry dataset has restricted access.
- [SC 2025 poster](https://pssg.cs.umd.edu/assets/posters/2025-11-ldms-sc.pdf)
