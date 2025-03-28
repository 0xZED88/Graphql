// js/utils/helpers.js

export function createSVGElement(type, attributes = {}) {
  const ns = "http://www.w3.org/2000/svg";
  const element = document.createElementNS(ns, type);
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value);
  });
  return element;
}

export function groupByDay(transactions) {
  const grouped = {};

  transactions.forEach((t) => {
    const date = new Date(t.createdAt).toDateString();
    if (!grouped[date]) {
      grouped[date] = {
        date: t.createdAt,
        xp: 0,
        projects: [],
      };
    }

    grouped[date].xp += t.amount;
    grouped[date].projects.push(t);
  });

  return Object.values(grouped).sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );
}

export function formatShortDate(dateString) {
    const date = new Date(dateString);
    const options = { month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  }