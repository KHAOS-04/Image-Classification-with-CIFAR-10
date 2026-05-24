export const mockMetrics = {
  testAccuracy: 78.4,
  precision: 78.1,
  recall: 78.4,
  f1Score: 78.2,
  inferenceSpeed: 12.3,
  totalParams: "1.25M",
  trainingEpochs: 20,
  batchSize: 64,
};

// 10x10 confusion matrix for CIFAR-10 (rows=actual, cols=predicted)
export const confusionMatrix = [
  [834, 10,  32,  12,  8,   4,   6,   8,  62,  24],
  [8,  892,  4,   5,   3,   2,   3,   2,  18,  63],
  [45,  4,  742,  52,  62,  26,  38,  20,  9,   2],
  [8,   5,   38, 702,  50,  98,  62,  22,  8,   7],
  [10,  2,   48,  42, 796,  28,  42,  26,  4,   2],
  [4,   3,   22,  88,  32, 794,  28,  24,  3,   2],
  [5,   2,   28,  52,  38,  22, 836,  12,  4,   1],
  [8,   3,   18,  28,  32,  28,  10, 856,  8,   9],
  [52, 18,   6,   8,   4,   4,   2,   4, 876,  26],
  [18, 58,   4,   6,   4,   2,   2,   8,  28, 870],
];

export const validationRuns = [
  { id: 1, className: "Airplane",   confidence: 94.2, inferenceMs: 11.2, status: "correct",   emoji: "✈️"  },
  { id: 2, className: "Dog",        confidence: 87.6, inferenceMs: 13.1, status: "correct",   emoji: "🐶"  },
  { id: 3, className: "Cat",        confidence: 71.3, inferenceMs: 10.8, status: "correct",   emoji: "🐱"  },
  { id: 4, className: "Ship",       confidence: 91.8, inferenceMs: 12.4, status: "correct",   emoji: "🚢"  },
  { id: 5, className: "Horse",      confidence: 68.9, inferenceMs: 14.2, status: "correct",   emoji: "🐴"  },
];

export const mockPredictionResults: Record<string, { className: string; emoji: string; confidence: number; allScores: number[] }> = {
  default: {
    className: "Automobile",
    emoji: "🚗",
    confidence: 91.4,
    allScores: [2.1, 91.4, 0.8, 1.2, 0.5, 1.1, 0.6, 0.9, 0.8, 0.6],
  },
};

export const trainingHistory = {
  accuracy: [0.42, 0.51, 0.57, 0.61, 0.64, 0.66, 0.68, 0.70, 0.71, 0.72, 0.73, 0.74, 0.75, 0.75, 0.76, 0.77, 0.77, 0.78, 0.78, 0.784],
  valAccuracy: [0.40, 0.49, 0.54, 0.58, 0.61, 0.63, 0.65, 0.67, 0.68, 0.69, 0.70, 0.71, 0.72, 0.72, 0.73, 0.74, 0.74, 0.75, 0.75, 0.756],
  loss: [1.62, 1.38, 1.22, 1.10, 1.01, 0.94, 0.88, 0.83, 0.79, 0.75, 0.72, 0.69, 0.67, 0.65, 0.63, 0.61, 0.60, 0.58, 0.57, 0.56],
  valLoss: [1.71, 1.45, 1.30, 1.18, 1.09, 1.02, 0.96, 0.91, 0.87, 0.83, 0.80, 0.77, 0.75, 0.73, 0.71, 0.70, 0.69, 0.68, 0.67, 0.66],
};
