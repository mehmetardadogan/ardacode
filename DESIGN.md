---
name: Mehmet Arda Studio — Monitoring
description: Scoped record of the monitoring center and incumbent admin shell.
colors:
  monitor-bg: "#0c182b"
  monitor-panel: "#111f34"
  monitor-line: "#2d405a"
  monitor-text: "#edf4ff"
  monitor-muted: "#b6c9df"
  monitor-accent: "#8ec3ff"
  traffic-bar: "#79b5ff"
  log-bg: "#0a1424"
  inspector-bg: "#142339"
  control-bg: "#17283f"
  control-text: "#e2eeff"
  field-bg: "#13233a"
  control-line: "#3b5372"
  control-hover: "#243d5c"
  row-selected: "#1d3553"
  shell-white: "#FFFFFF"
  info-text: "#a9d2ff"
  info-bg: "#1a3554"
  success-text: "#9aebce"
  success-bg: "#153d35"
  warning-text: "#ffd59b"
  warning-bg: "#49361d"
  error-text: "#ffb8b8"
  error-bg: "#472831"
  critical-bg: "#a73344"
typography:
  headline:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "24px"
    fontWeight: 750
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontSize: "17px"
    fontWeight: 650
  body:
    fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    fontSize: "13px"
    lineHeight: 1.5
  label:
    fontSize: "11px"
  timestamp:
    fontFamily: "ui-monospace, SFMono-Regular, Consolas, monospace"
    fontSize: "12px"
rounded:
  shell: "16px"
  workspace: "10px"
  control: "7px"
  severity: "4px"
spacing:
  gap-sm: "6px"
  gap-control: "10px"
  inset-mobile: "18px"
  inset-desktop: "28px"
components:
  button-action:
    backgroundColor: "{colors.control-bg}"
    textColor: "{colors.control-text}"
    rounded: "{rounded.control}"
    padding: "8px 11px"
  button-action-hover:
    backgroundColor: "{colors.control-hover}"
  input-filter:
    backgroundColor: "{colors.field-bg}"
    textColor: "{colors.monitor-text}"
    rounded: "{rounded.control}"
    padding: "9px 10px"
    height: "38px"
  card-workspace:
    backgroundColor: "{colors.log-bg}"
    rounded: "{rounded.workspace}"
  chip-error:
    backgroundColor: "{colors.error-bg}"
    textColor: "{colors.error-text}"
    rounded: "{rounded.severity}"
    padding: "3px 6px"
---

# Design System: Mehmet Arda Studio — Monitoring

## Overview

**Creative North Star: "Operate"**

This is an evidence-based record of `/admin/izleme`, including its security-category view, and the existing admin shell immediately around it. It is not a redesign specification for the public site or other admin pages. No PRODUCT.md was supplied, so this document makes no broader product or audience claims.

The monitoring center is a dense navy operations surface inside the incumbent white sidebar and topbar. Clear numeric summaries, measured traffic bars, labeled severity, and a selectable event feed lead to an inspector for record details and triage. The dark content region is the confirmed surface direction; it does not replace the surrounding identity.

**Key Characteristics:**
- White incumbent navigation around a contained navy monitoring surface.
- Pale-blue traffic bars and restrained operational accents.
- Explicit connection cadence, readable severity labels, and actionable records.
- A stacked mobile flow with the inspector below the feed.

Observed sources: `resources/css/monitoring.css`, `resources/css/app.css`, `resources/js/Pages/Admin/Monitoring.tsx`, `resources/js/Layouts/AdminLayout.tsx`, `resources/js/Components/AnalyticsConsent.tsx`, and the font link in `resources/views/app.blade.php`. Visual evidence: `.impeccable/review/desktop.png` and `.impeccable/review/mobile.png`, captured from the isolated E2E environment. Captured counts are test data, not a production baseline.

## Colors

The monitoring palette uses deep navy layers, cool pale-blue text and accents, and distinct semantic severity pairs. Frontmatter values are normative for this scoped record.

### Primary
- **Monitoring Accent:** activity icon, selected-tab underline, focus outline, and inspector links.
- **Traffic Blue:** nonzero measured traffic bars; zero buckets use a muted blue baseline.

### Neutral
- **Monitoring Navy:** the contained content background.
- **Log Navy:** recessed event feed and JSON surface.
- **Inspector Navy:** the selected record panel.
- **Cool White / Muted Blue:** primary text versus explanatory copy and labels.
- **Control Navy / Slate Border:** outlined fields and action buttons.
- **Shell White:** the existing sidebar and topbar remain visually separate from monitoring.

Severity is semantic: INFO uses blue, SUCCESS green, WARNING amber, ERROR muted red, and CRITICAL a stronger red with white text. The literal severity label accompanies the color. These are event states, not additional brand accents.

**The Contained Navy Rule.** Keep monitoring's dark palette within its content surface; retain the existing white admin shell.

## Typography

The active sans stack is Plus Jakarta Sans with system fallbacks. The app font link also loads Manrope; the inspected monitoring and admin styles do not assign it to a role. Preserve the existing font loading without inventing a second active type role.

The main monitoring headline uses the frontmatter headline role. Section headings use the title role; smaller chart headings and controls sit at (12px), supporting labels at (10–11px), and metrics at (30px), reducing to (28px) on narrow screens. Metric numerals use tabular spacing.

Timestamps use monospace with tabular numerals. Observed source exceptions: severity badges also use monospace at (10px), and JSON uses monospace at (10px) with a line height of (1.7). This records the implementation rather than claiming the intended timestamp-only restriction was fully applied. Do not expand monospace to ordinary headings, metrics, or descriptive copy.

## Layout

The incumbent shell has a desktop sidebar (256px) at the existing large breakpoint and a white topbar (64px). Below that breakpoint, the sidebar becomes a menu-triggered overlay. Main content uses (16px) padding, increasing to (32px) at the small breakpoint.

Inside monitoring, desktop horizontal insets are generally (28px). Six metrics form one row at wide sizes; charts split (1.5fr / 1fr). Filters lead directly into a bordered event workspace. At wide sizes, the open inspector occupies a (320px) second column; the feed has a maximum height of (510px).

At (1399px) and below, metrics become three columns, filters three columns, and the inspector stacks below the feed. At (767px) and below, metrics and filters become two columns, search spans both columns, charts and breakdowns stack, and event rows use a compact two-column structure instead of the desktop table header. Horizontal insets reduce to (14–18px). Long record text and JSON wrap. The supplied (390px) screenshot shows the stacked flow without horizontal overflow.

## Elevation & Depth

Monitoring uses tonal layering and thin borders instead of raised card shadows. The log is recessed, the inspector uses a lighter navy, and selection adds a blue-toned row fill. Sticky feed headings remain legible over scrolling rows. The existing mobile navigation overlay uses a dark scrim and the incumbent Tailwind shadow; that shell behavior is separate from monitoring's flat surfaces.

## Shapes

The contained monitoring shell has softly curved corners; the workspace is slightly tighter, and controls tighter again. Severity labels are small rectangular tags with modest corner rounding. Thin borders and dividers organize dense content. The shell and workspace clip their internal corners while the feed scrolls independently.

## Components

### Buttons and tabs

Action buttons are compact, outlined navy controls with icon-and-text labels where space permits. Hover uses the brighter control fill; disabled controls have opacity (.45) and a not-allowed cursor. Monitoring keyboard focus uses a (2px) accent outline offset by (3px). Tabs have a bottom underline for the active view. Transitions affect background and text color over (.15s); reduced-motion preferences disable them.

### Fields

Search, category, severity, status, and date fields use visible labels above outlined dark inputs. Fields have a consistent height and shrink within their grid cells. Search includes an inset icon and a (350ms) debounce. Clearing filters is an explicit action.

### Severity chips

All five levels retain their literal text. Chips describe severity; they are not themselves triage actions. Repetition counts and review status are separate information.

### Event workspace and inspector

Rows expose time, severity, message, source/path, HTTP information where present, and review status. Selecting a row highlights it and opens record details. The inspector offers a close control, metadata, safe JSON disclosure, and an event link; authorized managers can change triage status. Category and event deep links are synchronized with navigation, and stale inspector responses are guarded by request sequence and cancellation.

### Connection and traffic

Connection copy explicitly names the normal (8-second) polling interval. Pause/resume, immediate refresh, older-record navigation, and permitted CSV export are operational controls. Background tabs suspend polling; failures show retry state and explanatory copy. Historical pages identify their state rather than implying a live stream.

Traffic charts use actual returned buckets, total labels, and accessible descriptions; empty data has explanatory copy. Consent and measurement caveats stay visible near the metrics. Active sessions are labeled as estimates, and browser-reported form events are not presented as confirmed email delivery.

### Existing navigation and public consent

The sidebar preserves its existing blue active state, rounded links, small icons, and white surface. Monitoring and security entries are permission-dependent. Public analytics consent uses the existing light visual language and does not render on admin routes; it is not part of the dark monitoring component family.

## Do's and Don'ts

### Do:
- **Do** preserve the white incumbent shell around the navy monitoring content.
- **Do** pair severity colors with explicit severity text.
- **Do** retain polling cadence, paused/history states, and measurement caveats.
- **Do** stack the inspector and wrap record content at narrow widths.
- **Do** use real returned traffic buckets and meaningful empty states.

### Don't:
- **Don't** apply this route's dark palette to the public site or unrelated admin pages.
- **Don't** add decorative charts, invented metrics, or generated illustrations to this operational surface.
- **Don't** expand monospace into ordinary headings, metrics, or descriptive copy.
- **Don't** imply browser reports verify delivery, unique people, or attack detection.
