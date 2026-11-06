---
layout: page
title: Teaching
description: Teaching and research mentoring.
permalink: /teaching/
---

<p class="page-intro">My teaching experience spans introductory programming, computer systems, parallel computing, and high-performance computing.</p>

<div class="teaching-list">
{% for course in site.data.teaching %}
  <article class="teaching-item" id="{{ course.code | downcase }}">
    <div class="course-code">{{ course.code }}{% if course.period %}<span>{{ course.period }}</span>{% endif %}</div>
    <div>
      <h2>{{ course.title }}</h2>
      <p class="teaching-institution">{{ course.institution }}</p>
      <p class="teaching-role">{{ course.role }}</p>
      <p>{{ course.description }}</p>
    </div>
  </article>
{% endfor %}
</div>

<section class="home-section prose" id="mentoring">
  <h2>Research mentoring</h2>
  <p>I mentor undergraduate and master’s students in research projects.</p>
</section>
