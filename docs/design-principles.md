# Design principles (revision 2)

What we applied to the Willamette Falls Roofing site, and where it came from. Read this before changing the look.

## Sources

- **Impeccable** by Paul Bakaus: an open-source design skill for AI coding agents, built on Anthropic's frontend-design skill. https://impeccable.style and https://github.com/pbakaus/impeccable (we used `skill/SKILL.src.md`, `reference/craft-floor.md`, `reference/mode-persuade.md`).
- **Anthropic's frontend-design skill**: https://github.com/anthropics/skills/tree/main/skills/frontend-design
- **Refactoring UI** (Adam Wathan and Steve Schoger): https://refactoringui.com. Design in grayscale first, use fixed scales for type/space/color, and build hierarchy with size, weight and contrast before color.

## The brief, in one line

A **Persuade** surface (Impeccable's term): a homeowner with a roof problem should understand the offer in one line and see one obvious action, which is calling. Everything else supports that.

## Decisions

**Palette: Pacific Northwest, restrained, one accent.**

| Token | Hex | Role |
|---|---|---|
| Evergreen | `#173a2d` | Brand, dark sections, the call panel |
| Ink | `#1b2622` | Body text (not a pure-black stand-in) |
| Slate/muted | `#55635e` | Secondary text (4.5:1+ on paper and fog) |
| Fog | `#eceeea` | Alternate section ground |
| Paper | `#f7f7f4` | Page ground (cool off-white, deliberately not the cream every AI template uses) |
| Ochre | `#e2a33b` | **Calls only.** Phone buttons, focus rings, text selection |

Ochre on ink text is about 8:1. The accent means "call", so it isn't spent on decoration.

**Type: two clearly different families, self-hosted.**
- Headlines: *Young Serif*, a sturdy, slightly old-fashioned serif that suits craftsman-era south metro houses.
- Text and UI: *Schibsted Grotesk* (variable), a plain-spoken newspaper grotesk.
- A fluid modular scale (`--step--1` … `--step-4`), body at 17–18px, measure under ~72 characters, headings balanced, tracking no tighter than -0.02em.
- No small all-caps label (eyebrow) above headings, no one-word color accents in headlines, no arrows tacked onto links, no "A · B · C" meta strings. Impeccable and Anthropic both flag these as the commonest tells of a generated page.

**Layout: varied sections, not a card kit.**
- Hero: a full-bleed photograph with copy anchored bottom-left on phones and left on desktop. One big call button and one secondary action.
- Problem section: one large photo and two smaller photo-and-text rows instead of three identical icon cards.
- "How it works" uses numbers because it really is a sequence (call, inspection, written bid).
- Services are an index list with photo thumbnails; cities are photo cards, with the three primary cities larger.
- Content pages: a photo beside the heading, readable prose, and a sticky call panel on desktop.
- Left-aligned throughout; nothing important is centered by default.

**Spacing:** an 8-point rhythm (`--s1` … `--s7`), tight inside groups and generous between sections, with more space above a heading than below it.

**Motion: one authored moment.** On page load the hero photo settles and the hero copy rises once (exponential ease-out). Hover states are small, and the mobile call bar slides in only after the hero's own call button scrolls away. `prefers-reduced-motion` turns the load animation off.

**Browser surfaces are themed:** focus rings, text selection, caret, scrollbar, `accent-color`, underline offset, and tabular numerals in cost tables.

**Accessibility floor:** 4.5:1 body contrast, 44px+ tap targets (call buttons are 52–60px), visible keyboard focus, real alt text, one `h1` per page, semantic landmarks.

**Images:** real photos (see `docs/image-credits.md`), served as AVIF/WebP with responsive widths, explicit width and height, and lazy loading below the fold. No photo is presented as anyone's crew or work.

## What we didn't do, on purpose

No gradient text, glassmorphism cards, purple or neon accents, emoji icons, hero-metric stat blocks, numbered section labels on non-sequences, or identical rounded cards with the same soft shadow.
