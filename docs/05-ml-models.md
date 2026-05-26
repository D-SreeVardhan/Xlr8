# ML Models

No long training is used. Models are either genuinely pretrained or instant-fit on synthetic data at backend startup.

## Model Registry

| Model | Library | Type | Purpose | Fit Time Target |
|---|---|---|---|---|
| TPA Denial Risk | XGBoost | instant-fit classifier | Predict claim denial before TPA submission | < 2s |
| Nurse Attrition Risk | scikit-learn Logistic Regression | instant-fit classifier | Predict resignation risk over 60 days | < 1s |
| Surge Forecast | Prophet | time-series forecast | Predict admission spikes from AQI, festivals, monsoon | < 2s |
| Cascading Stress Score | IsolationForest + rules | anomaly / composite score | Detect compounded operational strain | < 1s |
| Patient Feedback Sentiment | HuggingFace Transformers | pretrained multilingual sentiment | Score feedback text in English/Hindi | no training |

## Features

### TPA Denial Risk

- TPA
- Department
- Procedure group
- Claim amount
- Documentation completeness
- Pre-auth status
- Payer history
- Discharge hour

### Nurse Attrition Risk

- Tenure band
- Overtime hours
- Consecutive night shifts
- Leave balance
- Unit acuity
- Manager turnover rate
- Commute band
- Prior resignation pattern in unit

### Surge Forecast

- Historical admissions
- Festival calendar
- AQI proxy
- Monsoon flag
- Day of week
- Department seasonality

## Evaluation for Prototype

- Denial / attrition: ROC-AUC and top-risk precision on synthetic holdout.
- Surge: MAPE on last 14 synthetic days.
- Stress score: manual threshold scenario tests.
- Sentiment: sample qualitative checks.
