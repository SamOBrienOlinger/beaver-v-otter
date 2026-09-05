# Beaver v Otter

Live site: https://samobrienolinger.github.io/beaver-v-otter/

**Ten Data Centres. Two animals. One river. Every choice changes the water.**

Beaver v Otter is a mobile-first educational web game about river ecosystems, water quality, environmental advocacy and the local effects of data centres. Players choose a beaver or an otter, respond to ecological and policy challenges, and learn how evidence, public participation and enforceable safeguards can help protect a shared river.

## Play the live game

[**Launch Beaver v Otter**](https://samobrienolinger.github.io/beaver-v-otter/)

No installation or account is required.

## How to play

1. Choose the **Beaver** or **Otter** as your river advocate.
2. Work through five scenario-based challenges.
3. Select the response you think best protects the river and strengthens public accountability.
4. Read the immediate educational feedback after each decision.
5. Track the changing **River Health** and **Knowledge** scores.
6. Receive a final river report, then replay or switch animals to explore the other route.

Each animal brings a different perspective:

- **Beaver:** habitat planning, water policy, energy policy, democratic access and accountability.
- **Otter:** food-web evidence, public consultation, cumulative impacts, jobs and the environment, and ecological limits.

## What the site explores

### River ecology

- How beavers reshape landscapes and create habitat
- How otters can indicate the health of aquatic food webs
- Why both species depend on connected, clean and resilient river systems

### Water quality

The learning content introduces four important indicators:

- Dissolved oxygen
- Temperature
- Nutrients
- Sediment

### Data centres and watersheds

An interactive impact explorer connects data-centre development with:

- Energy demand and climate
- Cooling systems and water use
- Land, habitat and wildlife corridors
- Noise, air quality and local communities
- Lower-impact design and transparent monitoring
- Public participation, policy and environmental accountability

### Collective advocacy

The game asks players to consider how communities can:

- Gather and communicate credible ecological evidence
- Participate in planning and consultation processes
- Build broad, accessible coalitions
- Seek cumulative environmental assessment
- Ask for transparent lobbying and monitoring records
- Press regulators to enforce environmental conditions
- Put public wellbeing, future generations and planetary limits at the centre of decisions

## Features

- Two playable character routes
- Ten interactive challenges in total
- Dynamic River Health and Knowledge scoring
- Immediate feedback for every choice
- A final performance report with replay controls
- Expandable animal facts and learning content
- Keyboard-operable data-centre impact tabs
- Responsive navigation and mobile-first layouts
- Semantic HTML and a skip link for keyboard users
- Visible focus states and reduced-motion support
- Two embedded YouTube videos using privacy-enhanced embeds
- Links to supporting information from SEAI, the EPA and the European Commission

## Technologies

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages
- YouTube privacy-enhanced embeds

The project has no framework, package-manager or database dependency.

## Project structure

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure, game interface, learning sections and embedded resources |
| `script.js` | Game state, challenges, scoring, feedback and interactive tabs |
| `styles.css` | Core layout, responsive design and accessibility styles |
| `hero-character.css` | Hero illustration and character presentation |
| `data-centres.css` | Data-centre impact explorer |
| `advocacy.css` | Advocacy learning section |
| `resources.css` | Embedded video resource cards |
| `assets/images/` | Character, landscape and data-centre artwork |
| `.github/workflows/` | GitHub Actions workflows |

## Run locally

Clone the repository:

```bash
git clone https://github.com/SamOBrienOlinger/beaver-v-otter.git
cd beaver-v-otter
```

You can open `index.html` directly, or start a simple local server:

```bash
python3 -m http.server 8000
```

Then visit [http://localhost:8000](http://localhost:8000).

## Deployment

The site is published with GitHub Pages from the `main` branch.

Live site: [https://samobrienolinger.github.io/beaver-v-otter/](https://samobrienolinger.github.io/beaver-v-otter/)

## Educational resources

The website links to further material from:

- [Sustainable Energy Authority of Ireland: Energy in Ireland](https://www.seai.ie/data-and-insights/seai-statistics/key-publications/energy-in-ireland)
- [Environmental Protection Agency: State of the Environment](https://epawebapp.epa.ie/ebooks/soe2024/359/)
- [European Commission: EU data-centre sustainability rating scheme](https://energy.ec.europa.eu/news/commission-adopts-eu-wide-scheme-rating-sustainability-data-centres-2024-03-15_en)

## Author

Created by [Sam O'Brien-Olinger](https://github.com/SamOBrienOlinger).
