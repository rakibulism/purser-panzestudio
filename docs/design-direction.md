# Purser: design direction

Eight references, all charts. What they share: round forms, a quiet gray field, one hot color that fades, dotted lines, and large thin numbers.

| Reference | Measured | Where it went |
|---|---|---|
| Skill radar | field #E5E5E5, orange over gray hexagons, 1px dotted axes with arrow tips | "Worth it": the gray octagon is the old cost, so a point outside it is a loss |
| Positioning triad | sage #94AA95, pink #F79DB0 to red #FE5C41 blur, white 2px circles, dashed overlaps | "Caught overnight": the loop, on a clock ring |
| Emotion wheel | rounded wedges, light fill in a #5B5A58 track, 8 slices | The wheel: track is the limit, fill is the spend |
| Analytics card | pale bars, one gradient bar, dashed average with a white dot | "Set the limit": the dashed line is draggable |
| Impact metrics | hot #FF461D ticks fading through #F3927F to #E0E0E0, thin numerals | Month meters and ledger meters |
| Speed and efficiency | nested squircles, white dot fill, hairline beside a large number | Requests: outer is the ask, dotted is what it may do alone |
| Petals | #FD124F to clear, white rings with nodes | Radial fade inside each wedge |
| Product wheel | gray wheel, coral #ED5F53 hub, white ring, dotted arcs with arrowheads | The hub, and the dotted pace arc for month end |

## Rules

- Hot means money spent. Sage means authority. Nothing else gets a color.
- The eight agents keep the same angle on the wheel and on the radar.
- Host Grotesk. Figures are weight 300. Titles are weight 400 (h1) and 500 (h2).
- One grid: three equal columns on a desktop, two on a tablet, one on a phone. 24px page margin, 16px gutter, 20px card padding, 16px radius. Spacing comes from 4, 8, 12, 16, 20, 24.
- Every page and card opens with a title and a subtitle under it: h1 30 with 16, h2 17 with 14.
- Cards are flat white (one sage) on the gray canvas. No shadows, no glows, no borders.
- Icons are Hugeicons, stroke rounded. Nothing else is hand-drawn except the logo and the charts.
- The Overview is one screen. Every block has a card above the fold, and its heading opens the full page.
- The blurred field is a filled shape inside one card, never elevation.

## Dark: Ember

The wheel is the light source. Canvas and cards lean barely warm (#141110, #23201F, #2D2927), so hot reads as lit rather than printed.

- Spend cools from hot to a dim red rim with light labels. Only a wedge over its limit stays fully bright, with dark labels.
- Authority reverses: what an agent may do is the lit sage, what it asks for is sage in shadow. The sage card is the same sage at night.
- Buttons and the toast use ink, so they are light on dark.
- Cards separate from the canvas by lightness alone, as in light.
- Every color is a token in `tokens.stylex.ts`, with its dark step in `themes.ts`. Small text keeps 4.5:1 and graphics 3:1.
- The theme follows the system until someone picks one. The choice is applied before the first paint.
