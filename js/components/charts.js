import { createSVGElement } from "../../utils/helpers.js";

////////////////////////////////////////////// FIRST GRAPH (BAR) ////////////////////////////////////////////////

export function renderBarChart(containerId, projectsData) {
  const container = document.getElementById(containerId);
  if (!container || !projectsData?.length) {
    container.innerHTML =
      '<div class="chart-placeholder">No project data</div>';
    return;
  }

  // limit to top 10 projects
  const topProjects = projectsData.slice(0, 10);
  const maxXP = Math.max(...topProjects.map((p) => p.xp), 1);

  // Create SVG container
  container.innerHTML = '<svg width="100%" height="400"></svg>';
  const svg = container.querySelector("svg");
  svg.setAttribute("viewBox", "0 0 800 400");

  // Chart dimensions and margins
  const margin = { top: 20, right: 20, bottom: 70, left: 50 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Calculate bar dimensions
  const barWidth = 40;
  const barSpacing =
    (width - barWidth * topProjects.length) / (topProjects.length + 1);

  // Add "XP"
  const yAxisLabel = createSVGElement("text", {
    x: margin.left - 10,
    y: margin.top + height / 2,
    "text-anchor": "end",
    "font-size": "12",
    "font-weight": "bold",
  });
  yAxisLabel.textContent = "XP";
  svg.appendChild(yAxisLabel);

  // Create bars and labels
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

    // XP value flbars
    const valueLabel = createSVGElement("text", {
      x: x + barWidth / 2,
      y: y - 5,
      "text-anchor": "middle",
      "font-size": "10",
    });
    valueLabel.textContent = project.xp.toLocaleString();
    svg.appendChild(valueLabel);

    // Project name
    const nameLabel = createSVGElement("text", {
      x: x + barWidth / 2,
      y: height + margin.top + 20,
      "text-anchor": "end",
      transform: `rotate(-35, ${x + barWidth / 2}, ${
        height + margin.top + 20
      })`,
      "font-size": "10",
    });
    nameLabel.textContent = project.name;
    svg.appendChild(nameLabel);
  });

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
////////////////////////////////////////////// SECOUND GRAPH (POLYLINE) ////////////////////////////////////////////////

export function renderSkillsChart(containerId, skillsData) {
  const container = document.getElementById(containerId);
  if (!container || !skillsData?.length) {
    container.innerHTML =
      '<div class="chart-placeholder">No skills data available</div>';
    return;
  }

  // Clear previous content
  container.innerHTML = "";
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "100%");
  svg.setAttribute("height", "400");
  svg.setAttribute("viewBox", "0 0 650 400");
  container.appendChild(svg);

  // Add title
  const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
  title.setAttribute("x", 250);
  title.setAttribute("y", 380);
  title.setAttribute("font-size", "18");
  title.setAttribute("fill", "black");
  title.textContent = "Skills Progress";
  svg.appendChild(title);

  // X-axis line
  const lineX = document.createElementNS("http://www.w3.org/2000/svg", "line");
  lineX.setAttribute("x1", 30);
  lineX.setAttribute("y1", 350);
  lineX.setAttribute("x2", 600);
  lineX.setAttribute("y2", 350);
  lineX.setAttribute("stroke", "black");
  svg.appendChild(lineX);

  // Y-axis line
  const lineY = document.createElementNS("http://www.w3.org/2000/svg", "line");
  lineY.setAttribute("x1", 30);
  lineY.setAttribute("y1", 50);
  lineY.setAttribute("x2", 30);
  lineY.setAttribute("y2", 350);
  lineY.setAttribute("stroke", "black");
  svg.appendChild(lineY);

  // Sort skills alphabetically
  const sortedSkills = [...skillsData].sort((a, b) =>
    a.type.localeCompare(b.type)
  );

  // Calculate spacing between skills on X-axis
  const xScale = 500 / (sortedSkills.length - 1);
  const yScale = 300 / 100; // 100% is max value

  // Build the polyline points
  let points = "";
  sortedSkills.forEach((skill, index) => {
    const x = 30 + index * xScale;
    const y = 350 - skill.amount * yScale;
    points += `${x},${y} `;
  });

  // Create the polyline
  const polyline = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "polyline"
  );
  polyline.setAttribute("fill", "none");
  polyline.setAttribute("stroke", "#444cf7");
  polyline.setAttribute("stroke-width", "2");
  polyline.setAttribute("points", points);
  svg.appendChild(polyline);

  // Add circles and enhanced tooltips for each skill point
  sortedSkills.forEach((skill, index) => {
    const x = 30 + index * xScale;
    const y = 350 - skill.amount * yScale;
    const skillName = skill.type.split("_")[1] || skill.type;

    // Create circle
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", 5);
    circle.setAttribute("fill", "#444cf7");

    // Add enhanced tooltip
    const tooltip = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "title"
    );
    tooltip.textContent = `${skillName}`;
    circle.appendChild(tooltip);
    svg.appendChild(circle);

    // Add percentage label above the point
    const percentLabel = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    percentLabel.setAttribute("x", x);
    percentLabel.setAttribute("y", y - 10);
    percentLabel.setAttribute("font-size", "10");
    percentLabel.setAttribute("text-anchor", "middle");
    percentLabel.textContent = `${skill.amount}%`;
    svg.appendChild(percentLabel);
  });

  [0, 25, 50, 75, 100].forEach((percent) => {
    const y = 350 - percent * yScale;

    // Add grid line
    // const gridLine = document.createElementNS(
    //   "http://www.w3.org/2000/svg",
    //   "line"
    // );
    // gridLine.setAttribute("x1", 30);
    // gridLine.setAttribute("y1", y);
    // gridLine.setAttribute("x2", 600);
    // gridLine.setAttribute("y2", y);
    // gridLine.setAttribute("stroke", "#e0e0e0");
    // svg.appendChild(gridLine);

    // Add label
    const label = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    label.setAttribute("x", 25);
    label.setAttribute("y", y + 5);
    label.setAttribute("font-size", "10");
    label.setAttribute("text-anchor", "end");
    label.textContent = `${percent}%`;
    svg.appendChild(label);
  });
}
