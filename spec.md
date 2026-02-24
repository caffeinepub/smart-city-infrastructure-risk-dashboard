# Specification

## Summary
**Goal:** Build a Smart City Infrastructure Risk Dashboard — a full-stack application with a Motoko backend and React/TypeScript frontend — that monitors bridges and roads, computes risk scores, predicts deterioration, estimates maintenance budgets, and visualizes data on a GIS heatmap.

**Planned changes:**

### Backend (Motoko)
- Create a single Motoko actor with stable storage for infrastructure records (bridges/roads) with fields: id, name, structureType, location (area/lat/lon), age, trafficLoadFactor, materialType, environmentalExposureFactor, structuralConditionRating, notes, riskScore, riskLevel
- Expose CRUD operations: `addInfrastructure`, `updateInfrastructure`, `deleteInfrastructure`, `getAllInfrastructure`, `getInfrastructureById`
- Implement civil engineering Risk Index formula: `RiskScore = (AgeFactor×0.30) + (TrafficLoadFactor×0.25) + (MaterialFactor×0.20) + (EnvironmentalFactor×0.15) + (InverseConditionRating×0.10)`, normalized to 0–100; assign Low/Moderate/High risk levels
- Implement deterioration modeling via deterministic regression arithmetic: compute deterioration rate, predict condition ratings at +5/+10/+20 years, forecast maintenance year (when rating drops below 3.0); expose `getPredictions(id)`
- Implement budget estimation: `getBudgetEstimate(id)` returning estimatedCost, urgencyLevel, recommendedAction; `getCityBudgetSummary` returning total budget, breakdown by risk level, and top-5 priority structures
- Seed 20+ synthetic infrastructure records across 5 city areas at canister initialization

### Frontend (React + TypeScript)
- Apply a dark-mode navy/slate theme with electric teal and amber accents, monospace data typography, and card panels with glow borders throughout all views
- Top navigation bar and left filter sidebar (filter by risk level, structure type, city area, maintenance urgency) present on all main views; filters apply in real-time
- **Home page:** animated stat counters (total structures, high-risk count), risk alert banner, mini heatmap thumbnail, quick-access card grid for four sections, system status indicator
- **Infrastructure Listing page:** sortable/filterable data table with columns for name, type, area, age, riskScore (colored badge), riskLevel, healthScore, maintenanceYear, and a detail action; summary stats bar at top
- **GIS Heatmap page:** react-leaflet map with OpenStreetMap tiles, color-coded markers by risk level, leaflet.heat overlay, popup on marker click; markers filtered by sidebar
- **Infrastructure Detail page:** all engineering fields, radial gauge for risk score, health score progress bar, Recharts line chart for predicted condition ratings (current/+5/+10/+20), deterioration rate, maintenance year, budget estimate, edit form that recalculates on save; real-time sensor simulation toggle (updates condition rating ±0.1–0.3 and traffic load ±5% every 3s with a blinking LIVE indicator)
- **Budget Planning page:** total city budget display, Recharts bar chart (budget by risk level), Recharts pie chart (bridges vs roads), top-10 priority list, budget optimization recommendations
- **Analytics & Comparison page:** Recharts scatter plot (Age vs Risk Score, colored by type), bar chart (avg health score by area), health score distribution histogram, side-by-side comparison table for 2–3 structures
- Use hero banner and city illustration images on the home page

**User-visible outcome:** Users can browse, filter, and sort all 20+ seeded city infrastructure records; view a GIS heatmap of risk zones; drill into individual structure details with predictive charts and live sensor simulation; review city-wide budget planning with charts; and compare structures analytically — all within a dark-mode government intelligence dashboard aesthetic.
