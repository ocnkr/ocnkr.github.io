---
layout: page
title: News archive
description: Research, publications, and professional updates.
permalink: /news/
---

{% assign news = site.news | sort: 'date' | reverse %}
{% assign years = news | group_by_exp: 'item', "item.date | date: '%Y'" %}
<div class="news-archive">
{% for year in years %}
  <section class="news-year" aria-labelledby="news-{{ year.name }}">
    <h2 id="news-{{ year.name }}">{{ year.name }}</h2>
    {% include news-list.liquid items=year.items %}
  </section>
{% endfor %}
</div>
