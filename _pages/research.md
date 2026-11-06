---
layout: page
title: Research
description: Understanding and improving the behavior of large-scale computing systems and applications.
permalink: /research/
---

<p class="page-intro">My research uses system measurements and predictive models to understand computing systems and workloads, guide operational decisions, and improve performance and energy efficiency. It spans operational data analytics, programmatic performance analysis, energy-efficient computing, and LLM-assisted performance diagnosis.</p>

<nav class="section-jump-links" aria-label="Research themes">
{% for topic in site.data.research %}
  <a href="#{{ topic.id }}">{{ topic.short_title }}</a>
{% endfor %}
</nav>

{% for topic in site.data.research %}
<section id="{{ topic.id }}" class="research-topic">
  <span class="topic-number" aria-hidden="true">{{ topic.number }}</span>
  <div>
    <h2>{{ topic.title }}</h2>
    <p class="research-question">{{ topic.question }}</p>
    <p>{{ topic.description }}</p>
    {% if topic.story_url %}
      <p class="research-story-link"><span class="eyebrow">Research story</span><a href="{{ topic.story_url | relative_url }}">{{ topic.story_label }} <span aria-hidden="true">↗</span></a></p>
    {% endif %}
    {% if topic.link and topic.link_label %}
      <a class="section-link" href="{{ topic.link | relative_url }}">{{ topic.link_label }} <span aria-hidden="true">↗</span></a>
    {% endif %}
  </div>
</section>
{% endfor %}

<section class="research-background prose">
  <h2>Research background</h2>
  <p>My Ph.D. dissertation at the University of Maryland, College Park is titled <em>Longitudinal Data Analytics of HPC Systems and Applications</em>. My doctoral research covered code-level performance analysis, system telemetry, run-to-run performance variability, and predictive modeling. During internships at Lawrence Berkeley National Laboratory and Pacific Northwest National Laboratory, I worked on performance variability, resource utilization, and memory-trace analysis.</p>
  <p>Earlier, at Hacettepe University, I worked on GPU-accelerated string-matching algorithms and blockchain-based distributed data storage.</p>
  <a class="section-link" href="{{ '/cv/' | relative_url }}">Full research background <span aria-hidden="true">↗</span></a>
</section>
