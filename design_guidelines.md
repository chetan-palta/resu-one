# Digital Resume Builder - Design Guidelines

## Design Approach: Productivity-Focused System

**Foundation:** Drawing from Linear's professional typography, Notion's form clarity, and Canva's document editing patterns. This is a utility-first productivity tool where efficiency, readability, and professional polish are paramount.

## Typography System

**Font Stack:**
- Primary: Inter (Google Fonts) - All UI elements, form labels, navigation
- Resume Preview: Georgia or Times New Roman - For resume templates to ensure ATS compatibility

**Hierarchy:**
- Page Titles: text-3xl font-bold tracking-tight
- Section Headers: text-xl font-semibold 
- Form Labels: text-sm font-medium
- Helper Text: text-sm text-gray-600
- Resume Content: text-base leading-relaxed
- Buttons/CTAs: text-sm font-medium

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, and 16 exclusively
- Component padding: p-4, p-6, p-8
- Section gaps: gap-6, gap-8
- Margins: mt-8, mb-12, mx-4

**Grid Structure:**
- Dashboard: Single column mobile, grid-cols-2 lg:grid-cols-3 for resume cards
- Form Builder: Two-panel layout (60/40 split) - Form on left, Live Preview on right
- Mobile: Stack panels vertically, preview collapsible/toggleable

**Container Widths:**
- Dashboard/Main Pages: max-w-7xl mx-auto px-4
- Form Builder: Full width with internal max-w constraints
- Resume Preview Panel: max-w-2xl (matches standard resume width)

## Core Components

### Navigation Header
Top bar with logo left, navigation center (Dashboard, New Resume), user menu right. Height h-16, border-b, sticky positioning. Include logout and settings in dropdown.

### Authentication Pages
Centered card (max-w-md) with clean form layout. Title at top, form fields with generous spacing (space-y-6), primary CTA button full width, secondary link below.

### Dashboard
Grid of resume cards, each with:
- Resume title (text-lg font-semibold)
- Last modified timestamp (text-sm)
- Template indicator badge
- Quick actions: Edit, Export (PDF/DOCX), Duplicate, Delete icons in card footer
- Hover state: subtle elevation (shadow-md)
- Empty state: Large centered message with "Create Your First Resume" CTA

### Form Builder (Core Experience)
**Left Panel - Form:**
- Sticky section navigation sidebar (Education, Experience, Skills, etc.)
- Accordion-style sections, one open at a time
- Repeatable fields with "+ Add" buttons prominent
- Field groups with clear visual separation (border-l-4 on active section)
- Form inputs: h-10 for text, h-32 for textareas
- Inline validation messages below fields

**Right Panel - Live Preview:**
- Sticky toolbar at top: Template switcher dropdown, Export buttons
- Resume preview in actual document dimensions (8.5x11 ratio)
- Shadow/border treatment to distinguish from background
- Scale to fit panel while maintaining aspect ratio

### Template Switcher
Dropdown showing thumbnail previews of two templates:
1. **Classic** - Traditional chronological, serif headers
2. **Modern** - Clean sans-serif, subtle accent borders

### Export Modal
Triggered by export buttons. Shows:
- Format selection (PDF/DOCX radio buttons)
- Preview thumbnail
- Export progress indicator
- Success state with download link

### ATS Keyword Analysis Panel
Collapsible section below preview or separate tab:
- Job description textarea input
- "Analyze" button
- Results: Score gauge (0-100) + Top 10 keywords as tags
- Recommendations list with checkboxes

## Form Input Design
- All inputs: rounded-md border border-gray-300, h-10 px-3
- Focus state: ring-2 ring-blue-500
- Labels: mb-2 block
- Required field indicator: Asterisk in label
- Array/repeatable sections: Each item in rounded-lg border p-4 with remove icon top-right

## Button Styles
- Primary CTA: px-4 py-2 rounded-md font-medium (Export, Save, Create)
- Secondary: px-4 py-2 rounded-md border font-medium (Cancel, Template Switch)
- Icon-only: p-2 rounded-md (Delete, Edit, Add Section)
- Destructive actions: Same structure, red treatment in engineering

## Card Components
Resume cards and section cards:
- rounded-lg border p-6
- Hover: shadow-lg transition-shadow
- Header with flex justify-between
- Footer with actions flex gap-2

## Responsive Breakpoints
- Mobile (base): Single column, stacked panels, collapsible preview
- Tablet (md: 768px): Two-column dashboard grid
- Desktop (lg: 1024px): Side-by-side form/preview, three-column dashboard
- Wide (xl: 1280px): Optimal two-panel form builder experience

## State Indicators
- Loading: Subtle spinner, skeleton screens for cards
- Success: Checkmark icon with message, auto-dismiss
- Errors: Inline below field, persistent until corrected
- Empty states: Centered with icon, descriptive text, primary action

## Accessibility
- All form inputs with labels and proper ARIA attributes
- Keyboard navigation through form sections
- Focus indicators on all interactive elements
- Screen reader announcements for dynamic content updates

## Images
No hero image required - this is a utility application. Use simple icon/illustration for empty states only.

## Critical Layout Rules
- Form builder is the core experience: Prioritize generous space for form fields and preview
- Never sacrifice preview visibility for form density
- Maintain resume preview at readable scale (minimum 70% of actual size)
- Dashboard should feel organized, not cluttered - adequate whitespace between cards
- Mobile: Preview accessible via toggle button, not permanently hidden