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

// export function formatXP(xp) {
//   if (xp >= 1000000) {
//     // Special conversion factor to match school's calculation
//     const mb = (xp / 1090000).toFixed(2);
//     return `${mb} MB`;
//   } else if (xp >= 1000) {
//     return `${Math.ceil(xp / 1000)} KB`;
//   }
//   return `${xp} B`;
// }