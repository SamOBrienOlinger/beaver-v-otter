# Hero data centres — 12 November 2026

The live river hero contains **six data-centre campuses**: the three original instances plus three additional instances of the new matching artwork.

- Source reference: `assets/images/data-centre-campus.png`.
- New artwork: `assets/images/data-centre-campus-additional-20261112.webp` (1024 × 204, transparent WebP).
- Generation method: built-in image generation, using the original campus as the visual reference.
- Preparation: transparent canvas margins removed and the artwork resized proportionally for the web, preserving alpha.
- Integration: `.campus-upper-left`, `.campus-bank-left` and `.campus-bank-right` in `hero-character.css`. The existing animals, rock, landscape and interactions remain intact.
- Accessibility: the scene's text alternative describes six data centres; component images remain decorative.

## Generation brief

Create one matching companion data-centre campus based on the existing transparent campus illustration. Preserve the muted pale silver-grey and blue-green palette, low front three-quarter viewpoint, flat rectangular architecture, rooftop cooling equipment and subdued daylight. One broad low data hall with a connected service annex and dark teal ventilation panels; low wide silhouette and a narrow grassy grounding strip. Genuine transparent background. No sky, hills, water, animals, trees, disconnected buildings, text, logos or border.

## Layout

Additional campuses use relative positions and capped percentage widths. Their bases remain above the water line, with the original scene layering keeping the animals in front. The three existing campus instances continue to use the original artwork.
