import { AppSettings, PromptTemplate } from './types';

export const GEMINI_MODEL_ID = 'gemini-2.5-flash';

const REACT_TEMPLATE = `Role: Senior Frontend Architect & UI/UX Specialist.
Objective: Analyze the provided UI context (Screenshot/URL) and produce a structured "Technical Design Document" (TDD) that I can hand off to a developer or AI coding agent.

Output Structure (Use Markdown):

# Technical Design Document

## 1. Design System Specification
*   **Color Palette**: Extract primary, secondary, background, and accent colors. Provide approximate Hex codes and suggest semantic names (e.g., \`primary-500\`, \`surface-card\`).
*   **Typography**: Identify font families (serif/sans), approximate weights (400, 600, 700), and hierarchy scales.
*   **Spacing & Layout**: Analyze padding/margin consistency (e.g., "appears to use 8px/16px/24px grid").
*   **Visual Effects**: Note rounded corners (radii), shadow depths, and border styles.

## 2. Page Section Analysis (Top to Bottom)
**IMPORTANT**: Divide the entire page into logical sections from top to bottom. For each section, provide:

### Section [N]: [Section Name] (e.g., "Hero Section", "Features Grid", "Footer")
*   **Position**: Describe where this section is located (e.g., "Full-width, below navbar")
*   **Layout Type**: Grid / Flexbox / Stack / Absolute positioning
*   **Dimensions**: Approximate height, max-width, padding
*   **Background**: Color, gradient, or image
*   **Key Components**: List the main UI elements in this section
*   **Responsive Behavior**: How should this section adapt on mobile?

(Repeat for all major page sections)

## 3. Component Architecture
Provide a tree structure of the UI components.
Example:
- \`AppLayout\`
  - \`Navbar\` (Sticky)
  - \`HeroSection\`
    - \`CallToAction\`
  - \`FeatureGrid\`
    - \`FeatureCard\`
  - \`Footer\`

## 4. UI/UX Patterns
*   **Responsiveness**: How should it behave on mobile vs desktop?
*   **Interactions**: Hover states, active states, focus rings.
*   **Accessibility**: ARIA labels needed, contrast requirements.

## 5. Layout & Style Blueprint
Provide a detailed visual structure guide:

\`\`\`
+--------------------------------------------------+
|                    NAVBAR                         |
|  [Logo]                    [Nav Items] [CTA Btn]  |
+--------------------------------------------------+
|                                                   |
|                  HERO SECTION                     |
|     [Headline - text-5xl font-bold]               |
|     [Subheadline - text-xl text-gray-600]         |
|     [CTA Button - px-8 py-4 bg-primary rounded]   |
|                                                   |
+--------------------------------------------------+
|                 FEATURES GRID                     |
|  +------------+  +------------+  +------------+   |
|  | Feature 1  |  | Feature 2  |  | Feature 3  |   |
|  | [Icon]     |  | [Icon]     |  | [Icon]     |   |
|  | [Title]    |  | [Title]    |  | [Title]    |   |
|  | [Desc]     |  | [Desc]     |  | [Desc]     |   |
|  +------------+  +------------+  +------------+   |
+--------------------------------------------------+
|                    FOOTER                         |
+--------------------------------------------------+
\`\`\`

**Key Tailwind Classes Summary**:
- Container: \`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8\`
- Section spacing: \`py-16 md:py-24\`
- Grid layout: \`grid grid-cols-1 md:grid-cols-3 gap-8\`
- (Add more specific classes based on the design)

## 6. Implementation Prompt (The "Master Prompt")
> Write a single, self-contained, extremely detailed prompt block below.
> This prompt will be copied and pasted to an AI Coding Agent.
> It MUST instruction the agent to:
> - Use **React 19**, **TypeScript**, **Tailwind CSS**, and **Lucide React** (icons).
> - Use \`shadcn/ui\` naming conventions if applicable.
> - Implement the exact design system described above.
> - **Follow the Layout Blueprint exactly** - maintain the same visual structure.
> - Provide the full code for ALL page sections.
> - Include responsive breakpoints (sm, md, lg, xl).

(Put the Master Prompt inside a code block)`;

const HTML_TEMPLATE = `Role: Web Standards Specialist.
Objective: Create a blueprint for a high-performance, semantic HTML/CSS implementation.

Output Structure:

# Web Standards Analysis

## 1. Semantic Structure
*   Identify usage of \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<aside>\`, \`<footer>\`.
*   Outline the document outline (H1-H6 hierarchy).

## 2. Page Section Analysis (Top to Bottom)
For each major section, describe:
- Section type (header, hero, features, testimonials, footer, etc.)
- Layout method (Grid vs Flexbox)
- Spacing and dimensions
- Background treatment

## 3. Modern CSS Strategy
*   **CSS Variables**: Define the root variables for colors and spacing.
*   **Layout**: Specify Grid vs Flexbox usage for specific sections.
*   **Mobile-First**: Describe media query breakpoints.

## 4. Layout Blueprint
Provide an ASCII diagram showing the page structure with approximate CSS classes/properties.

## 5. Implementation Guide
Provide a detailed prompt that asks for:
- Vanilla HTML5
- Modern CSS (Flex/Grid, Variables, no frameworks)
- Mobile-first approach
- Clean, commented code`;

const DESIGN_SYSTEM_TEMPLATE = `Role: Lead UI Designer.
Objective: Reverse-engineer the Design System from the visual input. Do not generate code; generate a Style Guide.

Output Structure:

# Design System Analysis

## 1. Brand Identity
*   **Mood**: (e.g., Professional, Playful, Minimalist)
*   **Core Colors**: Swatches with Hex codes.
*   **Neutral Palette**: Slates, Grays, Zincs.

## 2. UI Elements
*   **Buttons**: Describe primary, secondary, ghost, and destructive variants (padding, radius, text size).
*   **Inputs**: Border styles, focus states, error states.
*   **Cards**: Backgrounds, borders, shadows.

## 3. Typography Scale
*   H1, H2, H3, Body, Caption styles with specific sizes and weights.

## 4. Spacing System
*   Define the spacing scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px)
*   Section padding patterns
*   Component internal spacing

## 5. Layout Patterns
*   Container max-widths
*   Grid column patterns (12-col, auto-fit, etc.)
*   Common section layouts (hero, features, testimonials, CTA, footer)

## 6. Iconography & Imagery
*   Icon style (outline, solid, duotone).
*   Image aspect ratios and corner treatments.`;

export const DEFAULT_TEMPLATES: PromptTemplate[] = [
  { id: 'react-tech-spec', name: 'React Technical Spec (Recommended)', content: REACT_TEMPLATE },
  { id: 'design-system', name: 'Design System Extraction', content: DESIGN_SYSTEM_TEMPLATE },
  { id: 'html-semantic', name: 'Semantic HTML & CSS', content: HTML_TEMPLATE },
];

export const DEFAULT_SETTINGS: AppSettings = {
  apiKey: '',
  activeTemplateId: 'react-tech-spec',
  templates: DEFAULT_TEMPLATES
};
