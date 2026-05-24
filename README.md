<div align="center">

# Visyra

### AI-Powered CIFAR-10 Image Classification Platform

*A modern, futuristic frontend prototype for the ICT 120 Final Project*

![Next.js](https://img.shields.io/badge/Next.js_15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

</div>

---

## Project Overview

**Visyra** is the frontend prototype for an AI-powered image classification system built on the CIFAR-10 dataset. It presents all required capstone deliverables — evaluation metrics, confusion matrix, validation runs, and live inference — in a polished, startup-quality web interface.

This is a **frontend-only prototype**. It uses realistic mock data that mirrors the actual output of a trained CNN, and is architected to accept a real FastAPI/TensorFlow backend with minimal changes.

---

## Product Vision

The goal of Visyra is to make machine learning feel **tangible and beautiful**. Instead of presenting a Jupyter notebook, we give reviewers a living, interactive platform that:

- Demonstrates the full ML evaluation pipeline visually
- Lets anyone upload an image and experience AI inference (simulated)
- Shows model performance honestly through metrics and the confusion matrix
- Feels like a real startup product — not a student submission

---

## Tech Stack

### Frontend Framework — Next.js 15 (App Router)
Next.js provides server-side rendering, file-based routing, and seamless TypeScript integration. The App Router pattern enables clean component architecture with server/client separation. Chosen for its production-grade performance characteristics and industry adoption.

### Language — TypeScript
Strong typing eliminates a class of runtime bugs, improves IDE autocomplete, and makes the codebase self-documenting. Non-negotiable for any project of this scope.

### Styling — Tailwind CSS
Utility-first CSS accelerates development while enforcing consistency. No custom CSS spaghetti. The design token system maps directly to Tailwind's config.

### Animations — Framer Motion
The gold standard for React animations. Declarative `initial`/`animate`/`exit` API produces smooth, interruptible transitions without manual imperative code. Powers every section entrance, hover lift, and loading state.

### Charts — Recharts
A composable React charting library built on D3. Used for the training history line chart and the confidence radar chart. Lightweight and fully customizable.

### Icons — Lucide React
Clean, consistent 24px icon set with 1,000+ icons. Tree-shakeable — only icons you import are bundled.

### Canvas Background — Browser Canvas API
The neural network particle animation uses raw Canvas 2D rather than a heavy library, keeping the bundle lean while achieving the ambient depth effect.

---

## Folder Structure

```
visyra/
├── app/
│   ├── layout.tsx          # Root layout with font loading
│   ├── page.tsx            # Main page — assembles all sections
│   └── globals.css         # Design tokens, animations, utilities
├── components/
│   ├── Background.tsx      # Canvas particle system + aurora blobs
│   └── sections/
│       ├── Navbar.tsx          # Sticky glassmorphism navigation
│       ├── Hero.tsx            # Landing hero with CTA
│       ├── UploadPredict.tsx   # Drag-and-drop upload + mock inference
│       ├── Metrics.tsx         # Model performance cards + training chart
│       ├── ConfusionMatrix.tsx # Interactive 10×10 heatmap
│       ├── ValidationRuns.tsx  # 5 sample validation cards
│       └── ClassGallery.tsx    # CIFAR-10 class showcase
├── constants/
│   └── cifar10.ts          # CIFAR-10 class definitions
├── mock-data/
│   └── index.ts            # Realistic mock metrics, matrix, validation runs
└── lib/
    └── utils.ts            # cn(), formatPercent(), getConfidenceColor()
```

### Why This Structure?

- **`app/`** — Next.js App Router convention. Only routing/layout concerns live here.
- **`components/sections/`** — Each major page section is isolated. Sections can be reordered, hidden, or swapped without touching others.
- **`constants/`** — Class definitions are defined once and imported everywhere. Change a class name in one place and it updates across the whole app.
- **`mock-data/`** — All fake data is centralized. When the real backend is ready, replace this file with API calls — nothing else changes.
- **`lib/`** — Shared utilities with no UI concerns.

---

## Setup & Installation

### Prerequisites
- Node.js 18.17+ or 20+
- npm 9+ or pnpm/yarn

### Install

```bash
git clone https://github.com/your-org/visyra.git
cd visyra
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm run start
```

### Type Check

```bash
npm run type-check   # or: npx tsc --noEmit
```

### Lint

```bash
npm run lint
```

---

## Frontend Architecture Overview

### Component Philosophy

Every section is a **self-contained, scroll-animated module** using Framer Motion's `whileInView` with `once: true`. Sections animate in once as the user scrolls — never replay, never distract.

### State Management

The upload/predict flow uses local `useState` — no global store needed. If history or user sessions are added later, Zustand is the recommended addition (zero config, hooks-first).

### Animation System

All entrance animations follow the same pattern:
```tsx
initial={{ opacity: 0, y: 30 }}
whileInView={{ opacity: 1, y: 0 }}
viewport={{ once: true }}
transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
```

Hover lifts use `whileHover={{ y: -4 }}`. This consistency makes the product feel intentional.

### Background System

Three layers:
1. CSS gradient (base lavender-to-white)
2. CSS animated aurora blobs (two opposing radial gradients)
3. Canvas particle system (60 nodes, neural net lines between nearby pairs)

Performance: particles run at ~60fps via `requestAnimationFrame`, pause when tab is hidden, and reduce count on small screens.

---

## UI/UX Philosophy

**One primary action per screen.** The upload zone is the only thing that matters on the Predict section.

**Animate meaning, not decoration.** Every animation communicates state change. Confidence bars filling = "here's the answer." Neural orbit = "the model is working."

**Honest about uncertainty.** Confidence scores below 65% show an amber warning. Low recall classes are clearly visible in the per-class chart.

**Accessible by default.** Every interactive element has focus states. The confusion matrix has ARIA labels. Color is never the only signal.

---

## Mock Data Strategy

All mock data in `mock-data/index.ts` reflects realistic CIFAR-10 CNN outputs:

- **78.4% test accuracy** — achievable baseline CNN on CIFAR-10 with augmentation
- **Confusion matrix** — cat/dog/deer/horse rows show higher off-diagonal values, matching known model weaknesses
- **Validation runs** — confidence scores vary between 58–94% to demonstrate realistic variance
- **Training curves** — show correct convergence behavior (decreasing loss, narrowing train/val gap)

---

## Backend Integration Plan

When the FastAPI backend is ready, replace `mock-data/index.ts` with API calls:

```
POST /api/predict
  Input:  multipart/form-data { image: File }
  Output: { class: string, confidence: number, all_scores: number[], inference_ms: number }

GET /api/metrics
  Output: { accuracy, precision, recall, f1, confusion_matrix, per_class_accuracy }
```

The `UploadPredict` component calls `runInference()` — replace its internals with a `fetch('/api/predict', ...)` and the rest of the UI stays identical.

---

## TensorFlow / FastAPI Integration Plan

```
TensorFlow (Python, Google Colab)
  → Train CNN on CIFAR-10 (20 epochs, Adam, categorical_crossentropy)
  → Save as model.keras

FastAPI (Python)
  → Load model once at startup
  → POST /api/predict: receive image → resize to 32×32 → normalize → model.predict()
  → Return JSON with class name + softmax probabilities

Next.js Frontend
  → Replace mock randomPrediction() with fetch to FastAPI endpoint
  → No other changes needed
```

Deployment stack:
- Frontend → **Vercel** (free, instant CI/CD)
- Backend → **Railway** or **Render** (free tier FastAPI hosting)

---

## Deployment

### Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Vercel auto-detects Next.js and deploys with zero config. Every `git push` to `main` triggers a new deploy.

### Environment Variables (for future backend)

```env
NEXT_PUBLIC_API_URL=https://your-fastapi.railway.app
```

---

## Project Info

- **Course:** ICT 120 — BSCS 3B
- **Dataset:** CIFAR-10 (Krizhevsky, 2009)
- **Model:** Custom CNN + experiments (Dropout, Augmentation, MobileNetV2 transfer learning)
- **Frontend Status:** Complete prototype with mock data
- **Backend Status:** In progress — TensorFlow training complete, FastAPI integration pending

---

<div align="center">
  <p><em>"This doesn't look like a student project."</em></p>
  <p>That was the goal.</p>
</div>
