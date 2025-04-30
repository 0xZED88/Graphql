import { renderBarChart, renderSkillsChart } from "../components/charts.js";
import { formatXP } from "../../utils/helpers.js";

export async function renderProfile(userData) {
  if (!userData) {
    return '<div class="error">No user data available</div>';
  }
  console.log(userData);

  const { user, totalXP, completedProjects } = userData;

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
          <p><strong>Total XP:</strong> ${formatXP(totalXP.toFixed(2))} </p>
          <p><strong>Number of Transactions:</strong> ${
            userData.transactionCount
          }</p>
        </div>
      </div>

      <!-- Section 3: Ratios -->
      <div class="profile-section ratios-section">
        <h3>Audit Infos</h3>
        <div class="ratios-details">
          <p><strong>Audit Ratio:</strong> ${user.auditRatio.toFixed(1)}</p>
          
          <p><strong>Completed Projects:</strong> ${completedProjects}</p>
        </div>
      </div>

    <!-- XP Chart -->
    <div class="chart-card">
      <h3>Top Projects by XP</h3>
      <div id="xp-chart" class="chart-content"></div>
    </div>
    
      <!-- Skills Chart -->
      <div class="chart-card">
        <div id="skills-chart" class="chart-content"></div>
      </div>
    </div>
  `;
}

export function renderProfileCharts(data) {
  setTimeout(() => {
    if (data.projects && data.projects.length > 0) {
      renderBarChart("xp-chart", data.projects);
    } else {
      document.getElementById("xp-chart").innerHTML =
        '<div class="chart-placeholder">No project data available</div>';
    }

    if (data.skills && data.skills.length > 0) {
      renderSkillsChart("skills-chart", data.skills);
    } else {
      document.getElementById("skills-chart").innerHTML =
        '<div class="chart-placeholder">No skills data available</div>';
    }
  }, 100);
}
