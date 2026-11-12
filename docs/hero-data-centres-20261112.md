# Hero data centres — 12 November 2026

The live river hero contains **seven data-centre campuses**: the three original instances, three additional instances of the matching low-rise artwork, and one larger two-storey facility in the central valley between the animals’ faces.

- Source reference: `assets/images/data-centre-campus.png`.
- New artwork: `assets/images/data-centre-campus-additional-20261112.webp` (1024 × 204, transparent WebP).
- Central artwork: `assets/images/data-centre-central-20261112.webp` (1024 × 334, transparent WebP).
- Generation method: built-in image generation, using the original campus as the visual reference.
- Preparation: transparent canvas margins removed and the artwork resized proportionally for the web, preserving alpha.
- Integration: `.campus-upper-left`, `.campus-bank-left` and `.campus-bank-right` in `hero-character.css`. The existing animals, rock, landscape and interactions remain intact.
- Accessibility: the scene's text alternative describes seven data centres, including the larger central facility; component images remain decorative.

## Generation brief

Create one matching companion data-centre campus based on the existing transparent campus illustration. Preserve the muted pale silver-grey and blue-green palette, low front three-quarter viewpoint, flat rectangular architecture, rooftop cooling equipment and subdued daylight. One broad low data hall with a connected service annex and dark teal ventilation panels; low wide silhouette and a narrow grassy grounding strip. Genuine transparent background. No sky, hills, water, animals, trees, disconnected buildings, text, logos or border.

## Layout

Additional campuses use relative positions and capped percentage widths. Their bases remain above the water line, with the original scene layering keeping the animals in front. The three existing campus instances continue to use the original artwork.

## Larger central facility

A companion two-storey data hall was generated using the added campus as the style reference. The brief requested one cohesive facility in the same pale grey and dark teal palette, with a compact approximately 3:1 silhouette, roof ventilation equipment, a service annex and transparent surroundings.

`.campus-central` is centred at 58% of the scene width with its base at 51% of the scene height. Its width is 42% of the scene, capped at 16rem. It is drawn behind the existing campus instances, trees and animals so the façade remains visible through the gap between the faces. The scene contains seven campus elements in total.
