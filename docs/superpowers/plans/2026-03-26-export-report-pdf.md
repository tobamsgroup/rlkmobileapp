# Export Report PDF Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the "Export Report" button on the Guardian Learning Progress screen generate and save a styled PDF report for the selected kid, combining data from both the Learning Progress and Learning Overview screens.

**Architecture:** Install `expo-print`, `expo-file-system`, and `react-native-view-shot`. Create a standalone HTML template builder at `utils/reportGenerator.ts`. Modify `LearningProgress.tsx` to add chart view refs, an export loading state, and an async export handler that captures chart screenshots, builds the HTML, prints to PDF, and saves to device Documents.

**Tech Stack:** Expo (managed workflow, newArchEnabled), `expo-print`, `expo-file-system`, `react-native-view-shot ^4.0.0`, TypeScript, NativeWind

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| Modify | `package.json` | Add three new dependencies |
| Modify | `app.json` | Add `expo-print` to plugins array |
| **Create** | `utils/reportGenerator.ts` | HTML template builder — all PDF content logic |
| Modify | `app/guardian/LearningProgress.tsx` | Add chart refs, export handler, button wiring |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1.1 — Install the three new packages**

```bash
npx expo install expo-print expo-file-system react-native-view-shot
```

Expected: packages added to `package.json` under `dependencies`. No errors.

- [ ] **Step 1.2 — Verify versions**

```bash
node -e "const p = require('./package.json'); ['expo-print','expo-file-system','react-native-view-shot'].forEach(k => console.log(k, p.dependencies[k]))"
```

Expected output (versions may vary, `react-native-view-shot` must be 4.x):
```
expo-print ~14.x.x
expo-file-system ~18.x.x
react-native-view-shot 4.x.x
```

- [ ] **Step 1.3 — Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: install expo-print, expo-file-system, react-native-view-shot"
```

---

## Task 2: Add `expo-print` plugin to `app.json`

**Files:**
- Modify: `app.json`

- [ ] **Step 2.1 — Add plugin entry**

In `app.json`, find the `"plugins"` array (currently ends with the `expo-video` entry). Add `"expo-print"` as the last item:

```json
"plugins": [
  "expo-router",
  ["expo-splash-screen", { ... }],
  ["expo-audio", { ... }],
  ["expo-image-picker", { ... }],
  "expo-notifications",
  ["expo-video", { ... }],
  "expo-print"
]
```

- [ ] **Step 2.2 — Commit**

```bash
git add app.json
git commit -m "chore: add expo-print plugin to app.json"
```

---

## Task 3: Create `utils/reportGenerator.ts`

**Files:**
- Create: `utils/reportGenerator.ts`

This file exports a single function `generateKidReportHtml`. It has zero React/RN imports — pure TypeScript that returns an HTML string.

- [ ] **Step 3.1 — Create the file with the full implementation**

Create `/Users/maroh/Documents/GitHub/rlkmobileapp/utils/reportGenerator.ts`:

```typescript
import { ChapterCompletionRate, LearningOverviewResponse } from '@/types';
import { formatDateSlash, timeAgo } from '@/utils';

export interface ReportParams {
  data: LearningOverviewResponse;
  completionRateDetails: ChapterCompletionRate | undefined;
  averageScore: any;
  pieChartBase64: string | null;
  lineChartBase64: string | null;
  avatarBase64: string | null;
  generatedDate: string;
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateKidReportHtml(params: ReportParams): string {
  const {
    data,
    completionRateDetails,
    averageScore,
    pieChartBase64,
    lineChartBase64,
    avatarBase64,
    generatedDate,
  } = params;

  const kid = data?.kid;
  const thisWeek = data?.thisWeek;
  const assignedCourses = data?.assignedCourses ?? [];
  const activities = data?.activityService?.activities ?? [];
  const completionRate = completionRateDetails?.completionRate ?? 0;
  const avgScore = averageScore?.averageScore ?? averageScore ?? null;

  const initials = kid?.name ? getInitials(kid.name) : '?';

  const avatarHtml = avatarBase64
    ? `<img class="avatar" src="data:image/jpeg;base64,${avatarBase64}" />`
    : `<div class="avatar-placeholder">${initials}</div>`;

  const lastLogin = thisWeek?.lastLogin
    ? formatDateSlash(thisWeek.lastLogin)
    : '-';
  const lessonsCompleted = thisWeek?.lessonsCompleted || '-';
  const quizPassed =
    thisWeek?.assignmentsPassed && thisWeek.assignmentsPassed !== '0/0'
      ? thisWeek.assignmentsPassed
      : '-';
  const timeSpent =
    thisWeek?.totalTimeSpent && thisWeek.totalTimeSpent !== '0m'
      ? thisWeek.totalTimeSpent
      : '-';

  const coursesHtml =
    assignedCourses.length > 0
      ? assignedCourses
          .map(
            (d) => `
        <div class="course-card">
          <div class="course-header">Series ${d.index}: ${d.title}</div>
          <div class="course-book">${d.book}</div>
          <div class="badge-row">
            <div class="badge">
              <span class="badge-value">${d.progress}%</span>
              <span class="badge-label">Complete</span>
            </div>
            <div class="badge">
              <span class="badge-value">${d.assignmentStatus.completed}/${d.assignmentStatus.total}</span>
              <span class="badge-label">Assignment</span>
            </div>
          </div>
        </div>
      `,
          )
          .join('')
      : '<p class="no-data">No courses assigned.</p>';

  const activitiesHtml =
    activities.length > 0
      ? activities
          .map(
            (a) => `
        <div class="activity-row">
          <div class="activity-icon">&#127299;</div>
          <div class="activity-content">
            <div class="activity-name">${a.activity}</div>
            <div class="activity-sub">${a.title}</div>
          </div>
          <div class="activity-time">${timeAgo(a.timestamp)}</div>
        </div>
      `,
          )
          .join('')
      : '<p class="no-data">No recent activity.</p>';

  const pieChartHtml = pieChartBase64
    ? `<img class="chart-img" src="data:image/png;base64,${pieChartBase64}" />`
    : `<div class="chart-placeholder">Chart data not yet available</div>`;

  const lineChartHtml = lineChartBase64
    ? `<img class="chart-img" src="data:image/png;base64,${lineChartBase64}" />`
    : `<div class="chart-placeholder">Chart data not yet available</div>`;

  const genderDot =
    kid?.age && kid?.gender ? `<span class="dot"></span>` : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, Helvetica, Arial, sans-serif;
      background: #F5F5F5;
      padding: 24px;
      color: #474348;
    }

    /* ── Header ── */
    .report-header {
      background: #FFFFFF;
      border-radius: 16px;
      padding: 20px;
      margin-bottom: 16px;
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .avatar {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      border: 2px solid #D5B300;
      object-fit: cover;
      flex-shrink: 0;
    }
    .avatar-placeholder {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: #FFF7CC;
      border: 2px solid #D5B300;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      font-weight: 600;
      color: #265828;
      flex-shrink: 0;
    }
    .kid-info { flex: 1; }
    .kid-name { font-size: 20px; font-weight: 600; color: #393939; }
    .kid-username { font-size: 14px; color: #474348; margin-top: 4px; }
    .kid-meta {
      font-size: 14px;
      color: #474348;
      margin-top: 6px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #D5B300;
      display: inline-block;
    }
    .report-date { font-size: 12px; color: #474348; margin-top: 8px; }

    /* ── Section ── */
    .section { margin-bottom: 20px; }
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #393939;
      margin-bottom: 12px;
    }

    /* ── Stat card ── */
    .card {
      background: #FFFFFF;
      border: 0.5px solid #C3E4C5;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 12px;
    }
    .card-label { font-size: 14px; color: #474348; margin-bottom: 10px; }
    .card-value { font-size: 20px; font-weight: 600; color: #265828; }

    /* ── Progress bar ── */
    .progress-row {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-top: 8px;
    }
    .progress-bg {
      flex: 1;
      background: #E0E0E0;
      border-radius: 999px;
      height: 8px;
    }
    .progress-fill {
      background: #265828;
      border-radius: 999px;
      height: 8px;
    }
    .progress-pct {
      font-size: 18px;
      font-weight: 600;
      color: #393939;
      white-space: nowrap;
    }

    /* ── Course card ── */
    .course-card {
      border: 1px solid #D3D2D3;
      border-radius: 16px;
      padding: 12px;
      margin-bottom: 12px;
    }
    .course-header { font-size: 16px; font-weight: 500; color: #393939; margin-bottom: 4px; }
    .course-book { font-size: 14px; color: #474348; margin-bottom: 10px; }
    .badge-row { display: flex; gap: 8px; }
    .badge {
      border: 1px solid #D3D2D3;
      border-radius: 999px;
      padding: 6px 14px;
      font-size: 13px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      flex: 1;
    }
    .badge-value { font-weight: 500; color: #265828; }
    .badge-label { color: #474348; }

    /* ── Activity ── */
    .activity-row {
      display: flex;
      gap: 12px;
      padding: 12px 0;
      border-bottom: 0.5px solid #F0F0F0;
      align-items: flex-start;
    }
    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #D5B3001A;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      flex-shrink: 0;
    }
    .activity-content { flex: 1; }
    .activity-name { font-size: 15px; font-weight: 500; color: #393939; }
    .activity-sub { font-size: 13px; color: #474348; margin-top: 2px; }
    .activity-time { font-size: 12px; color: #474348; white-space: nowrap; }

    /* ── Chart ── */
    .chart-card {
      background: #FFFFFF;
      border: 1px solid #D3D2D366;
      border-radius: 20px;
      padding: 20px;
      margin-bottom: 12px;
    }
    .chart-title {
      font-size: 17px;
      font-weight: 500;
      color: #393939;
      margin-bottom: 14px;
    }
    .chart-img { width: 100%; border-radius: 8px; }
    .chart-placeholder {
      background: #F0F0F0;
      border-radius: 8px;
      padding: 24px;
      text-align: center;
      color: #474348;
      font-size: 14px;
    }

    /* ── Engagement ── */
    .engagement-card {
      border: 0.5px solid #D3D2D366;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 12px;
    }
    .engagement-row {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      border-bottom: 1px solid #D3D2D366;
      background: #FFFFFF;
    }
    .engagement-row:last-child { border-bottom: none; }
    .engagement-value { font-size: 18px; font-weight: 600; color: #265828; }
    .engagement-label {
      font-size: 15px;
      font-weight: 500;
      color: #474348;
      margin-top: 8px;
    }

    .no-data { color: #474348; font-size: 14px; padding: 12px 0; }
  </style>
</head>
<body>

  <!-- HEADER -->
  <div class="report-header">
    ${avatarHtml}
    <div class="kid-info">
      <div class="kid-name">${kid?.name ?? '-'}</div>
      <div class="kid-username">@${kid?.username ?? '-'}</div>
      <div class="kid-meta">
        ${kid?.age ? `<span>${kid.age} Years</span>` : ''}
        ${genderDot}
        ${kid?.gender ? `<span>${kid.gender}</span>` : ''}
      </div>
      <div class="report-date">Report generated: ${generatedDate}</div>
    </div>
  </div>

  <!-- LEARNING OVERVIEW -->
  <div class="section">
    <div class="section-title">Learning Overview</div>
    <div class="card">
      <div class="card-label">Last Log In</div>
      <div class="card-value">${lastLogin}</div>
    </div>
    <div class="card">
      <div class="card-label">Lessons Completed</div>
      <div class="card-value">${lessonsCompleted}</div>
    </div>
    <div class="card">
      <div class="card-label">Quiz Passed</div>
      <div class="card-value">${quizPassed}</div>
    </div>
    <div class="card">
      <div class="card-label">Total Time Spent</div>
      <div class="card-value">${timeSpent}</div>
    </div>
  </div>

  <!-- ASSIGNED COURSES -->
  <div class="section">
    <div class="card" style="padding-bottom: 4px;">
      <div class="section-title">Assigned Courses</div>
      ${coursesHtml}
    </div>
  </div>

  <!-- RECENT ACTIVITIES -->
  <div class="section">
    <div class="card" style="padding-bottom: 4px;">
      <div class="section-title">Recent Activities</div>
      ${activitiesHtml}
    </div>
  </div>

  <!-- LEARNING PROGRESS -->
  <div class="section">
    <div class="section-title">Learning Progress</div>
    <div class="card">
      <div class="card-label">Chapter Completion Rate</div>
      <div class="progress-row">
        <div class="progress-bg">
          <div class="progress-fill" style="width: ${completionRate}%;"></div>
        </div>
        <span class="progress-pct">${completionRate}%</span>
      </div>
    </div>
    <div class="card">
      <div class="card-label">Total Missions Completed</div>
      <div class="card-value">0</div>
    </div>
    <div class="card">
      <div class="card-label">Learning Streaks</div>
      <div class="card-value">0</div>
    </div>
  </div>

  <!-- PERFORMANCE DATA -->
  <div class="section">
    <div class="section-title">Performance Data</div>
    <div class="card">
      <div class="card-label">Avg. Quiz Score</div>
      <div class="card-value">${avgScore != null ? `${avgScore}%` : '0%'}</div>
    </div>
    <div class="card">
      <div class="card-label">Journal Entry</div>
      <div class="card-value">-</div>
    </div>
    <div class="card">
      <div class="card-label">Mission Complexity</div>
      <div class="card-value">-</div>
    </div>
  </div>

  <!-- AUDIO VS TEXT -->
  <div class="chart-card">
    <div class="chart-title">Audio vs. Text Usage (Read Aloud)</div>
    ${pieChartHtml}
  </div>

  <!-- ENGAGEMENT & OUTCOME -->
  <div class="section">
    <div class="section-title">Engagement and Outcome</div>
    <div class="engagement-card">
      <div class="engagement-row">
        <div class="engagement-value">-</div>
        <div class="engagement-label">Creativity Score</div>
      </div>
      <div class="engagement-row">
        <div class="engagement-value">-</div>
        <div class="engagement-label">Comprehension</div>
      </div>
      <div class="engagement-row">
        <div class="engagement-value">-</div>
        <div class="engagement-label">Planning Ability</div>
      </div>
    </div>
  </div>

  <!-- TIME ON TASK -->
  <div class="chart-card">
    <div class="chart-title">Time on Task (Last 7 Days)</div>
    ${lineChartHtml}
  </div>

</body>
</html>`;
}
```

- [ ] **Step 3.2 — Commit**

```bash
git add utils/reportGenerator.ts
git commit -m "feat: add generateKidReportHtml utility for PDF export"
```

---

## Task 4: Add chart view refs to `LearningProgress.tsx`

**Files:**
- Modify: `app/guardian/LearningProgress.tsx`

We need to wrap the two chart cards in `<View ref={...}>` so `react-native-view-shot` can capture them.

- [ ] **Step 4.1 — Add the two refs at the top of the component**

At line 36, after `const [openRemaining, setOpenRemaining] = useState(false);`, add:

```tsx
const pieChartContainerRef = useRef<View>(null);
const lineChartContainerRef = useRef<View>(null);
```

Also add `View` to the `useRef` import and update the React import line:

```tsx
import React, { useMemo, useRef, useState } from 'react';
```

- [ ] **Step 4.2 — Wrap the Audio vs Text card with `pieChartContainerRef`**

Find the "audio vs text" card (around line 374). It currently starts with:

```tsx
{/* audio vs text */}
<View className="bg-white rounded-[20px] p-5 mt-5  border border-[#D3D2D366]">
```

Change it to:

```tsx
{/* audio vs text */}
<View ref={pieChartContainerRef} className="bg-white rounded-[20px] p-5 mt-5  border border-[#D3D2D366]">
```

- [ ] **Step 4.3 — Wrap the Time on Task card with `lineChartContainerRef`**

Find the `<View className="flex-1">` that wraps the `LineChart` (around line 462). It currently reads:

```tsx
<View className="flex-1">
  <Text className="font-sansMedium text-[18px] text-dark mb-6">
    Time on Task (Last 7 Days)
  </Text>
  <LineChart
```

Change the wrapping view to:

```tsx
<View ref={lineChartContainerRef} className="flex-1">
```

- [ ] **Step 4.4 — Commit**

```bash
git add app/guardian/LearningProgress.tsx
git commit -m "feat: add chart view refs for PDF export capture"
```

---

## Task 5: Implement the export handler and wire the button

**Files:**
- Modify: `app/guardian/LearningProgress.tsx`

- [ ] **Step 5.1 — Add new imports at the top of the file**

After the existing imports, add:

```tsx
import * as FileSystem from 'expo-file-system';
import * as Print from 'expo-print';
import { captureRef } from 'react-native-view-shot';
import { generateKidReportHtml } from '@/utils/reportGenerator';
```

- [ ] **Step 5.2 — Add `exportLoading` state**

After the existing `const [loading, setLoading] = useState(false);` line, add:

```tsx
const [exportLoading, setExportLoading] = useState(false);
```

- [ ] **Step 5.3 — Add the `handleExportReport` function**

Add this function after `handleSwitchSession` (around line 103), before the `return` statement:

```tsx
const handleExportReport = async () => {
  if (exportLoading || !data) return;
  setExportLoading(true);
  try {
    const generatedDate = new Date().toLocaleDateString('en-GB');

    // Fetch and base64-encode kid avatar
    // NOTE: FileReader / Blob are Web APIs and do not exist in React Native (Hermes).
    // Use expo-file-system's downloadAsync + readAsStringAsync instead.
    let avatarBase64: string | null = null;
    if (data?.kid?.picture && FileSystem.documentDirectory) {
      try {
        const tmpPath = `${FileSystem.cacheDirectory}avatar_tmp.jpg`;
        const downloadResult = await FileSystem.downloadAsync(
          data.kid.picture,
          tmpPath,
        );
        avatarBase64 = await FileSystem.readAsStringAsync(downloadResult.uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
      } catch {
        avatarBase64 = null;
      }
    }

    // Capture chart screenshots
    let pieChartBase64: string | null = null;
    let lineChartBase64: string | null = null;
    try {
      pieChartBase64 = await captureRef(pieChartContainerRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
    } catch {
      pieChartBase64 = null;
    }
    try {
      lineChartBase64 = await captureRef(lineChartContainerRef, {
        format: 'png',
        quality: 1,
        result: 'base64',
      });
    } catch {
      lineChartBase64 = null;
    }

    // Build HTML and generate PDF
    const html = generateKidReportHtml({
      data,
      completionRateDetails,
      averageScore,
      pieChartBase64,
      lineChartBase64,
      avatarBase64,
      generatedDate,
    });

    const { uri: tempUri } = await Print.printToFileAsync({ html });

    // Save to Documents/rlk-reports/
    const reportsDir = `${FileSystem.documentDirectory}rlk-reports/`;
    await FileSystem.makeDirectoryAsync(reportsDir, { intermediates: true });

    const safeName = (data.kid?.name ?? 'Kid').replace(/\s+/g, '-');
    const dateStamp = new Date()
      .toLocaleDateString('en-GB')
      .replace(/\//g, '-');
    const destUri = `${reportsDir}${safeName}-report-${dateStamp}.pdf`;

    await FileSystem.copyAsync({ from: tempUri, to: destUri });

    showToast('success', 'Report saved to Documents');
  } catch (error: any) {
    console.error('Export report error:', error);
    showToast('error', 'Failed to generate report');
  } finally {
    setExportLoading(false);
  }
};
```

- [ ] **Step 5.4 — Wire the Export Report button**

Find the Export Report `Pressable` (around line 184):

```tsx
<Pressable className="bg-white rounded-[12px] p-4 py-[18px] flex-row items-center justify-between mt-5">
  <Text className="text-[16px] font-sansMedium text-dark">
    Export Report
  </Text>
  <ICONS.Export />
</Pressable>
```

Replace it with:

```tsx
<Pressable
  onPress={handleExportReport}
  disabled={exportLoading}
  className="bg-white rounded-[12px] p-4 py-[18px] flex-row items-center justify-between mt-5"
>
  <Text className="text-[16px] font-sansMedium text-dark">
    {exportLoading ? 'Generating...' : 'Export Report'}
  </Text>
  {exportLoading ? (
    <ActivityIndicator size="small" color="#265828" />
  ) : (
    <ICONS.Export />
  )}
</Pressable>
```

Also add `ActivityIndicator` to the React Native imports at the top of the file:

```tsx
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
```

- [ ] **Step 5.5 — Commit**

```bash
git add app/guardian/LearningProgress.tsx
git commit -m "feat: implement Export Report PDF generation and save to device"
```

---

## Task 6: Manual verification checklist

Before marking complete, verify the following on a device or simulator:

- [ ] Tap "Export Report" — button shows "Generating..." with spinner
- [ ] After generation — success toast appears: "Report saved to Documents"
- [ ] Locate the file in device Files app under `On My iPhone/iPad > rlkmobileapp > rlk-reports` (iOS) or `Internal Storage/Android/data/.../files/rlk-reports` (Android)
- [ ] Open the PDF — kid header renders with name, username, age/gender
- [ ] All Learning Overview stats visible (Last Login, Lessons Completed, Quiz Passed, Time Spent)
- [ ] Assigned Courses section renders each course card
- [ ] Recent Activities section renders (or shows "No recent activity")
- [ ] Learning Progress section renders with completion rate bar
- [ ] Performance Data section renders
- [ ] Audio vs Text card shows chart screenshot (or grey placeholder if data is all zeros)
- [ ] Time on Task card shows chart screenshot
- [ ] Engagement & Outcome section renders
- [ ] Tap "Export Report" when `data` is undefined — button does nothing (no crash)
- [ ] Filename format: `KidName-report-DD-MM-YYYY.pdf` ✓
