# GitaQuest — Architecture, Design Specification & User Flow

> **App Identity:** GitaQuest  
> **Tagline:** Read. Reflect. Grow.  
> **Design Aesthetic:** Minimal, elegant modern Indian aesthetic with forest green (`#1E3A2F`), warm ivory (`#FBF8F2`), muted gold (`#D4A359`), and crisp white card design.

---

## 1. Executive Summary

**GitaQuest** is an authentic, offline-first mobile web application (packaged with Capacitor for Android). It offers a peaceful and deeply focused environment for reading and meditating upon all **18 chapters and 701 authentic verses** of Srimad Bhagavad Gita.

### Design Principles: "Show, don't explain"
- Clean typography and rounded card surfaces (`rounded-2xl`, `rounded-3xl`).
- High-contrast readability, concise labels, intuitive icons.
- No filler paragraphs or redundant explanations.
- Authentic scripture data across Sanskrit (with transliteration), Hindi, and English.
- True progress persistence in `localStorage` with offline reading and JSON backup/restore.
- Authentic milestone certificate unlocked exclusively upon completing all 18 chapters.

---

## 2. Color Palette & Design Tokens

```css
/* Forest Green & Warm Ivory Palette */
--color-forest-green:  #1E3A2F;  /* Primary brand & active pills */
--color-forest-light:  #2D5A46;
--color-forest-dark:   #13261F;
--color-warm-ivory:    #FBF8F2;  /* App canvas background */
--color-card-border:   #EAE5DA;  /* Subtle card boundaries */
--color-antique-gold:  #D4A359;  /* Milestone accents & bookmarks */
--color-sage-muted:    #69756F;  /* Subtitles and secondary labels */
```

---

## 3. The 10 Screens Architecture (Matching Design Reference)

### Screen 1: Welcome
- **Visuals:** Custom sacred flame & open book GitaQuest logo in forest green and antique gold, gentle morning Himalayan mist landscape illustration (`gitaquest_welcome_art.svg`).
- **Actions:** Continue with Google (mock demo selector), Continue with email, and "Use without account".
- **Footer:** "Your journey. Your pace. Always private."

### Screen 2: Choose Goal
- **Header:** "Daily goal" — "How many verses do you want to read each day?"
- **Choices:** 3 side-by-side selectable cards:
  - `3 verses` • Gentle start
  - `5 verses` • Balanced (Default)
  - `10 verses` • Deep dive
- **Action:** Forest green `Continue →` button.

### Screen 3: Language
- **Header:** "Reading languages" — "Choose which languages to show in the reader."
- **Toggles:**
  - `सं` Sanskrit (Original shloka)
  - `अ` Hindi (Meaning in Hindi)
  - `A` English (Meaning in English)
- **Action:** Forest green `Continue →` button.

### Screen 4: Visual Tour
- **Visual Slides:** 3 concise slides demonstrating:
  1. "Read three ways" (Sanskrit, Hindi, English card preview)
  2. "Daily streak & goal" (Fire streak & progress ring preview)
  3. "Journey & Certificate" (18 chapter progress & graduation keepsake preview)
- **Controls:** Dot indicators, `Skip` button, and `Next →` / `Get Started` button.

### Screen 5: Home
- **Top Bar:** Time-based greeting ("Good morning ☀️ / Stay on your path") + Streak flame pill (`🔥 X days`).
- **Hero Card:** Forest green landscape overlay with "Continue reading", `Chapter X • Verse Y`, Sanskrit preview, and circular white arrow action button `→`.
- **Dual Metric Cards:**
  - `Today's goal`: `3 / 5 verses` with circular stroke ring.
  - `Your journey`: `2 / 18 chapters` with sprout icon.
- **Section:** `Recently saved` verse card with gold bookmark ribbon.

### Screen 6: Chapter List
- **Header:** Title `Chapters` with search icon trigger.
- **List:** All 18 chapters with circular number badges, English chapter titles, source verse counts, and green checkmark badges for completed chapters.

### Screen 7: Reader
- **Top Bar:** Back chevron `<`, `Chapter X • Verse Y` (`Z of N`), gold bookmark ribbon `🔖`, and menu hamburger `≡` for verse jumping.
- **Main View:**
  - Large Sanskrit Devanagari card + italic transliteration.
  - Collapsible accordion 1: `📙 हिंदी अर्थ`.
  - Collapsible accordion 2: `📗 English Meaning`.
  - Private reflection input.
- **Floating Bottom Bar:** Previous arrow `←`, solid forest-green pill `✔ Mark as read`, and Next arrow `→`.

### Screen 8: Bookmark & Notes
- **Header:** `Saved Verses`.
- **Segmented Control:** `[ Bookmarks | Notes ]` in forest green pill design.
- **Cards:** Verse badge (e.g. `2:47`), Sanskrit excerpt, reflection subtext, and gold bookmark ribbon icon.

### Screen 9: Chapter Completed
- **Atmosphere:** Deep forest night canvas (`gitaquest_celebration_bg.svg`) with golden stardust.
- **Emblem:** GitaQuest gold flame & book emblem.
- **Milestone:** Circular progress badge `X / 18 chapters` (`Y% of your journey`).
- **Reflection:** "What stayed with you?" input card.
- **Actions:** Gold pill `Continue journey →` + "View chapter summary".

### Screen 10: My Journey & Certificate
- **Header:** `My Journey` (`X / 18 chapters`).
- **18-Chapter Node Grid:** 6 columns × 3 rows of circular nodes (solid green for completed, bordered green for current, soft ivory for upcoming).
- **Certificate Section:**
  - Header: `Completion Certificate` (`Unlock after completing all 18 chapters`).
  - Certificate Mockup in an ornamental ivory/gold frame.
  - Interactive modal for name personalization and downloadable printable A4 PDF.

---

## 4. Technical Validation Status

- **Unit Tests:** 14/14 Vitest tests passing (`npm test`).
- **Production Bundle:** Vite build compiles cleanly (`npm run build`).
- **Capacitor Sync:** Completed with `npx cap sync android`.
