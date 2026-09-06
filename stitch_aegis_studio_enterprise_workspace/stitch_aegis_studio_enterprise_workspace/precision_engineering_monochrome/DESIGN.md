---
name: Precision Engineering Monochrome
colors:
  surface: '#131315'
  surface-dim: '#131315'
  surface-bright: '#39393b'
  surface-container-lowest: '#0e0e10'
  surface-container-low: '#1c1b1d'
  surface-container: '#201f22'
  surface-container-high: '#2a2a2c'
  surface-container-highest: '#353437'
  on-surface: '#e5e1e4'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e1e4'
  inverse-on-surface: '#313032'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#c6c6cf'
  on-secondary: '#2f3037'
  secondary-container: '#45464e'
  on-secondary-container: '#b4b4bd'
  tertiary: '#ffffff'
  on-tertiary: '#2f3038'
  tertiary-container: '#e3e1ec'
  on-tertiary-container: '#63646c'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#e2e1eb'
  secondary-fixed-dim: '#c6c6cf'
  on-secondary-fixed: '#1a1b22'
  on-secondary-fixed-variant: '#45464e'
  tertiary-fixed: '#e3e1ec'
  tertiary-fixed-dim: '#c6c5cf'
  on-tertiary-fixed: '#1a1b22'
  on-tertiary-fixed-variant: '#46464e'
  background: '#131315'
  on-background: '#e5e1e4'
  surface-variant: '#353437'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '500'
    lineHeight: 24px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: -0.01em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0em
  caption:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.01em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  space-2xs: 0.125rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-base: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem
  gutter-compact: 0.5rem
  gutter-standard: 1rem
  sidebar-width: 16rem
  inspector-width: 22rem
---

## Brand & Style

This design system establishes an ultra-refined, high-density operational aesthetic tailored for infrastructure engineers, AI research teams, and enterprise security architects. It draws aesthetic and mechanical principles from cutting-edge developer platforms and precision command lines: high functional density, strict visual order, stark contrast, and zero decorative fluff.

### Tone & Personality
- **Rigorous & Authoritative:** The interface conveys institutional stability, cryptographic certainty, and high-stakes operational reliability.
- **Instrumental & Utilitarian:** Visual chrome recedes completely, elevating telemetry, runtime models, node health, and audit logs.
- **Architectural Polish:** Every pixel alignment, hairline stroke, and optical weight is calibrated to eliminate cognitive drag during incident triage and complex model deployment.

### Design Principles
- **Monochrome Superiority:** Color is stripped of aesthetic responsibility. Visual weight is communicated strictly through surface brightness steps, foreground contrast ratios, and stroke precision.
- **High Information Density:** Compact layouts, explicit boundaries, micro-typography, and structured monospace readouts ensure maximum screen real estate utilization without clutter.
- **Deterministic Motion:** Transitions do not bounce, drift, or linger. State shifts are immediate (100–150ms maximum), mimicking raw terminal snappiness.

## Colors

The palette relies entirely on an achromatic spectrum spanning deep graphite black to crisp optical white. Semantic color exists strictly at micro-scales (e.g., status indicator lights of 6px radius) and remains subordinate to the monochrome hierarchy.

### Surface Architecture (Dark Mode Default)
- **Base Canvas (`#09090B`):** Deep graphite black, grounding application frames, full-screen canvas views, and root panels.
- **Layer 1 Surface (`#121215`):** Docked sidebars, inspection panels, and primary grid wrappers.
- **Layer 2 Card / Substrate (`#18181B`):** Elevated cards, terminal containers, node canvases, and dropdown panels.
- **Layer 3 Hover / Popover (`#27272A`):** Interactive hover states, modal dialogs, and active toolbars.

### Stroke & Hairline Rules
- **Subtle Border (`#27272A`):** Standard 1px perimeter border for cards, data table rows, splitters, and docked toolbars.
- **Muted Border (`#3F3F46`):** Highlighted divisions, focused table rows, and input active boundaries.
- **High-Contrast Border (`#52525B`):** Keyboard-focused triggers, active search indicators, and pinned nodes.

### Foreground Hierarchy
- **Foreground Primary (`#FFFFFF`):** High-impact headings, primary metrics, active code strings, and prominent labels.
- **Foreground Secondary (`#A1A1AA`):** Body narrative, parameter descriptions, column headers, and interactive labels.
- **Foreground Muted (`#71717A`):** Metadata timestamps, terminal line numbers, disabled states, and inactive tab icons.
- **Foreground Ghost (`#52525B`):** Placeholder text, divider glyphs, and structural tree guidelines.

### Light Mode Inversion Reference
When deployed in high-luminance enterprise environments:
- **Base Canvas:** `#FFFFFF`
- **Surface Elevation 1:** `#FAFAFA`
- **Surface Elevation 2:** `#F4F4F5`
- **Borders:** `#E4E4E7` and `#D4D4D8`
- **Foreground Primary:** `#09090B`
- **Foreground Secondary:** `#52525B`

## Typography

The type engine employs a strict dual-font setup: **Inter** handles high-legibility interface controls, navigation, and executive summaries, while **JetBrains Mono** powers system telemetry, model hashes, vector parameters, latency timers, and shell inputs.

### Typographic Rules
- **Proportional Tabular Numerics:** Enable `tnum` (tabular figures) across all instances of Inter where numerical data changes dynamically (e.g., CPU/RAM usage meters, throughput gauges).
- **Technical Readouts:** JetBrains Mono is mandatory for file systems, cluster identifiers, runtime arguments, IP allocations, and inline security hashes.
- **Optical Kerning:** Large headlines (`display-lg` down to `headline-md`) must enforce tight negative tracking (`-0.015em` to `-0.025em`) to simulate engineered editorial precision.
- **Vertical Alignment:** Ensure monospace elements vertically center with adjacent UI icons and badges by pairing exact baseline calculations rather than relying on automated flex centering.

## Layout & Spacing

Layouts follow a docked, multi-pane workbench paradigm. Workspaces prioritize modular paneling over deep vertical page scrolling, mimicking industrial IDEs and terminal matrices.

### The Shell Model
- **Primary Rail:** Fixed 56px left navigation collapsed rail for universal scope switching (Projects, Models, Audit, Deployments).
- **Navigation Drawer / Subtree:** 256px (`sidebar-width`) collapsible file tree and model version browser.
- **Main Canvas:** Dynamic workspace containing data grids, distributed compute topology graphs, or execution timelines.
- **Inspection Drawer:** 352px (`inspector-width`) right contextual pane that reveals low-level JSON parameters, runtime flags, and telemetry history.

### Grid & Density Rules
- **4px Baseline Unit:** All margins, paddings, gap definitions, and component heights resolve to multiples of 4px.
- **High-Density Data Tables:** Row heights are fixed to 32px for compact viewports and 40px for standard inspection views.
- **Explicit Dividers Over Gaps:** Panels rely on continuous 1px solid hairline borders (`#27272A`) rather than expansive white space or margins. This structural framing retains orientation in data-heavy environments.

## Elevation & Depth

Depth is established through stacked luminance and razor-thin hairline borders. Diffuse dropshadows and colorful glow shaders are strictly forbidden.

### Depth Hierarchy
1. **Canvas Level 0 (`#09090B`):** Recessed ground plane, background of node graphs, splitpane dividers.
2. **Panels & Toolbars Level 1 (`#121215`):** Bordered with a 1px continuous hairline stroke (`#27272A`).
3. **Cards & Interactive Containers Level 2 (`#18181B`):** Separated by internal borders (`#27272A`) without drop shadows.
4. **Overlays & Context Menus Level 3 (`#18181B`):** Bordered with `#3F3F46` and paired with a subtle, non-dispersed contact shadow (`box-shadow: 0 4px 12px rgba(0, 0, 0, 0.65), 0 0 0 1px #3F3F46`).
5. **Modals & Critical Confirmations Level 4 (`#121215`):** Framed with `#52525B` 1px border over an opaque dimmed backdrop (`rgba(9, 9, 11, 0.85)` with `backdrop-filter: blur(2px)`).

## Shapes

The design system enforces a disciplined, compact shape language (`roundedness: 1`). Radii are kept intentionally minimal to evoke precision instruments, physical server racks, and code terminal windows.

### Corner Radii Specifications
- **Controls & Form Elements:** 4px (`rounded-sm`). Applies to buttons, text inputs, search fields, chips, and segment tabs.
- **Panels & Modals:** 6px (`rounded-md` to `rounded-lg`). Applied selectively to floating context cards, modal windows, and detached popovers.
- **Inner Embedded Objects:** 2px to 0px. Data table rows, code blocks within cards, and segmented control segments utilize 2px or sharp 0px inner radii to ensure mechanical alignment.
- **Zero-Radius Scenarios:** Docked panels, splitters, terminal consoles, and persistent top/side rails maintain sharp 0px corners where elements abut outer window edges.

## Components

### Buttons
- **Primary:** Solid `#FFFFFF` fill with `#09090B` text. Hover state shifts to `#E4E4E7`. Active state scales subtly or drops brightness to `#D4D4D8`. Font is Inter 13px Medium.
- **Secondary:** Transparent fill with a 1px `#27272A` border and `#FFFFFF` text. Hover shifts background to `#18181B` and border to `#3F3F46`.
- **Tertiary / Ghost:** Transparent fill, no border, `#A1A1AA` text. Hover shifts background to `#18181B` with text advancing to `#FFFFFF`.
- **Destructive:** Transparent fill with a 1px border. Default text `#A1A1AA`. Hover shifts background to `#18181B`, border to `#52525B`, and text to `#FFFFFF` with a single high-contrast warning icon.

### Chips & Badges
- **System Badges:** 20px height, 4px corner radius. Background is `#18181B` with a hairline `#27272A` border. Font: JetBrains Mono 11px uppercase (`label-sm`).
- **Telemetry Indicators:** Inline badges displaying latency, cluster IDs, or token counts must use JetBrains Mono. Status is communicated through a hollow or solid 6px dot:
  - Active: Solid `#FFFFFF` dot.
  - Idle/Standby: Hollow `#71717A` ring with `#27272A` center.
  - Error: 1px hollow stroke in `#FFFFFF` with an internal glyph.

### Data Tables
- **Headers:** 28px height, `#121215` background, uppercase 11px JetBrains Mono (`label-sm`) in `#71717A`. Separated by a 1px horizontal rule (`#27272A`).
- **Cells:** Fixed padding (`space-xs` vertical, `space-md` horizontal). Body text in Inter 12px (`body-sm`) or JetBrains Mono 11px (`code-sm`).
- **Hover & Selection:** Hovering a row sets its background to `#18181B`. Pinned or selected rows feature an explicit 2px left border accent in `#FFFFFF`.

### Checkboxes & Radios
- **Checkbox:** 14px × 14px square, 2px radius, 1px border (`#3F3F46`). Unchecked state is transparent. Checked state is solid `#FFFFFF` fill with a `#09090B` sharp geometric check glyph.
- **Radio:** 14px circular ring, 1px border (`#3F3F46`). Selected state renders a centered 6px solid `#FFFFFF` dot.

### Input Fields & Monospace Editors
- **Single-Line Inputs:** 32px height, `#121215` background, 1px `#27272A` border. Text is Inter 13px `#FFFFFF` with `#52525B` placeholder.
- **Focus Ring:** Strict 1px stroke shift to `#FFFFFF` (or `#71717A`). No fuzzy outline or glow rings.
- **Terminal Inputs:** Prepended by a static `#71717A` prompt glyph (`$`, `>`, or `λ`). Font is strictly JetBrains Mono 12px.

### Cards & Observability Panes
- Structural containers feature a solid `#121215` or `#18181B` background with a 1px `#27272A` border.
- Card headers strictly divide content with an internal 1px horizontal hairline. Header titles pair an Inter 13px medium label with a right-aligned JetBrains Mono execution stamp or metric readout.