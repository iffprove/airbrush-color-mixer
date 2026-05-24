# Airbrush Color Mixer – Design Brainstorm

## Context
An airbrush color-mixing tool for artists who use Createx Wicked paints. The user photographs a surface (or picks a color), and the app returns a precise mixing formula with paint codes and ratios.

---

<response>
<text>

## Idea 1: "Workshop Industrial"

**Design Movement:** Industrial Brutalism meets Workshop Aesthetic — inspired by automotive paint booths, metal toolboxes, and spray-booth lighting.

**Core Principles:**
1. Utilitarian clarity — information hierarchy mimics a paint-booth instruction card
2. Tactile materiality — surfaces feel like brushed aluminum and rubber grips
3. High-contrast readability — white-on-dark like instrument panels in a spray booth
4. Tool-first layout — every pixel earns its place, no decorative filler

**Color Philosophy:** Dark charcoal base (#1C1C1E) with warm amber accent (#F5A623) evoking workshop lighting. Secondary steel-blue (#5A7D9A) for informational elements. The palette communicates "professional workspace" rather than "art gallery."

**Layout Paradigm:** Single-column vertical flow with chunky card panels stacked like drawers in a tool chest. The photo/color-picker area dominates the top third; the formula result sits below like a work order.

**Signature Elements:**
- Knurled-texture borders on interactive elements (reminiscent of airbrush adjustment knobs)
- "Drip" progress indicators during color analysis
- Paint-swatch chips with beveled edges that look like physical samples

**Interaction Philosophy:** Deliberate, mechanical interactions — toggles click, sliders have detents, buttons depress with weight.

**Animation:** Minimal but purposeful — color swatches "fill" from bottom-up like paint being poured; formula percentages count up like a digital scale.

**Typography System:** Mono-spaced "DM Mono" for paint codes and ratios (technical readability); "Space Grotesk" bold for headings (industrial confidence); system sans for body.

</text>
<probability>0.07</probability>
</response>

---

<response>
<text>

## Idea 2: "Chromatic Fluid"

**Design Movement:** Liquid Morphism — inspired by paint droplets, fluid dynamics, and the organic behavior of pigments mixing in water.

**Core Principles:**
1. Organic motion — UI elements behave like liquids, not rigid boxes
2. Color as protagonist — the interface recedes; the color dominates
3. Sensory feedback — interactions feel wet, viscous, satisfying
4. Progressive disclosure — complexity reveals itself as needed

**Color Philosophy:** Near-white canvas (#FAFAF8) that lets the user's target color become the visual anchor. UI chrome uses soft warm grays (#E8E4DF) with a single accent in deep teal (#1A5C5C) for actions. The neutrality ensures no UI color competes with the paint colors being analyzed.

**Layout Paradigm:** Asymmetric two-panel on desktop — left panel is the "canvas" (photo upload / color picker taking 60% width), right panel is the "formula card" that slides in. On mobile, a bottom-sheet pattern with the formula pulling up over the color area.

**Signature Elements:**
- Blob-shaped color preview that subtly morphs/breathes
- Paint-ratio bars rendered as layered liquid fills (not flat progress bars)
- Soft drop-shadow "puddles" beneath elevated elements

**Interaction Philosophy:** Fluid and forgiving — drag anywhere to adjust, pinch to zoom the photo, tap to sample. Errors dissolve rather than flash.

**Animation:** Smooth spring physics on all transitions (200-400ms). Color transitions use OKLCH interpolation for perceptually smooth blends. The formula card entrance uses a "pour" motion from top.

**Typography System:** "Instrument Sans" for headings (clean, modern, slightly warm); "Inter" at 400/500 weights for body and labels; tabular-nums for all ratio numbers.

</text>
<probability>0.05</probability>
</response>

---

<response>
<text>

## Idea 3: "Precision Gauge"

**Design Movement:** Instrument Panel Minimalism — inspired by high-end audio equipment, scientific instruments, and cockpit gauges. Think Dieter Rams meets a Pantone color lab.

**Core Principles:**
1. Measurement precision — the UI communicates exactness and confidence
2. Quiet authority — restrained palette, generous whitespace, no visual noise
3. Data density without clutter — show everything needed, nothing more
4. Systematic grid — 8px base unit, everything aligns

**Color Philosophy:** Off-white background (#F7F6F3) with near-black text (#1D1D1F). A single functional accent: a saturated signal-red (#E63946) used only for the "analyze" action and critical states. Paint swatches provide all the color the interface needs.

**Layout Paradigm:** Centered single-column with a fixed max-width (640px) creating a "lab report" feel. Sections separated by thin hairline rules. The photo area is a precise square with crosshair overlay; the formula below is a structured table.

**Signature Elements:**
- Crosshair/reticle overlay on the photo for precise color sampling
- Circular gauge showing "match confidence" percentage
- Monospaced paint codes in pill badges that look like lab labels

**Interaction Philosophy:** Precise and intentional — click exactly where you want to sample. No ambiguity. Hover states show exact pixel coordinates and color values.

**Animation:** Extremely restrained — only opacity fades (150ms) and subtle scale (0.98→1.0) on state changes. The confidence gauge needle sweeps smoothly. No bouncing, no springs.

**Typography System:** "JetBrains Mono" for all data (paint codes, percentages, hex values); "Satoshi" for headings and labels (geometric, authoritative); tight letter-spacing throughout.

</text>
<probability>0.08</probability>
</response>

---

## Selected Approach: Idea 1 — "Workshop Industrial"

This design best resonates with the airbrush community's identity. These are automotive and custom-paint professionals who work in booths and garages. The industrial aesthetic feels native to their workflow, and the dark-on-amber palette ensures paint colors pop against the UI without competition. The tool-chest layout is immediately intuitive for someone used to organized workshop environments.
