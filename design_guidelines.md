# Design Guidelines: Application Management Dashboard

## Design Approach

**Selected Approach:** Design System - Modern Developer Dashboard
**Inspiration:** Linear, Vercel Dashboard, Railway Console
**Justification:** This is a utility-focused productivity tool requiring efficient information display, quick scanning, and frequent interaction. A clean, developer-centric design system approach prioritizes usability and performance.

## Core Design Elements

### A. Typography

**Font Family:** Inter (via Google Fonts CDN)

**Hierarchy:**
- Page Titles: 2xl (24px), semibold (600)
- Section Headers: xl (20px), semibold (600)
- Card Titles/App Names: lg (18px), medium (500)
- Body Text: base (16px), regular (400)
- Labels/Metadata: sm (14px), medium (500)
- Captions/Status Text: xs (12px), regular (400)

### B. Layout System

**Spacing Units:** Tailwind units of 2, 4, 6, 8, 12, 16, 20
- Component padding: p-4 to p-6
- Card spacing: gap-6
- Section margins: mb-8 to mb-12
- Page container: px-6 lg:px-8, py-8

**Container Strategy:**
- Max width: max-w-7xl for main content
- Responsive grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for app cards
- Sidebar (if used): Fixed 240px width on desktop, collapsible on mobile

### C. Component Library

**1. Navigation Header**
- Fixed top bar with app title/logo on left
- Action buttons (+ Add App) on right
- Search bar integrated in header (grows on focus)
- Height: h-16
- Border bottom separator

**2. Filter/Control Bar**
- Horizontal tab-style filters for platforms (All, Lovable, Railway, Custom)
- Status dropdown filter
- Sort options (Recent, A-Z, Status)
- Positioned below header with sticky behavior
- Spacing: py-4

**3. App Cards** (Primary Component)
- Elevated card with subtle border
- Padding: p-6
- Rounded corners: rounded-lg
- Structure:
  - Platform badge (top-right, pill-shaped with icon)
  - App name (lg, semibold)
  - Status indicator (xs pill badge with dot)
  - URL preview (truncated, clickable)
  - Repository link with icon
  - Last updated timestamp (xs, muted)
  - Action menu (3-dot kebab, top-right)
  - Notes preview (if exists, 2 lines max with "Show more")

**4. Platform Badges**
- Small pill badges with platform icons from Heroicons
- Padding: px-3 py-1
- Text: xs, medium
- Icons: w-4 h-4 inline with text

**5. Status Indicators**
- Inline dot + text combination
- Dot size: w-2 h-2, rounded-full
- States: Active, In Development, Paused, Archived
- Spacing: gap-2 between dot and label

**6. Action Buttons**
- Primary CTA (Add App): px-4 py-2, rounded-md, semibold
- Secondary buttons: outline style with border
- Icon buttons for quick actions: p-2, rounded
- External link icons: w-4 h-4

**7. Modal/Drawer for Add/Edit**
- Overlay with backdrop blur
- Form container: max-w-2xl, p-8
- Input fields: w-full, h-10, rounded-md, px-4
- Dropdown selects: Full width with chevron icon
- Textarea for notes: h-24, resize-none
- Action buttons footer: Sticky bottom, right-aligned

**8. Empty State**
- Centered content when no apps exist
- Icon: w-16 h-16
- Heading: xl
- Description: base
- CTA button: "Add Your First App"

**9. Search Results**
- Highlight matching text in results
- "No results" state with clear filters option

**10. Quick Action Menu (Dropdown)**
- Triggered by kebab icon on cards
- Options: Edit, Open Live URL, View Repo, Archive/Delete
- Each item with leading icon from Heroicons

### D. Animations

**Minimal, Performance-Focused:**
- Card hover: Subtle elevation increase (transition-shadow duration-200)
- Button hovers: Background opacity shift (transition-colors duration-150)
- Modal entrance: Fade in backdrop + slide up content (duration-200)
- No scroll-triggered animations
- No complex transitions

## Icons & Assets

**Icon Library:** Heroicons (via CDN)
**Usage:**
- Platform identifiers (Code, Server, Cloud icons)
- External link, edit, trash, search icons
- Status indicators (check, clock, pause, archive)
- Navigation and action buttons

**Platform Logos:** Use simple icon placeholders from Heroicons rather than brand logos

## Information Architecture

**Main Dashboard View:**
1. Header with branding and primary actions
2. Filter/sort controls bar
3. Grid of app cards (3 columns desktop, 2 tablet, 1 mobile)
4. Empty state if no apps

**Card Information Priority:**
- App name (most prominent)
- Platform badge (immediate visual categorization)
- Status (quick health check)
- URLs (primary action - access the app)
- Metadata (supporting context)

## Responsive Behavior

**Mobile (< 768px):**
- Single column cards
- Collapsible filters into dropdown
- Bottom sheet for add/edit forms
- Simplified card layout with stacked information

**Tablet (768px - 1024px):**
- 2-column card grid
- Full filter bar visible
- Standard modal dialogs

**Desktop (> 1024px):**
- 3-column card grid
- All controls visible
- Generous spacing and breathing room

## Accessibility

- Semantic HTML throughout (header, nav, main, article for cards)
- ARIA labels for icon-only buttons
- Keyboard navigation for all interactive elements
- Focus indicators on all focusable elements (ring-2 offset-2)
- Form labels properly associated with inputs
- Status communicated through text, not just visual indicators
