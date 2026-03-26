# Export Report PDF — Design Spec

**Date:** 2026-03-26
**Feature:** Functional "Export Report" button on Guardian Learning Progress screen
**Status:** Approved

---

## Overview

The "Export Report" button on `app/guardian/LearningProgress.tsx` currently renders with no handler. This spec describes making it functional: when tapped, it generates a PDF report for the selected kid, combining all data from the Learning Progress and Learning Overview screens, and saves it to the device's Documents directory.

---

## Goals

- Generate a styled, readable PDF containing all data visible across `LearningProgress.tsx` and `LearningOverview.tsx` for the selected kid
- Embed live chart screenshots (Pie chart and Line chart) into the PDF
- Save the PDF to the device's local Documents folder
- Show a loading state on the button during generation and a success toast on completion

---

## Non-Goals

- Sharing via share sheet (save to device only)
- Server-side PDF generation
- Scheduled or automated report delivery
- Charts rendered as vector graphics (screenshots via `react-native-view-shot` only)

---

## New Dependencies

| Package | Version | Purpose |
|---|---|---|
| `expo-print` | latest | Converts HTML string to a PDF file |
| `expo-file-system` | latest | Copies generated PDF to device Documents directory |
| `react-native-view-shot` | `^4.0.0` | Captures chart View refs as base64 PNG images |

### Compatibility Note — `react-native-view-shot`

The project has `"newArchEnabled": true` in `app.json`. Use `react-native-view-shot` v4.0.0 or later, which supports New Architecture. This package has no Expo config plugin, so no `plugins` entry is required, but an EAS Build or `npx expo prebuild` step may be needed for production builds.

### `app.json` Change Required — `expo-print`

Add `"expo-print"` to the `plugins` array in `app.json` to ensure correct iOS entitlements (PDF rendering and temp directory write access):

```json
{
  "expo": {
    "plugins": [
      ...,
      "expo-print"
    ]
  }
}
```

---

## Architecture

### Data Flow

`LearningProgress.tsx` already fetches all data required for both screens:

- `getKidsOverview(kidId)` → returns `LearningOverviewResponse` — kid profile, thisWeek stats, assignedCourses, activityService (same data used by `LearningOverview.tsx`)
- `getKidOverallChapterCompletionRate(kidId)` → returns `ChapterCompletionRate` — completionRate
- `getKidAverageQuizScore(kidId)` → returns `any` (type pending backend stabilisation)

No additional API calls are needed.

### Export Flow

```
User taps "Export Report"
  → setExportLoading(true)
  → construct generatedDate = new Date().toLocaleDateString('en-GB') // "26/03/2026"
  → fetch kid avatar as base64 (if data?.kid?.picture exists, fetch via fetch() + FileReader/blob → base64; else use null)
  → captureRef(pieChartContainerRef) → pieChartBase64 (PNG, captures the full PieChart card including legend)
  → captureRef(lineChartContainerRef) → lineChartBase64 (PNG, captures the full LineChart card including title)
  → generateKidReportHtml({ data, completionRateDetails, averageScore, pieChartBase64, lineChartBase64, avatarBase64, generatedDate })
  → Print.printToFileAsync({ html }) → tempUri (PDF)
  → FileSystem.makeDirectoryAsync(DocumentDirectory + 'rlk-reports/', { intermediates: true })
  → FileSystem.copyAsync({ from: tempUri, to: DocumentDirectory + 'rlk-reports/' + kidName + '-report-' + date + '.pdf' })
  → showToast('success', 'Report saved to Documents')
  → setExportLoading(false)
```

Error path: each async step is wrapped in a single try/catch. On any failure: `showToast('error', 'Failed to generate report')`, log to console, `setExportLoading(false)`.

---

## New File: `utils/reportGenerator.ts`

Exports a single function:

```ts
generateKidReportHtml(params: {
  data: LearningOverviewResponse;
  completionRateDetails: ChapterCompletionRate | undefined;
  averageScore: any;           // typed 'any' pending backend type stabilisation
  pieChartBase64: string;
  lineChartBase64: string;
  avatarBase64: string | null; // null = omit avatar from PDF header
  generatedDate: string;
}): string
```

Returns a complete HTML string. Keeps `LearningProgress.tsx` clean — all template logic lives here.

---

## View Refs for Chart Capture

Two refs are added to `LearningProgress.tsx`. Each ref wraps the **full card** (including title and legend) so screenshots include context:

### `pieChartContainerRef`
Wraps the entire "Audio vs. Text Usage" card (currently lines 374–402), including the title "Audio vs. Text Usage (Read Aloud)", the `PieChart`, and the Audio/Text legend items.

### `lineChartContainerRef`
Wraps the entire "Time on Task" card (currently lines 462–496 inside the Engagement & Outcome section), including the title "Time on Task (Last 7 Days)" and the `LineChart`.

Both refs are attached to `<View>` host components (not directly to chart components). Use `captureRef(ref, { format: 'png', quality: 1 })` from `react-native-view-shot`.

---

## Kid Avatar in PDF

Remote URI images do not render reliably in `expo-print`'s WKWebView renderer on iOS when offline. The avatar image must be fetched and converted to a base64 data URI before embedding:

```ts
const response = await fetch(pictureUrl);
const blob = await response.blob();
// convert blob to base64 using FileReader
```

If `data?.kid?.picture` is null/undefined, or if the fetch fails, `avatarBase64` is set to `null` and the PDF header renders initials or omits the image entirely.

---

## PDF Content Structure

Sections appear in this order, matching the on-screen layout:

1. **Header** — Kid avatar (base64 `<img>` or initials fallback), name, username, age, gender, report date
2. **Learning Overview**
   - Last login
   - Lessons completed
   - Quiz passed
   - Total time spent
3. **Assigned Courses** — one card per course: title, book name, progress %, assignment completed/total
4. **Recent Activities** — activity name, title, time ago
5. **Learning Progress**
   - Chapter completion rate (CSS progress bar)
   - Total missions completed
   - Learning streaks
6. **Performance Data**
   - Avg quiz score
   - Journal entry
   - Mission complexity
7. **Audio vs. Text Usage** — embedded `pieChartContainerRef` screenshot
8. **Engagement & Outcome** — Creativity score, Comprehension, Planning ability
9. **Time on Task (Last 7 Days)** — embedded `lineChartContainerRef` screenshot

> Note: Section order matches the screen rendering order in `LearningProgress.tsx`.

---

## Styling

The HTML template uses the app's colour palette:

| Token | Hex | Usage |
|---|---|---|
| Dark green | `#265828` | Section headings, key values |
| Gold | `#D5B300` | Accent dots, badge elements |
| Body text | `#474348` | Labels, descriptions |
| Card border | `#C3E4C5` | Card outlines |
| Background | `#F5F5F5` | Page background |
| White | `#FFFFFF` | Card backgrounds |

Cards use `border: 0.5px solid #C3E4C5`, `border-radius: 12px`, `padding: 16px`.

---

## Changes to `LearningProgress.tsx`

1. Add `useRef` for `pieChartContainerRef` and `lineChartContainerRef` — wrap the respective card `View`s
2. Add `exportLoading` state (`useState(false)`)
3. Wire `onPress` on the "Export Report" `Pressable` to the export handler
4. Show `ActivityIndicator` while `exportLoading` is true (disable the pressable during loading)
5. Imports to add: `captureRef` from `react-native-view-shot`, `Print` from `expo-print`, `FileSystem` from `expo-file-system`, `generateKidReportHtml` from `@/utils/reportGenerator`

---

## File Save Location

```
{FileSystem.documentDirectory}/rlk-reports/{KidName}-report-{DD-MM-YYYY}.pdf
```

The `rlk-reports/` subdirectory is created with `makeDirectoryAsync(..., { intermediates: true })` before each save. Spaces in kid names are replaced with hyphens for the filename.

---

## Error Handling

| Scenario | Behaviour |
|---|---|
| Chart capture fails | Embed a grey placeholder `<div>` in HTML instead; continue generation |
| Avatar fetch/base64 fails | Set `avatarBase64 = null`; omit image from PDF header; continue generation |
| `makeDirectoryAsync` fails | Show error toast, log to console, abort |
| `printToFileAsync` fails | Show error toast, log to console, abort |
| `copyAsync` (file write) fails | Show error toast, log to console, abort |
| `data` is undefined when tapped | Guard at start of handler: early return, no loading state |

---

## Testing Checklist

- [ ] PDF saves to correct path on iOS
- [ ] PDF saves to correct path on Android
- [ ] Kid avatar appears in PDF header when picture URL exists
- [ ] Avatar omitted gracefully when picture is null or fetch fails
- [ ] PieChart card screenshot embedded correctly
- [ ] LineChart card screenshot embedded correctly
- [ ] All data fields render with `-` fallback when value is missing
- [ ] Loading state shown on button during generation
- [ ] Success toast shown after save
- [ ] Error toast shown if generation fails
- [ ] Report filename includes correct kid name and date
- [ ] `expo-print` plugin added to `app.json`
- [ ] `react-native-view-shot` v4.0.0+ used
