import { renderBarChart, renderPassFailCircle } from "../components/charts.js";

export async function renderProfile(userData) {
  if (!userData) {
    return '<div class="error">No user data available</div>';
  }

  const { user, totalXP, passRatio, completedProjects } = userData;

  return `
    <div class="profile-container">
      <!-- Section 1: User Identification -->
      <div class="profile-section user-identification">
        <h3>User Information</h3>
        <div class="user-details">
          <p><strong>Username:</strong> ${user.login}</p>
          <p><strong>User ID:</strong> ${user.id}</p>
          <p><strong>Email:</strong> ${user.email}</p>
        </div>
      </div>

      <!-- Section 2: XP Amount and Transactions -->
      <div class="profile-section xp-section">
        <h3>XP Overview</h3>
        <div class="xp-details">
          <p><strong>Total XP:</strong> ${totalXP.toFixed(2)} XP</p>
          <p><strong>Number of Transactions:</strong> ${
            userData.projects.length
          }</p>
        </div>
      </div>

      <!-- Section 3: Ratios -->
      <div class="profile-section ratios-section">
        <h3>Performance Metrics</h3>
        <div class="ratios-details">
          <p><strong>Audit Ratio:</strong> ${user.auditRatio.toFixed(2)}</p>
          <p><strong>Pass Ratio:</strong> ${passRatio.toFixed(2)}%</p>
          <p><strong>Completed Projects:</strong> ${completedProjects}</p>
        </div>
      </div>

    <!-- XP Chart -->
    <div class="chart-card">
      <h3>Top Projects by XP</h3>
      <div id="xp-chart" class="chart-content"></div>
    </div>
    
    <!-- Pass/Fail Chart -->
    <div class="chart-card">
      <h3>Pass/Fail Ratio</h3>
      <div id="pass-fail-chart" class="chart-content"></div>
    </div>
  `;
}

export function renderProfileCharts(data) {
  // Make sure we wait for the DOM to be fully rendered
  setTimeout(() => {
    if (data.projects && data.projects.length > 0) {
      renderBarChart("xp-chart", data.projects);
    } else {
      console.warn("No project data available for the bar chart");
      document.getElementById("xp-chart").innerHTML =
        '<div class="chart-placeholder">No project data available</div>';
    }

    if (data.passCount !== undefined) {
      renderPassFailCircle("pass-fail-chart", {
        passCount: data.passCount,
        failCount: data.failCount,
        passRatio: data.passRatio,
        totalAttempts: data.passCount + data.failCount,
      });
    } else {
      console.warn("No pass/fail data available");
      document.getElementById("pass-fail-chart").innerHTML =
        '<div class="chart-placeholder">No pass/fail data available</div>';
    }
  }, 100);
}
