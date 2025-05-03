export function createSVGElement(type, attributes = {}) {
  const ns = "http://www.w3.org/2000/svg";
  const element = document.createElementNS(ns, type);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}
export function formatXP(xp) {
  return (xp / 1000).toFixed() + " KB";
}
