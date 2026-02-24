# Specification

## Summary
**Goal:** Add photo upload with deterministic auto-prediction to the Smart City Infrastructure Dashboard, enabling users to upload a photo alongside infrastructure details and receive automated condition analysis and risk predictions.

**Planned changes:**
- Add an optional `photoBase64: ?Text` field to the Motoko `Infrastructure` data type and update `addInfrastructure` and `updateInfrastructure` to persist it
- Implement a `analyzeAndPredict` Motoko function that derives a simulated visual condition score from the image hash combined with structural parameters, returning riskScore, riskLevel, deteriorationRate, maintenanceYear, estimatedCost, and recommendedAction
- Add a `useAnalyzeAndPredict` React Query hook that calls the backend `analyzeAndPredict` function with infrastructure form data including the photo Base64 string
- Build a new `/add` page accessible from the top nav with a full infrastructure form, drag-and-drop photo upload widget with thumbnail preview, an "Analyze & Predict" button that populates a prediction results panel, and a "Save to Database" button
- Update the existing `InfrastructureEditForm` to include a photo upload field; uploading a new photo triggers `analyzeAndPredict` and shows a suggestion side panel with "Accept Suggestions" and "Dismiss" options

**User-visible outcome:** Users can navigate to the Add page, fill in infrastructure details, upload a photo, click "Analyze & Predict" to instantly see risk scores, health scores, deterioration rates, maintenance forecasts, and budget estimates, then save the full record. When editing existing records, uploading a new photo shows updated prediction suggestions that can be accepted or dismissed.
