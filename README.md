Here’s the updated README written naturally from the developer’s perspective:

# Visyra

**CIFAR-10 Image Classification — ICT 120 Final Project, BSCS 3B**

Visyra is a web app we built around a custom-trained CIFAR-10 CNN. Drop in any image and it classifies it into one of ten categories in real time — entirely inside the browser, no server involved. The model runs via TensorFlow.js using WebGL, so inference takes around 8ms on a decent machine.

We spent probably more time on the frontend than the model itself. That's a deliberate choice — if we're going to submit something, it should actually look like we care about it.

---

## What it does

- Upload any image (or pick a sample) and get an instant CIFAR-10 prediction
- See confidence scores across all 10 classes on an animated radar chart
- Browse the actual training metrics — accuracy/loss curves over 20 epochs, a live confusion matrix, per-class recall breakdowns, and 5 sample validation runs
- Everything runs client-side. No API keys, no backend, no cost to host

---

## The model

We trained a custom CNN from scratch on the full CIFAR-10 dataset — 50,000 training images, 10,000 test images, 10 classes.

### Architecture



Input: [32, 32, 3]  float32, normalised to [0, 1]
│
├── Conv2D(32, 3×3, same) → BatchNorm → ReLU
├── Conv2D(32, 3×3, same) → BatchNorm → ReLU → MaxPool(2×2) → Dropout(0.25)
│
├── Conv2D(64, 3×3, same) → BatchNorm → ReLU
├── Conv2D(64, 3×3, same) → BatchNorm → ReLU → MaxPool(2×2) → Dropout(0.25)
│
├── Conv2D(128, 3×3, same) → BatchNorm → ReLU
├── Conv2D(128, 3×3, same) → BatchNorm → ReLU → MaxPool(2×2) → Dropout(0.30)
│
├── Flatten → Dense(128) → BatchNorm → ReLU → Dropout(0.50)
└── Dense(10) → Softmax


| Stat | Value |
|---|---|
| Total parameters | 552,874 |
| Training epochs | 20 |
| Batch size | 64 |
| Optimizer | Adam |
| Test accuracy | 85.9% |
| Macro F1 | 86.0% |
| Model size (TF.js) | ~2.2 MB |
| In-browser inference | ~8.4 ms (WebGL) |

The hardest classes are cat and dog — they consistently confuse each other, which makes sense. Automobile and truck do the same. Everything else the model handles pretty confidently.

### CIFAR-10 classes

Airplane · Automobile · Bird · Cat · Deer · Dog · Frog · Horse · Ship · Truck

---

## Getting the model into the browser

This was the most annoying part of the project. The model was trained and saved as `cifar10_model.keras` using Keras 3. TF.js can't load that directly — the serialisation formats are incompatible in a few specific ways:

1. **`batch_shape` vs `batch_input_shape`** — Keras 3 uses `batch_shape` in the `InputLayer` config; TF.js only understands `batch_input_shape`. Running it unpatched throws the `"An InputLayer should be passed either a batchInputShape or an inputShape"` error.

2. **`DTypePolicy` objects** — Keras 3 serialises `dtype` as a nested object. TF.js expects a plain `"float32"` string.

3. **Initialiser format** — Keras 3 adds `module` and `registered_name` fields that TF.js doesn't recognise.

4. **`BatchNormalization` axis** — exported as `[-1]` (a list), TF.js needs `-1` (an integer).

5. **`Conv2D` groups** — TF.js 4.x doesn't support the `groups` field.

We wrote a Python patch script that fixes all five issues in the `model.json` before deploying. The weight binary (`group1-shard1of1.bin`) is unchanged.

---

## Tech stack

### Frontend

| | |
|---|---|
| Next.js 15 (App Router) | Routing, static export, server components |
| TypeScript | Type safety everywhere |
| Tailwind CSS | Utility classes, no runtime CSS-in-JS |
| Framer Motion | Section entrances, microinteractions |
| Recharts | Training curves, radar chart |
| Lucide React | Icons |

### Inference

| | |
|---|---|
| @tensorflow/tfjs | In-browser model execution |
| WebGL backend | GPU-accelerated, falls back to CPU on iOS if needed |
| Layers model format | Converted from `.keras`, weights as binary shard |

### Training

| | |
|---|---|
| TensorFlow / Keras 3 | Model definition and training |
| Python 3.12 | Training script + conversion pipeline |
| scikit-learn | Evaluation metrics (confusion matrix, classification report) |

---

## Project structure



visyra/
├── app/
│   ├── layout.tsx          Root layout, fonts, viewport meta
│   ├── page.tsx            Page assembly — all sections in order
│   └── globals.css         Design tokens, animation keyframes, typography scale
│
├── components/
│   ├── Background.tsx      Three-layer cursor-reactive aurora + particle canvas
│   ├── Cursor.tsx          Custom dot + ring cursor (disabled on touch devices)
│   ├── ParallaxSection.tsx Native rAF parallax — no Framer spring lag
│   ├── SectionHeader.tsx   Shared eyebrow + title + subtitle typography
│   └── sections/
│       ├── Navbar.tsx          Sticky glass nav
│       ├── Hero.tsx            Landing — native rAF parallax on three layers
│       ├── UploadPredict.tsx   Upload/sample → auto-infer → result + radar
│       ├── Metrics.tsx         Stat cards + accuracy/loss training curves
│       ├── ConfusionMatrix.tsx 10×10 heatmap, cursor-tracking tooltip
│       ├── ValidationRuns.tsx  5 validation cards + per-class recall bars
│       └── ClassGallery.tsx    CIFAR-10 class showcase
│
├── lib/
│   └── useModel.ts         Model loading hook — lazy import, WebGL/CPU fallback,
│                           warm-up pass, singleton cache, 3-attempt retry
│
├── constants/
│   └── cifar10.ts          Class names, emojis, descriptions
│
├── mock-data/
│   └── index.ts            Real evaluation outputs — confusion matrix, training
│                           history, validation runs, metric cards
│
└── public/
├── visyra.png
└── model/
├── model.json              Patched TF.js layers-model topology
└── group1-shard1of1.bin    CNN weights (~2.2 MB)


---

## Running it locally

You need Node.js 18.17+ and npm 9+.

```bash
git clone https://github.com/your-org/visyra.git
cd visyra
npm install
npm run dev


Open http://localhost:3000. The model (~2.2 MB) downloads once and the browser caches it — subsequent loads run fully offline.

# Production build
npm run build
npm run start

# Type check
npx tsc --noEmit


How inference actually works

When you drop an image or click a sample, this is what happens under the hood:

	1.	File → canvas — The image is drawn into a 32×32 HTMLCanvasElement immediately at upload time, not at inference time. This means preprocessing is essentially free when you click Run.
	2.	Canvas → tensor — tf.browser.fromPixels(canvas) reads the pixels synchronously (canvas is always safe to read; HTMLImageElement is not). We had a bug early on where we were reading from an img element that hadn’t fully committed to the GPU — every prediction came back 0.0% confidence. Canvas fixes that.
	3.	Normalise — pixels.div(255) maps uint8 [0, 255] to float32 [0, 1], matching training.
	4.	Batch dim — expandDims(0) gives us [1, 32, 32, 3].
	5.	Forward pass — model.predict() runs the CNN, returns [1, 10] softmax probabilities.
	6.	Cleanup — Everything inside tf.tidy() is freed automatically. No GPU memory leaks across predictions.

The model loads once per browser session and stays cached at module scope — not in React state, so remounts and strict-mode double effects don’t trigger extra fetches. A warm-up prediction runs right after loading to pre-compile the WebGL shaders, so your first real prediction isn’t slow.

Performance decisions

A few things we did deliberately:

	•	Hero parallax is native rAF, not Framer’s useScroll + useTransform. Framer’s scroll pipeline adds 1–2 frames of lag on iOS because it batches through React’s reconciler. Writing element.style.transform directly in a rAF callback eliminates that.
	•	Confusion matrix tooltip is position: fixed with a lerp-smoothed rAF loop. Fixed positioning takes it out of any stacking context so it’s never clipped. The lerp uses distance-based snap correction — short movements smooth, large jumps instant — so it tracks the cursor closely without feeling mechanical.
	•	Background aurora is CSS-only (transform: translate3d keyframes). No JS touching it per frame.
	•	@tensorflow/tfjs is lazily imported — it’s a ~3 MB bundle that only loads when the user needs it, keeping initial page load fast.

Deploying

Vercel is the easiest option. Push to GitHub, connect the repo, done. The model weights in public/model/ get served from Vercel’s CDN and cached by the browser.

No environment variables needed. Everything is static.

Course info

|         |                                                  |
|---------|--------------------------------------------------|
|Course   |ICT 120 — Intelligent Systems                     |
|Section  |BSCS 3B                                           |
|Dataset  |CIFAR-10                                          |
|Model    |Custom CNN, trained from scratch                  |
|Frontend |Next.js 15 · TypeScript · Tailwind · Framer Motion|
|Inference|TensorFlow.js 4.22 · WebGL · in-browser           |
