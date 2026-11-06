---
layout: page
title: Publications
description: Papers on system telemetry, GPU workloads, and programmatic performance analysis.
permalink: /publications/
---

<p class="page-intro">My publications and preprints are listed below. You can also find my work on <a href="{{ site.data.profile.scholar_url }}">Google Scholar</a> or <a href="https://orcid.org/{{ site.data.profile.orcid }}">ORCID</a>.</p>

<div class="publication-tools" data-publication-tools hidden>
  <div class="publication-search-row">
    <div>
      <label class="search-label" for="publication-search">Search publications</label>
      <input type="search" id="publication-search" placeholder="Search titles, authors, venues…" autocomplete="off">
    </div>
    <div>
      <label class="search-label" for="publication-year">Year</label>
      <select id="publication-year">
        <option value="all">All years</option>
      </select>
    </div>
  </div>
  <div class="publication-filters" role="group" aria-label="Filter publications by type">
    <button type="button" data-filter="all" aria-pressed="true">All</button>
    <button type="button" data-filter="Conference paper" aria-pressed="false">Conferences</button>
    <button type="button" data-filter="Journal article" aria-pressed="false">Journals</button>
    <button type="button" data-filter="Preprint" aria-pressed="false">Preprints</button>
    <button type="button" data-filter="Poster" aria-pressed="false">Posters</button>
  </div>
  <p id="publication-results" class="search-results" role="status" aria-live="polite"></p>
</div>

<div class="publications publication-archive" data-publication-archive>
{% bibliography %}
</div>
