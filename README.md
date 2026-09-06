# Beaver v Otter

An educational game about river ecosystems, data centres and public participation. Choose a beaver or an otter and explore how decisions affect a shared river.

**Ten Data Centres. Two animals. One river. Every choice changes the water.**

**HTML · CSS · JavaScript**

[Visit the website](https://samobrienolinger.github.io/beaver-v-otter/) · [Getting started](#getting-started) · [Repository guide](#repository-guide) · [Checks](#checks-and-review) · [Credits](#credits-and-reuse)

<img src="assets/images/beaver-otter-holding-hands-corrected.png" alt="Beaver and otter characters standing together" width="360">

## What you can explore

- Two animal routes with five challenges each.
- River Health and Knowledge scores with immediate explanations.
- An interactive data-centre impact explorer.
- Animal facts, collective-advocacy content and embedded learning videos.

## Using the project

1. Choose the Beaver or Otter as your river advocate.
2. Work through five challenges and select a response at each step.
3. Read the explanation and watch the River Health and Knowledge scores change.
4. Review the final river report, then replay the other animal’s route.

> **Project notes:** The scenarios are educational simplifications. Use the linked primary sources when investigating a real development proposal or environmental question.

## Getting started

Requires Git, a browser and a local HTTP server. Python 3 provides one without installing application packages.

```bash
git clone https://github.com/SamOBrienOlinger/beaver-v-otter.git
cd beaver-v-otter
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://localhost:8000). Serve the repository over HTTP so module imports, relative assets and page links resolve correctly.

## Repository guide

| Path | Purpose |
| --- | --- |
| [index.html](index.html) | Primary browser entry point |
| [assets/](assets/) | Project styles, scripts, data and imagery |
| [script.js](script.js) | Page interaction and state rendering |
| [styles.css](styles.css) | Page layout and visual styling |
| [.github/workflows/](.github/workflows/) | Build, test or deployment workflows |

## Checks and review

No automated application test command is configured in this snapshot.

For a manual review, follow the main user journey, check keyboard navigation and narrow-screen layouts, and inspect the browser console for missing assets or failed requests.

## Deployment

A GitHub Pages site is configured for this repository. Its published URL is linked at the top of this README.

Review [.github/workflows/jekyll-docker.yml](.github/workflows/jekyll-docker.yml) before changing the publishing workflow or source directory.

## Credits and reuse

Created by [Sam O'Brien-Olinger](https://github.com/SamOBrienOlinger).

Educational source material linked by the game includes:

- [SEAI — Energy in Ireland](https://www.seai.ie/data-and-insights/seai-statistics/key-publications/energy-in-ireland).
- [EPA — State of the Environment](https://epawebapp.epa.ie/ebooks/soe2024/359/).
- [European Commission — data-centre sustainability rating scheme](https://energy.ec.europa.eu/news/commission-adopts-eu-wide-scheme-rating-sustainability-data-centres-2024-03-15_en).

Embedded videos retain their original creator attribution through the video player and source links in the game's Resources section.

Design decisions, original feature notes, historical testing evidence and detailed acknowledgements remain available in the preserved project record:

- [README.md · original project record](https://github.com/SamOBrienOlinger/beaver-v-otter/blob/8767c34378e25e0490cfd30154a0afd97f51f192/README.md)

No repository-level licence file is present in this snapshot. This README does not grant additional reuse permissions. Check with the relevant rights holders before reusing code, written content or assets.

## Support

Repository maintained in [Sam O’Brien-Olinger’s GitHub account](https://github.com/SamOBrienOlinger). For a problem or suggested improvement, [open an issue](https://github.com/SamOBrienOlinger/beaver-v-otter/issues) with the affected page or command, steps to reproduce, and expected behaviour.

[Back to top](#beaver-v-otter)
