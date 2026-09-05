# Model Training Summary

## Dataset validation

- Records: 2,200
- Input features: 7
- Crop classes: 22
- Records per crop: 100
- Missing values: 0
- Duplicate records: 0
- Split: 1,760 training and 440 testing records
- Split strategy: stratified 80/20, random state 42

## Test-set results

| Model | Accuracy | Macro F1 |
| --- | ---: | ---: |
| Random Forest | 99.32% | 99.32% |
| ANN / Deep Learning | 98.86% | 98.85% |
| SVM | 98.86% | 98.87% |

Random Forest achieved the highest benchmark accuracy. The ANN is retained as
the primary application model because the approved project topic explicitly
requires Deep Learning, and its 98.86% held-out test accuracy is strong.

## ANN architecture

```text
7 inputs
  -> Dense(128, ReLU) + BatchNorm + Dropout(0.30)
  -> Dense(64, ReLU) + BatchNorm + Dropout(0.20)
  -> Dense(32, ReLU) + Dropout(0.10)
  -> Dense(22, Softmax)
```

Training used Adam, sparse categorical cross-entropy, early stopping, learning
rate reduction, batch size 32, and stopped after 51 epochs.

## Important limitation

This result measures performance on a random stratified hold-out from the same
Kaggle dataset. It does not prove equal accuracy on unseen farms, regions,
seasons, or sensor conditions. Real deployment should validate on local field
data and keep an agronomist or farmer in the final decision loop.
