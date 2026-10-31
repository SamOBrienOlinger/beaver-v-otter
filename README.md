# Beaver v Otter

An educational game about river ecosystems, data centres and public participation. Choose a beaver or an otter and explore how decisions affect a shared river.

**Two animals. One river. Your choices matter.**

The ten proposed campuses and their catchment are fictional. The animals are story guides, and the game is not a claim about a real development or the species found in a particular Irish river.

**HTML · CSS · JavaScript**

[Visit the website](https://samobrienolinger.github.io/beaver-v-otter/) · [Getting started](#getting-started) · [Repository guide](#repository-guide) · [Checks](#checks-and-review) · [Credits](#credits-and-reuse)

<img src="assets/images/beaver-otter-holding-hands-corrected.png" alt="Beaver and otter characters standing together" width="360">

## What you can explore

- Two distinct routes with five challenges each: beaver (wetlands, drainage, habitat) and otter (food webs, pollution, river corridors).
- Plausible competing responses, varied answer order and explanations linked to primary sources.
- Optional character nicknames, shown during play and on the final river report.
- Consistent River health and Civic knowledge scores, score changes and an illustrated river outlook.
- Local save/resume, a confirmation before clearing a game, and a five-decision review with follow-up resources.
- The existing character illustrations throughout selection, play and results.
- An interactive data-centre impact explorer.
- Animal facts, collective-advocacy content and embedded learning videos.

## Using the project

1. Choose the Beaver or Otter as your river advocate.
2. Give your character a nickname of up to 24 characters, or leave it blank to use the animal’s name, then select **Start playing**.
3. Work through five challenges and select a response at each step.
4. Read the feedback and score changes. Open **Why this matters & evidence** for background and primary-source links.
5. Review all five decisions in the river report, then try the other animal’s route.
6. Return to the page and choose **Continue your game** or **View your river report**. Starting a new game clears the previous saved nickname, choices and report after confirmation.

> **Scoring:** River health begins at 60/100; Civic knowledge begins at 0/50. The authored choices award -4, +3 or +8 river-health points and 3, 6 or 10 knowledge points. The scores and changing illustration are teaching devices, not ecological measurements, predictions or validated assessments. The sources support background topics, not the invented point values. Real outcomes depend on local conditions, decisions, monitoring and time.

## Saved progress and accessibility

One game is stored under `beaver-v-otter-progress` in this browser’s local storage. It contains the optional nickname, animal, answer order, choices and current stage. It is not sent to a server or shared across devices. “Start a new game” clears it after confirmation. Invalid or outdated saves fall back to a new game; unavailable storage never prevents play.

The interface provides a game skip link, native health meter and progress indicator, focused headings after transitions, a short score announcement, explicit selected-answer text, a native confirmation dialog, keyboard-operated topic tabs and reduced-motion styling. The wrapping mobile layout exposes all six impact topics without horizontal scrolling. Native dialog focus containment, screen-reader output and rendered layouts still require real-browser review.

## Getting started

Requires Git, a browser and a local HTTP server. Python 3 provides one without installing application packages.

```bash
git clone https://github.com/SamOBrienOlinger/beaver-v-otter.git
cd beaver-v-otter
python3 -m http.server 8000 --bind 127.0.0.1
```

Open [localhost:8000](http://localhost:8000). Serve the repository over HTTP so relative assets, storage and page links behave consistently. The published site has no build step or runtime package dependencies. Node.js 24 is needed only for the development checks below.

## Repository guide

| Path | Purpose |
| --- | --- |
| [index.html](index.html) | Primary browser entry point |
| [assets/](assets/) | Existing character and habitat imagery |
| [game-data.js](game-data.js) | Scenarios, choices and evidence links |
| [game-core.js](game-core.js) | Scoring, answer order and validated saved progress |
| [script.js](script.js) | Page interaction and state rendering |
| [styles.css](styles.css) | Original page layout and visual styling |
| [game-experience.css](game-experience.css) | Responsive gameplay and accessibility styles |
| [hero-staging.css](hero-staging.css) | Immediately visible hero content and artwork layout |
| [tests/](tests/) | Game-engine and document-interaction regression tests |
| [.github/workflows/](.github/workflows/) | Build, test or deployment workflows |

## Checks and review

```bash
npm ci --ignore-scripts
npm run check
```

The checks cover all 486 possible decision paths, perfect-score outcomes, varied answer positions, invalid saves, blocked storage, replay protection, Unicode nicknames, both DOM-level game journeys, resumed answers and reports, reset confirmation, keyboard controls, semantic references and local assets. GitHub Actions runs the same checks.

JSDOM tests do not render layouts or emulate a screen reader. Browser verification was unavailable during this update. Before claiming full browser/accessibility coverage, review Safari, Firefox and Chromium at 320, 390, 768 and 1440 CSS pixels, 200% zoom, keyboard-only navigation and reduced motion. Check native dialog focus containment, VoiceOver/NVDA announcements, touch targets and the river outlook. No full WCAG conformance claim is made.

## Deployment

A GitHub Pages site is configured for this repository. Its published URL is linked at the top of this README.

Review [.github/workflows/jekyll-docker.yml](.github/workflows/jekyll-docker.yml) before changing the publishing workflow or source directory.

## Credits and reuse

Created by [Sam O'Brien-Olinger](https://github.com/SamOBrienOlinger).

Educational source material linked by the game includes:

- [EPA — River monitoring](https://www.epa.ie/our-services/monitoring--assessment/freshwater--marine/rivers/).
- [NPWS — Protected sites](https://www.npws.ie/protected-sites).
- [Catchments.ie — Water evidence and community action](https://www.catchments.ie/).
- [NatureScot — Beaver guide](https://www.nature.scot/doc/beavers-scotland-faq).
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
