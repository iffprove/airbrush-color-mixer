# Airbrush Color Mixer

A browser-based tool for airbrush painters that finds the best single paint or multi-paint mixing formula to match any target colour. Point it at a photo, enter a hex value, or use the sliders — it searches a database of 400+ paints across 9 professional brands and returns ranked formulas with ΔE scores, ml measurements, and drop counts.

**Live:** https://airbrushmix-4zgwxbnj.manus.space

---

## Tech Stack

| Layer | Library |
|---|---|
| UI framework | React 19 |
| Build tool | Vite 7 |
| Language | TypeScript 5.6 |
| Styling | Tailwind 4 + shadcn/ui |
| Routing | wouter |
| Animation | framer-motion |
| Colour mixing | spectral.js (Kubelka-Munk) |

---

## Mixing Pipeline

1. **Target capture** — photo colour sampler, hex input, or RGB sliders
2. **LAB conversion** — target and every paint in the database are converted to CIE LAB
3. **Combinatorial search** — exhaustive search over single paints, all pairs (5 % ratio steps), and top-15 triples (5 % ratio steps)
4. **Spectral mix simulation** — each candidate formula is evaluated using [spectral.js](https://github.com/rvanwijnen/spectral.js) Kubelka-Munk mixing, which correctly predicts subtractive hue shifts (yellow + blue → green)
5. **ΔE scoring** — results are ranked by CIE76 ΔE against the target; a steeper exponential curve (`score = 100 × e^(−ΔE/8)`) replaces the old linear one for more honest match percentages
6. **Formula output** — best formula shown with paint codes, part ratios, ml amounts, and drop counts for a user-specified total volume

---

## Local Development

```bash
pnpm install
pnpm dev
```

App runs at `http://localhost:5173`.

---

## Tests

```bash
pnpm test
```

Runs the vitest suite. Key tests:

- **Canonical subtractive test** — yellow + blue produces green (passes with spectral mixing, intentionally fails with legacy mixer to document the improvement)
- **Gamut** — 3-paint mixes stay within 0–255
- **Tinting strength** — higher `tintingStrength` shifts the mix toward that pigment

---

## Feature Flag: Spectral vs Legacy Mixer

`USE_SPECTRAL_MIX` in `client/src/lib/colorMixer.ts` controls which engine is active:

```ts
export const USE_SPECTRAL_MIX = true;  // false → legacy CMY+LAB hybrid
```

Set it to `false` and re-run `pnpm test` to see the canonical yellow+blue test fail — confirming the flag correctly routes between the two engines.

---

## Known Limitations

- **RGB approximations** — paint RGB values come from official colour charts and swatch scans, not spectrophotometer measurements. Real-world deviations are expected.
- **Camera white-balance** — photo sampling is affected by ambient light colour; no white-balance calibration is implemented yet.
- **Metallic / flip-flop** — interference pigments change colour with viewing angle. The model treats them as flat colours.
- **3-paint maximum** — the search is exhaustive; adding a 4-paint tier would be computationally expensive at current resolution.
- **Tinting strength defaults to 1.0** — `tintingStrength` is wired up in the mixing engine but not yet tuned per-pigment. Real spray-out data is needed to calibrate individual pigments.

---

## Brands Included

Createx Wicked Colors · Createx Illustration · Createx Candy2o · Createx Auto-Air · Vallejo Model Air · Vallejo Game Air · E'TAC · Badger Minitaire · Com-Art (Iwata/Medea)

> The mixer currently defaults to **Wicked Colors only**. A pre-launch decision is needed on whether to open the default scope to all 9 brands (see `TODO(scope)` in `findMixFormula`).
