# Onur Cankur — academic website

A research-focused academic website built with [al-folio](https://github.com/alshedivat/al-folio), Jekyll, and a pinned `al_folio_core` 1.0.15 runtime. The public address remains `https://ocnkr.github.io`.

## Local setup and preview

Requires Ruby 3.4 and Node.js 24. The scripts recognize the keg-only Homebrew installations on Apple Silicon Macs.

```sh
sh scripts/setup-local.sh
sh scripts/preview.sh
```

Open `http://127.0.0.1:4000`. The server binds only to your computer’s loopback address. Stop it with Ctrl+C. Previewing does not publish anything.

For a production build:

```sh
sh scripts/build.sh
```

The generated site is in `_site/` and is excluded from Git.

## Editing content

Use American English for site prose and interface labels. Preserve official publication titles and organization names.

| Content                                             | Location                                                                     |
| --------------------------------------------------- | ---------------------------------------------------------------------------- |
| Current role, contact links, and supplied short bio | `_data/profile.yml`                                                          |
| Homepage background paragraph                       | `_pages/about.md`                                                            |
| Research themes                                     | `_data/research.yml`                                                         |
| Research stories                                    | `_pages/research-gpu-telemetry.md`, `_pages/research-code-level-analysis.md` |
| Publications and homepage selections                | `_bibliography/papers.bib`                                                   |
| Software and contribution descriptions              | `_projects/`                                                                 |
| Education, experience, honors, and languages        | `_data/cv.yml`                                                               |
| Teaching                                            | `_data/teaching.yml`                                                         |
| Service, grouped by role and year                   | `_data/service.yml`                                                          |
| News, newest first                                  | `_news/` (homepage and `/news/` archive)                                     |
| Navigation                                          | `_data/navigation.yml`                                                       |
| CV download                                         | `files/OnurCankurCV.pdf`                                                     |
| Colors, spacing, and responsive styling             | `assets/css/academic.css`                                                    |

Add a BibTeX entry with a `category` of `Conference paper`, `Journal article`, `Preprint`, or `Poster`. Set `selected = {true}` to feature it on the homepage. Optional `pdf`, `doi`, `code`, `poster`, and `slides` fields create the corresponding links. BibTeX exports omit the display-only fields.

The homepage shows the three latest news entries. The news archive includes every entry, grouped by year, using the same `_news/` files. Add updates there to keep both views in sync. Service entries are grouped by role, with optional years and source links; keep dated entries newest first.

The CV page reads the structured data; keep that data and the downloadable PDF in sync when updating your CV. The PDF supplied for this migration is retained at the original `/files/OnurCankurCV.pdf` URL.

## Design and runtime ownership

Al-folio supplies the base styles, page layout, metadata, theme preference, and publication integration. The site adds a responsive header, research and software layouts, an accessible CV presentation, and publication search with year and publication-type filters. The year dropdown lists the available years from newest to oldest. It uses system fonts and inline SVG icons, with no required external font or icon requests.

Two intentional theme overrides live in `_layouts/default.liquid` and `_layouts/bib.liquid`. They provide the site shell and semantic publication entries. The remaining custom layouts and includes are site-specific additions. `.al-folio-overrides.yml` records upstream hashes so later theme upgrades can be reviewed:

```sh
bundle exec al-folio upgrade audit --no-fail
bundle exec al-folio upgrade overrides audit --fail-on-stale
```

Do not edit installed gems in `vendor/`. Upgrade their pins in `Gemfile` and review the recorded overrides instead.

## Verification

Run after changing content or styles:

```sh
sh scripts/build.sh
npm run check:format
npm run check:site
npm run test:browser
```

`check:site` verifies local links and anchors, primary routes, unique IDs, the CV download, and removal of template content. Browser checks cover desktop and mobile layouts, WCAG accessibility checks, theme persistence, publication filters and search, citations, navigation, software detail pages, and legacy redirects. They start a loopback server when one is not running. Screenshots are saved in `test-results/previews/`.

## Publishing

The redesign has not been published. The workflow does not deploy on pushes or pull requests.

After the site has been reviewed and publication has been authorized:

1. Commit and push the reviewed source to this repository.
2. Set the repository’s **Settings → Pages → Source** to **GitHub Actions**. The older branch-based Pages build does not support the al-folio plugins used here.
3. Run **Build and publish academic site** from the Actions tab, with **publish** selected.

A manual workflow run with `publish` left unchecked only builds and validates the site. Never publish until the owner has been notified and has authorized the release.

## Content sources

The supplied October 2026 CV and short biography are the primary content sources. Public publication records and links were checked against the [PSSG publication list](https://pssg.cs.umd.edu/publications/), arXiv, publisher pages, and the software repositories.

The Pipit preprint uses the current arXiv version 2 title and author list (May 2024), rather than the earlier version recorded in the supplied CV. The separately listed SC 2023 poster keeps its original author list. The 2019 conference entry follows the details available in the CV; no unverified DOI or venue name has been added.

Legacy `/about/`, `/about.html`, `/resume`, the existing talk and teaching detail URLs, and the CV download URL are retained. Original profile images remain available under `/images/`.

## Licenses

See `LICENSE` for the retained Academic Pages / Minimal Mistakes attribution and `LICENSE-al-folio` for al-folio’s MIT license. Theme runtime gems retain their own licenses.
