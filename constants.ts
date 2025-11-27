import { AppSettings, PromptTemplate } from './types';

export const GEMINI_MODEL_ID = 'gemini-2.5-flash';

const REACT_TEMPLATE = `Role: Senior Frontend Architect & UI/UX Specialist.
Objective: Analyze the provided UI context (Screenshot/URL) and produce a structured "Technical Design Document" (TDD) that I can hand off to a developer or AI coding agent.

Output Structure (Use Markdown):

# 📑 Technical Design Document

## 1. 🎨 Design System Specification
*   **Color Palette**: Extract primary, secondary, background, and accent colors. Provide approximate Hex codes and suggest semantic names (e.g., \`primary-500\`, \`surface-card\`).
*   **Typography**: Identify font families (serif/sans), approximate weights (400, 600, 700), and hierarchy scales.
*   **Spacing & Layout**: Analyze padding/margin consistency (e.g., "appears to use 8px/16px/24px grid").
*   **Visual Effects**: Note rounded corners (radii), shadow depths, and border styles.

## 2. 🧩 Component Architecture
Provide a tree structure of the UI components.
Example:
- \`AppLayout\`
  - \`Navbar\` (Sticky)
  - \`HeroSection\`
    - \`CallToAction\`
  - \`FeatureGrid\`
    - \`FeatureCard\`

## 3. 🛡️ UI/UX Patterns
*   **Responsiveness**: How should it behave on mobile vs desktop?
*   **Interactions**: Hover states, active states, focus rings.
*   **Accessibility**: ARIA labels needed, contrast requirements.

## 4. 🚀 Implementation Prompt (The "Master Prompt")
> Write a single, self-contained, extremely detailed prompt block below.
> This prompt will be copied and pasted to an AI Coding Agent.
> It MUST instruction the agent to:
> - Use **React 19**, **TypeScript**, **Tailwind CSS**, and **Lucide React** (icons).
> - Use \`shadcn/ui\` naming conventions if applicable.
> - Implement the exact design system described above.
> - Provide the full code for the main components.

(Put the Master Prompt inside a code block)`;

const HTML_TEMPLATE = `Role: Web Standards Specialist.
Objective: Create a blueprint for a high-performance, semantic HTML/CSS implementation.

Output Structure:

# 🏗️ Web Standards Analysis

## 1. Semantic Structure
*   Identify usage of \`<header>\`, \`<nav>\`, \`<main>\`, \`<article>\`, \`<section>\`, \`<aside>\`, \`<footer>\`.
*   Outline the document outline (H1-H6 hierarchy).

## 2. Modern CSS Strategy
*   **CSS Variables**: Define the root variables for colors and spacing.
*   **Layout**: Specify Grid vs Flexbox usage for specific sections.
*   **Mobile-First**: Describe media query breakpoints.

## 3. Implementation Guide
Provide a detailed prompt that asks for:
- Vanilla HTML5
- Modern CSS (Flex/Grid, Variables, no frameworks)
- Mobile-first approach
- Clean, commented code`;

const DESIGN_SYSTEM_TEMPLATE = `Role: Lead UI Designer.
Objective: Reverse-engineer the Design System from the visual input. Do not generate code; generate a Style Guide.

Output Structure:

# 💅 Design System Analysis

## 1. Brand Identity
*   **Mood**: (e.g., Professional, Playful, Minimalist)
*   **Core Colors**: Swatches with Hex codes.
*   **Neutral Palette**: Slates, Grays, Zincs.

## 2. UI Elements
*   **Buttons**: Describe primary, secondary, ghost, and destructive variants (padding, radius, text size).
*   **Inputs**: Border styles, focus states, error states.
*   **Cards**: Backgrounds, borders, shadows.

## 3. Typography Scale
*   H1, H2, H3, Body, Caption styles.

## 4. Iconography & Imagery
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