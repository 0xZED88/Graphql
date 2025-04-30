export function createSVGElement(type, attributes = {}) {
  const ns = "http://www.w3.org/2000/svg";
  const element = document.createElementNS(ns, type);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

export function formatXP(xp) {
  if (xp >= 1000) {
    // Round to the nearest thousand and display as kB
    return Math.round(xp / 1000) + " kB";
  } else {
    return xp.toFixed(2) + " XP";
  }
}

