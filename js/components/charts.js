import { createSVGElement } from "../../utils/helpers.js";

export function renderSkillsChart(containerId, skillsData) {
  const container = document.getElementById(containerId);
  if (!container || !skillsData?.length) {
    container.innerHTML =
      '<div class="chart-placeholder">No skills data available</div>';
    return;
  }

  // Clear previous content
  container.innerHTML =
    '<svg width="100%" height="450" viewBox="0 0 850 450"></svg>';
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
