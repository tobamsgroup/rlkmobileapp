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

function escapeHtml(text: string | null | undefined): string {
  if (text == null) return '-';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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
  const rawAvgScore = averageScore?.averageScore ?? averageScore ?? null;
  const avgScore = typeof rawAvgScore === 'number' && !isNaN(rawAvgScore) ? rawAvgScore : null;

  const initials = kid?.name ? getInitials(kid.name) : '?';

  const avatarHtml = avatarBase64
    ? `<img class="avatar" src="data:image/jpeg;base64,${avatarBase64}" />`
    : `<div class="avatar-placeholder">${initials}</div>`;

  const lastLogin = thisWeek?.lastLogin
    ? formatDateSlash(thisWeek.lastLogin)
    : '-';
  const lessonsCompleted = thisWeek?.lessonsCompleted ?? '-';
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
          <div class="course-header">Series ${d.index}: ${escapeHtml(d.title)}</div>
          <div class="course-book">${escapeHtml(d.book)}</div>
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
            <div class="activity-name">${escapeHtml(a.activity)}</div>
            <div class="activity-sub">${escapeHtml(a.title)}</div>
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
      <div class="kid-name">${escapeHtml(kid?.name)}</div>
      <div class="kid-username">@${escapeHtml(kid?.username)}</div>
      <div class="kid-meta">
        ${kid?.age ? `<span>${kid.age} Years</span>` : ''}
        ${genderDot}
        ${kid?.gender ? `<span>${escapeHtml(kid?.gender)}</span>` : ''}
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
