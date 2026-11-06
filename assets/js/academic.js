document.documentElement.classList.add("js");

const siteHeader = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-navigation");

function closeMenu() {
  siteHeader?.removeAttribute("data-menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
}

menuToggle?.addEventListener("click", () => {
  const open = menuToggle.getAttribute("aria-expanded") !== "true";
  menuToggle.setAttribute("aria-expanded", String(open));
  siteHeader.toggleAttribute("data-menu-open", open);
});

navigation?.addEventListener("click", (event) => {
  if (event.target.closest("a")) closeMenu();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && menuToggle?.getAttribute("aria-expanded") === "true") {
    closeMenu();
    menuToggle.focus();
  }
});

document.addEventListener("click", (event) => {
  if (siteHeader && !siteHeader.contains(event.target)) closeMenu();
});

const archive = document.querySelector("[data-publication-archive]");
const tools = document.querySelector("[data-publication-tools]");

if (archive && tools) {
  const entries = [...archive.querySelectorAll("[data-publication]")];
  const search = document.querySelector("#publication-search");
  const yearSelect = document.querySelector("#publication-year");
  const filters = [...document.querySelectorAll("[data-filter]")];
  const status = document.querySelector("#publication-results");
  let category = "all";

  const years = [...new Set(entries.map((entry) => entry.dataset.year).filter(Boolean))].sort((a, b) => Number(b) - Number(a));
  for (const year of years) {
    yearSelect.add(new Option(year, year));
  }

  const searchableText = new Map(
    entries.map((entry) => [
      entry,
      [...entry.querySelectorAll(".publication-title, .publication-authors, .publication-venue, .publication-meta, .publication-summary")]
        .map((element) => element.textContent)
        .join(" ")
        .toLocaleLowerCase(),
    ]),
  );

  function updatePublications() {
    const terms = search.value.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
    let visibleCount = 0;
    for (const entry of entries) {
      const matches =
        (category === "all" || entry.dataset.category === category) &&
        (yearSelect.value === "all" || entry.dataset.year === yearSelect.value) &&
        terms.every((term) => searchableText.get(entry).includes(term));
      entry.closest("li").hidden = !matches;
      visibleCount += Number(matches);
    }
    for (const list of archive.querySelectorAll("ol.bibliography")) {
      const hasResults = [...list.children].some((item) => !item.hidden);
      list.hidden = !hasResults;
      if (list.previousElementSibling?.matches("h2.bibliography")) list.previousElementSibling.hidden = !hasResults;
    }
    status.textContent = visibleCount
      ? `${visibleCount} publication${visibleCount === 1 ? "" : "s"}${visibleCount === entries.length ? "" : ` of ${entries.length}`}`
      : "No publications match. Try another search, year, or publication type.";
  }

  search.addEventListener("input", updatePublications);
  yearSelect.addEventListener("change", updatePublications);
  for (const filter of filters) {
    filter.addEventListener("click", () => {
      category = filter.dataset.filter;
      for (const button of filters) button.setAttribute("aria-pressed", String(button === filter));
      updatePublications();
    });
  }
  tools.hidden = false;
  updatePublications();
}

for (const button of document.querySelectorAll(".copy-citation")) {
  if (!navigator.clipboard?.writeText) {
    button.hidden = true;
    continue;
  }
  button.addEventListener("click", async () => {
    const citation = button.closest(".citation-content").querySelector("code").textContent;
    try {
      await navigator.clipboard.writeText(citation);
      button.textContent = "Copied";
    } catch {
      button.textContent = "Select the citation below to copy";
    }
  });
}
