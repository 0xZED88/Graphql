import { createSVGElement } from "../../utils/helpers.js";

// export function renderLineChart(containerId, dailyXP) {
//   const container = document.getElementById(containerId);
//   if (!container || !dailyXP?.length) {
//     container.innerHTML =
//       '<div class="chart-placeholder">Loading XP data...</div>';
//     return;
//   }

//   // Clear previous content
//   container.innerHTML = '<svg width="100%" height="300"></svg>';
//   const svg = container.querySelector("svg");
//   svg.setAttribute("viewBox", "0 0 800 300");

//   // Chart dimensions
//   const margin = { top: 30, right: 30, bottom: 40, left: 40 };
//   const width = 800 - margin.left - margin.right;
//   const height = 300 - margin.top - margin.bottom;

//   // Sort data by date
//   const sortedData = [...dailyXP].sort(
//     (a, b) => new Date(a.date) - new Date(b.date)
//   );

//   // Calculate cumulative XP
//   let cumulativeXP = 0;
//   const cumulativeData = sortedData.map((item) => {
//     cumulativeXP += item.xp;
//     return {
//       date: new Date(item.date),
//       xp: cumulativeXP,
//       displayDate: formatShortDate(item.date),
//     };
//   });

//   const maxXP = Math.max(...cumulativeData.map((d) => d.xp), 1);
//   const minDate = cumulativeData[0].date;
//   const maxDate = cumulativeData[cumulativeData.length - 1].date;
//   const timeRange = maxDate - minDate;

//   // Create Y axis (percentage)
//   const yPercentages = [0, 25, 50, 75, 100];
//   yPercentages.forEach((pct) => {
//     const y = height - height * (pct / 100) + margin.top;
//     const text = createSVGElement("text", {
//       x: margin.left - 10,
//       y: y + 5,
//       "text-anchor": "end",
//       "font-size": "12",
//       fill: "#666",
//     });
//     text.textContent = `${pct}%`;
//     svg.appendChild(text);

//     // Add horizontal grid line
//     const line = createSVGElement("line", {
//       x1: margin.left,
//       y1: y,
//       x2: width + margin.left,
//       y2: y,
//       stroke: "#e0e0e0",
//       "stroke-width": "1",
//     });
//     svg.insertBefore(line, svg.firstChild);
//   });

//   // Create X axis (dates)
//   const dateLabels = [
//     cumulativeData[0], // First date
//     cumulativeData[Math.floor(cumulativeData.length * 0.33)], // ~1/3
//     cumulativeData[Math.floor(cumulativeData.length * 0.66)], // ~2/3
//     cumulativeData[cumulativeData.length - 1], // Last date
//   ];

//   dateLabels.forEach((item, i) => {
//     const x = margin.left + ((item.date - minDate) / timeRange) * width;
//     const text = createSVGElement("text", {
//       x: x,
//       y: height + margin.top + 20,
//       "text-anchor": "middle",
//       "font-size": "12",
//       fill: "#666",
//     });
//     text.textContent = item.displayDate;
//     svg.appendChild(text);
//   });

//   // Create line path
//   const path = createSVGElement("path", {
//     d: cumulativeData
//       .map((item) => {
//         const x = margin.left + ((item.date - minDate) / timeRange) * width;
//         const y = height - height * (item.xp / maxXP) + margin.top;
//         return `${x},${y}`;
//       })
//       .reduce((acc, point, i) => acc + (i === 0 ? "M" : "L") + point, ""),
//     fill: "none",
//     stroke: "#0052B4",
//     "stroke-width": "3",
//     "stroke-linejoin": "round",
//   });
//   svg.appendChild(path);

//   // Add current percentage marker
//   const lastPoint = cumulativeData[cumulativeData.length - 1];
//   const lastX = margin.left + ((lastPoint.date - minDate) / timeRange) * width;
//   const lastY = height - height * (lastPoint.xp / maxXP) + margin.top;
//   const currentPct = Math.round((lastPoint.xp / maxXP) * 100);

//   // Percentage text
//   const pctText = createSVGElement("text", {
//     x: lastX + 10,
//     y: lastY - 10,
//     "font-size": "14",
//     "font-weight": "bold",
//     fill: "#0052B4",
//   });
//   pctText.textContent = `${currentPct}%`;
//   svg.appendChild(pctText);

//   // Circle marker
//   const circle = createSVGElement("circle", {
//     cx: lastX,
//     cy: lastY,
//     r: "6",
//     fill: "#0052B4",
//   });
//   svg.appendChild(circle);
// }

////////////////////////////////////////////// SECOUND GRAPH (CIRCLE) ////////////////////////////////////////////////

// export function renderPassFailCircle(containerId, passFailData) {
//   const container = document.getElementById(containerId);
//   if (!container || !passFailData) {
//     container.innerHTML =
//       '<div class="chart-placeholder">No pass/fail data</div>';
//     return;
//   }

//   const { passCount, failCount, totalAttempts, passRatio } = passFailData;
//   const radius = 80;
//   const circumference = 2 * Math.PI * radius;

//   container.innerHTML = `
//     <svg width="200" height="200" viewBox="0 0 200 200">
//       <circle cx="100" cy="100" r="${radius}" fill="#f5f5f5" />
//       <circle cx="100" cy="100" r="${radius}" fill="none"
//         stroke="#f44336" stroke-width="16"
//         stroke-dasharray="${
//           (failCount / totalAttempts) * circumference
//         } ${circumference}"
//         transform="rotate(-90 100 100)" />
//       <circle cx="100" cy="100" r="${radius}" fill="none"
//         stroke="#4CAF50" stroke-width="16"
//         stroke-dasharray="${
//           (passCount / totalAttempts) * circumference
//         } ${circumference}"
//         transform="rotate(${
//           -90 + (failCount / totalAttempts) * 360
//         } 100 100)" />
//       <text x="100" y="100" text-anchor="middle" dominant-baseline="middle"
//         font-size="24" font-weight="bold" fill="#333">
//         ${Math.round(passRatio)}%
//       </text>
//       <text x="100" y="125" text-anchor="middle" font-size="12" fill="#666">
//         ${passCount} Pass / ${failCount} Fail
//       </text>
//     </svg>
//     <div class="pass-fail-legend">
//       <div><span class="legend-dot pass"></span> Pass: ${passCount}</div>
//       <div><span class="legend-dot fail"></span> Fail: ${failCount}</div>
//     </div>`;
// }

// Add this to charts.js
export function renderSkillsChart(containerId, skillsData) {
  const container = document.getElementById(containerId);
  if (!container || !skillsData?.length) {
    container.innerHTML = '<div class="chart-placeholder">No skills data available</div>';
    return;
  }

  // Clear previous content
  container.innerHTML = '<svg width="100%" height="450" viewBox="0 0 850 450"></svg>';
  const svg = container.querySelector("svg");

  // Add title
  const title = createSVGElement("text", {
    x: "370",
    y: "30",
    "font-size": "18",
    fill: "black",
  });
  //title.textContent = "Skills Progress";
  svg.appendChild(title);

  // Create bars for each skill
  skillsData.forEach((skill, index) => {
    const skillName = skill.type.split("_")[1];
    const x = index * 50 + 45;
    const barHeight = (skill.amount / 100) * 300;
    const y = 400 - barHeight - 50;

    // Create bar
    svg.appendChild(
      createSVGElement("rect", {
        x,
        y,
        width: "30",
        height: barHeight,
        fill: "steelblue",
      })
    );

    // Skill name label (rotated)
    svg.appendChild(
      createSVGElement("text", {
        x: x + 7,
        y: "360",
        transform: `rotate(45, ${x}, 360)`,
        "font-size": "10",
      })
    ).textContent = skillName;

    // Skill percentage label
    svg.appendChild(
      createSVGElement("text", {
        x: x + 3,
        y: y - 5,
        "font-size": "10",
      })
    ).textContent = `${skill.amount}%`;
  });

  // Create X axis only (removed Y axis)
  svg.appendChild(
    createSVGElement("line", {
      x1: "45",
      y1: "350",
      x2: "830",
      y2: "350",
      stroke: "black",
      "stroke-width": "2",
    })
  );
}

////////////////////////////////////////////// FIRST GRAPH (BAR) ////////////////////////////////////////////////

export function renderBarChart(containerId, projectsData) {
  // 1. Basic setup and validation
  const container = document.getElementById(containerId);
  if (!container || !projectsData?.length) {
    container.innerHTML =
      '<div class="chart-placeholder">No project data</div>';
    return;
  }

  // 2. Prepare data - limit to top 10 projects
  const topProjects = projectsData.slice(0, 10);
  const maxXP = Math.max(...topProjects.map((p) => p.xp), 1); // Ensure at least 1 to avoid division by zero

  // 3. Create SVG container
  container.innerHTML = '<svg width="100%" height="400"></svg>';
  const svg = container.querySelector("svg");
  svg.setAttribute("viewBox", "0 0 800 400");

  // 4. Chart dimensions and margins
  const margin = { top: 20, right: 20, bottom: 70, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // 5. Calculate bar dimensions
  const barWidth = 40;
  const barSpacing =
    (width - barWidth * topProjects.length) / (topProjects.length + 1);

  // 6. Create Y-axis with grid lines
  for (let i = 0; i <= 5; i++) {
    const yValue = Math.floor((maxXP / 5) * i);
    const yPos = height - (yValue / maxXP) * height + margin.top;

    // Grid line
    svg.appendChild(
      createSVGElement("line", {
        x1: margin.left,
        y1: yPos,
        x2: width + margin.left,
        y2: yPos,
        stroke: "#e0e0e0",
      })
    );

    // Y-axis label
    const label = createSVGElement("text", {
      x: margin.left - 10,
      y: yPos + 5,
      "text-anchor": "end",
      "font-size": "12",
    });
    label.textContent = yValue.toLocaleString();
    svg.appendChild(label);
  }

  // 7. Create bars and labels
  topProjects.forEach((project, i) => {
    const barHeight = (project.xp / maxXP) * height;
    const x = margin.left + barSpacing + i * (barWidth + barSpacing);
    const y = height - barHeight + margin.top;

    // Create bar
    svg.appendChild(
      createSVGElement("rect", {
        x,
        y,
        width: barWidth,
        height: barHeight,
        fill: "#0052B4",
        rx: "2", // Rounded corners
      })
    );

    // XP value label
    const valueLabel = createSVGElement("text", {
      x: x + barWidth / 2,
      y: y - 5,
      "text-anchor": "middle",
      "font-size": "10",
    });
    valueLabel.textContent = project.xp.toLocaleString();
    svg.appendChild(valueLabel);

    // Project name label
    const nameLabel = createSVGElement("text", {
      x: x + barWidth / 2,
      y: height + margin.top + 20,
      "text-anchor": "end",
      transform: `rotate(-45, ${x + barWidth / 2}, ${
        height + margin.top + 20
      })`,
      "font-size": "10",
    });
    nameLabel.textContent = project.name;
    svg.appendChild(nameLabel);
  });

  // 8. Add axes
  // X-axis line
  svg.appendChild(
    createSVGElement("line", {
      x1: margin.left,
      y1: height + margin.top,
      x2: width + margin.left,
      y2: height + margin.top,
      stroke: "black",
    })
  );

  // Y-axis line
  svg.appendChild(
    createSVGElement("line", {
      x1: margin.left,
      y1: margin.top,
      x2: margin.left,
      y2: height + margin.top,
      stroke: "black",
    })
  );
}

// export function renderBarChart(containerId, projectsData) {
//   const container = document.getElementById(containerId);
//   if (!container || !projectsData?.length) {
//     container.innerHTML =
//       '<div class="chart-placeholder">No project data available</div>';
//     return;
//   }

//   // Limit to top 10 projects for better readability
//   const topProjects = projectsData.slice(0, 10);
//   const maxXP = Math.max(...topProjects.map((p) => p.xp), 1);

//   container.innerHTML = '<svg width="100%" height="400"></svg>';
//   const svg = container.querySelector("svg");
//   svg.setAttribute("viewBox", "0 0 800 400");

//   // Chart dimensions
//   const margin = { top: 30, right: 30, bottom: 100, left: 60 }; // Extra bottom margin for project names
//   const width = 800 - margin.left - margin.right;
//   const height = 400 - margin.top - margin.bottom;

//   // Create X axis (projects)
//   const barWidth = Math.min(40, (width / topProjects.length) * 0.8);
//   const xPadding =
//     (width - barWidth * topProjects.length) / (topProjects.length + 1);

//   // Create Y axis (XP)
//   const yTicks = 5;
//   for (let i = 0; i <= yTicks; i++) {
//     const yValue = Math.floor((maxXP / yTicks) * i);
//     const yPos = height - height * (yValue / maxXP) + margin.top;

//     // Grid line
//     const gridLine = createSVGElement("line", {
//       x1: margin.left,
//       y1: yPos,
//       x2: width + margin.left,
//       y2: yPos,
//       stroke: "#e0e0e0",
//       "stroke-width": "1",
//     });
//     svg.appendChild(gridLine);

//     // Y axis label
//     const label = createSVGElement("text", {
//       x: margin.left - 10,
//       y: yPos + 5,
//       "text-anchor": "end",
//       "font-size": "12",
//       fill: "#666",
//     });
//     label.textContent = yValue.toLocaleString();
//     svg.appendChild(label);
//   }

//   // Create bars
//   topProjects.forEach((project, i) => {
//     const barHeight = (project.xp / maxXP) * height;
//     const x = margin.left + xPadding + i * (barWidth + xPadding);
//     const y = height - barHeight + margin.top;

//     // Bar
//     const bar = createSVGElement("rect", {
//       x: x,
//       y: y,
//       width: barWidth,
//       height: barHeight,
//       fill: "#0052B4",
//       rx: "2", // Rounded corners
//     });
//     svg.appendChild(bar);

//     // XP value above bar
//     const valueText = createSVGElement("text", {
//       x: x + barWidth / 2,
//       y: y - 5,
//       "text-anchor": "middle",
//       "font-size": "10",
//       "font-weight": "bold",
//       fill: "#0052B4",
//     });
//     valueText.textContent = project.xp.toLocaleString();
//     svg.appendChild(valueText);

//     // Project name below bar (rotated for readability)
//     const projectText = createSVGElement("text", {
//       x: x + barWidth / 2,
//       y: height + margin.top + 20,
//       "text-anchor": "end",
//       "font-size": "10",
//       transform: `rotate(-45, ${x + barWidth / 2}, ${
//         height + margin.top + 20
//       })`,
//       fill: "#666",
//     });
//     projectText.textContent = project.name;
//     svg.appendChild(projectText);
//   });

//   // Chart title
//   // const title = createSVGElement("text", {
//   //   x: margin.left-50,
//   //   y: margin.top -50,
//   //   "font-size": "14",
//   //   "font-weight": "bold",
//   //   fill: "#333",
//   // });
//   // title.textContent = "XP Earned by Project (Top 10)";
//   // svg.appendChild(title);
// }
//export { renderLineChart, renderBarChart, renderPassFailCircle };
