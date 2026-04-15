# Design System: Tierra y Musgo (Earth & Moss)

## 1. Overview & Creative North Star
### The Creative North Star: "The Tactile Explorer"
This design system moves away from the sterile, "tech-first" aesthetic of typical navigation apps and embraces a high-end editorial feel inspired by vintage topographic maps and modern architectural retreats. 

We are not building a utility; we are building a digital companion for the open road. The interface should feel like an organic extension of the landscape—heavy on atmosphere, light on "UI noise." We achieve this through **Organic Brutalism**: combining robust, legible typography with a layout that breathes through intentional asymmetry and tonal layering rather than rigid grids and borders.

---

## 2. Color & Surface Architecture
The palette is rooted in the "Tierra y Musgo" philosophy. It utilizes a Material 3-inspired tonal mapping to ensure accessibility while maintaining a bespoke, premium depth.

### Color Strategy
- **Primary (`#316342` to `#4A7C59`):** Represents the deep moss of the forest. Used for core navigation and authoritative actions.
- **Secondary/Accent (`#835425` to `#FFB74D`):** Earth tones that act as wayfinding markers. These are the "dust and sun" that break the greenery.
- **Surface & Background (`#FAF3DD`):** A warm, cream base that reduces glare during outdoor use compared to pure white.
- **Error (`#B84E33 `):** A soft terracotta red that matches the matte palette and doesn't stand out, but clearly shows the flaws.

### The "No-Line" Rule
To maintain a high-end, seamless feel, **explicitly prohibit 1px solid borders for sectioning.** Boundaries are defined solely through background color shifts.
- A card should not have an outline; it should be a `surface-container-lowest` (`#ffffff`) shape sitting on a `surface` (`#fff9ea`) background.
- Use the **Surface Hierarchy** to nest elements:
    - **Base:** `surface` (#fff9ea)
    - **Secondary Sections:** `surface-container-low` (#faf3dd)
    - **Interactive Cards:** `surface-container-lowest` (#ffffff)

### Glassmorphism & Texture
For overlays, maps, or image-heavy views, use **Backdrop Blurs**.
- **The Glass Rule:** Use `primary-container` at 80% opacity with a 16px-20px blur. This creates a "frosted glass" effect that allows the "Tierra" (earth) to peek through the "Musgo" (moss), keeping the user immersed in the adventure.

---

## 3. Typography
We use a high-contrast pairing to balance technical precision with editorial character.

- **Display & Headlines: Space Grotesk.** A robust, wide-aperture sans-serif that feels engineered and modern. Use this for route titles, distances, and high-level branding.
- **Body & Labels: Manrope.** A highly legible, geometric sans-serif designed for screen clarity. Its open counters make it readable even under vibration or harsh sunlight.

### Typography Scale
- **Display-LG (3.5rem / Space Grotesk):** Hero route titles.
- **Headline-MD (1.75rem / Space Grotesk):** Section headers (e.g., "Upcoming Waypoints").
- **Title-MD (1.125rem / Manrope):** Card titles and primary button text.
- **Body-LG (1rem / Manrope):** Long-form descriptions and travelogues.
- **Label-MD (0.75rem / Manrope):** Metadata (lat/long, weather stats, elevation).

---

## 4. Elevation & Depth
In this system, depth is a result of light and shadow, not lines and boxes.

- **The Layering Principle:** Stack `surface-container` tiers. A `surface-container-highest` button should sit on a `surface-container-low` header to create natural contrast.
- **Ambient Shadows:** Standard drop shadows are forbidden. Use **Tinted Ambient Shadows**. Shadows must use a 4%–8% opacity of the `on-surface` color (`#1e1c0f`) with a blur value of at least 24px. It should look like a soft glow, not a hard edge.
- **The Ghost Border Fallback:** If accessibility requires a stroke (e.g., high-glare environments), use `outline-variant` at **15% opacity**. It must feel like a suggestion of a border, not a container.

---

## 5. Components
All components must accommodate **"Glove-Friendly"** interaction, meaning minimum touch targets of 48dp x 48dp.

### Buttons
- **Primary:** `primary` (#316342) background with `on-primary` (#ffffff) text. **Radius: 1.5rem (xl).** Subtle gradient from `primary` to `primary-container` is encouraged for depth.
- **Secondary:** `secondary` (#835425) background. Used for secondary route options.
- **Tertiary:** No background, `primary` text. Use for low-emphasis actions like "View More."

### Cards & Waypoints
- **Structure:** Never use divider lines. Separate content using the **Spacing Scale** (e.g., a `6` (2rem) gap between list items).
- **Style:** Use `surface-container-lowest` with a `1rem (lg)` to `1.5rem (xl)` corner radius. 
- **The Map Overlay:** Floating cards on the map must use the Glassmorphism rule (80% opacity + blur) to maintain spatial awareness of the route beneath.

### Input Fields
- **Style:** Filled style only (no outlined boxes). Use `surface-container-high` as the background.
- **Indicator:** A 2px bottom bar in `primary` color only appears on focus.

### Custom Component: The "Adventure Meter"
A bespoke horizontal gauge using a gradient from `tertiary` (mustard) to `primary` (moss) to indicate route difficulty or scenic value.

---

## 6. Do’s and Don'ts

### Do:
- **Do** use asymmetrical margins. A wider left margin for headlines creates a "journal" feel.
- **Do** use large, sweeping imagery of nature behind semi-transparent `surface` layers.
- **Do** utilize the `surface-container` tokens to create "indentation" for nested information like weather details inside a route card.

### Don’t:
- **Don't** use 1px solid black or grey borders. This instantly kills the premium, organic feel.
- **Don't** use pure black (#000000) for text. Use `on-surface` (#1e1c0f) to maintain visual softness.
- **Don't** crowd the screen. MotoRoute users are often outdoors; white space is a functional requirement for clarity, not just a stylistic choice.
- **Don't** use small icons. All icons should be a minimum of 24px within a 48px touch container for glove usage.

---

## 7. Spacing Scale
Spacing is the "oxygen" of the design. Use these tokens to maintain a rhythmic, airy layout:
- **Tight (2 / 0.7rem):** Internal element spacing (icon to text).
- **Standard (4 / 1.4rem):** Card padding and small vertical gaps.
- **Editorial (8 / 2.75rem):** Spacing between major sections or headline to body.
- **Hero (12 / 4rem):** Top/Bottom padding for hero sections.