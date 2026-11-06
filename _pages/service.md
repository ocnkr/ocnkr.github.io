---
layout: page
title: Service
description: Service to the high-performance computing research community.
permalink: /service/
---

<div class="service-groups prose">
{% for group in site.data.service %}
  <section class="service-group" aria-labelledby="{{ group.id }}">
    <h2 id="{{ group.id }}">{{ group.title }}</h2>
    <ul>
      {% for entry in group.entries %}
        <li>
          {% if entry.year %}<span class="service-year">{{ entry.year }}:</span> {% endif %}
          {% for item in entry.items %}{% if item.url %}<a href="{{ item.url }}"{% if item.title %} title="{{ item.title | escape }}"{% endif %}>{{ item.name }}</a>{% else %}{{ item.name }}{% endif %}{% if item.detail %} — {{ item.detail }}{% endif %}{% unless forloop.last %}, {% endunless %}{% endfor %}
        </li>
      {% endfor %}
    </ul>
  </section>
{% endfor %}
</div>
