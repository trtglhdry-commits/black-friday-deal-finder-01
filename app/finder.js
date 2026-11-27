// DealBeacon's finder: renders the deal cards and runs the search, the
// category chips, the store and discount filters, and the sort. All state
// lives in this module; the deals themselves live in deals.js.

import { DEALS, CATEGORIES, SIGNAL_LABELS, SIGNAL_RANK } from "./deals.js";

const grid = document.getElementById("grid");
const emptyNote = document.getElementById("empty");
const countLine = document.getElementById("count-line");
const searchInput = document.getElementById("search");
const storeSelect = document.getElementById("store");
const minDiscountSelect = document.getElementById("min-discount");
const sortSelect = document.getElementById("sort");
const chipRow = document.getElementById("categories");

const state = { query: "", category: "", store: "", minDiscount: 0, sort: "discount" };

export function discountOf(deal) {
  return Math.round(((deal.was - deal.price) / deal.was) * 100);
}

export function savingOf(deal) {
  return Math.round((deal.was - deal.price) * 100) / 100;
}

export function formatPrice(value) {
  return "$" + value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export function formatChecked(iso) {
  const date = new Date(iso);
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    hour12: false,
  }) + " UTC";
}

export function dealCard(deal) {
  const article = document.createElement("article");
  article.className = "card";

  const top = document.createElement("div");
  top.className = "card-top";
  const meta = document.createElement("span");
  meta.className = "card-meta";
  meta.textContent = deal.store + " · " + deal.category;
  const pill = document.createElement("span");
  pill.className = "pill pill-" + deal.signal;
  pill.textContent = SIGNAL_LABELS[deal.signal];
  top.append(meta, pill);

  const title = document.createElement("h3");
  title.textContent = deal.title;

  const priceRow = document.createElement("div");
  priceRow.className = "price-row";
  const price = document.createElement("span");
  price.className = "price";
  price.textContent = formatPrice(deal.price);
  const was = document.createElement("span");
  was.className = "was";
  was.textContent = formatPrice(deal.was);
  const save = document.createElement("span");
  save.className = "save";
  save.textContent = "−" + discountOf(deal) + "%";
  priceRow.append(price, was, save);

  const note = document.createElement("p");
  note.className = "signal-note";
  note.textContent = deal.note;

  const checked = document.createElement("p");
  checked.className = "checked-line";
  checked.textContent = "Checked " + formatChecked(deal.checked) + " · Source: " + deal.source;

  const link = document.createElement("a");
  link.className = "store-link";
  link.href = deal.url;
  link.target = "_blank";
  link.rel = "noopener";
  link.textContent = "View at " + deal.store;

  article.append(top, title, priceRow, note, checked, link);
  return article;
}

export function sortDeals(deals, sort) {
  const sorted = [...deals];
  if (sort === "discount") sorted.sort((a, b) => discountOf(b) - discountOf(a) || a.price - b.price);
  if (sort === "signal") sorted.sort((a, b) => SIGNAL_RANK[a.signal] - SIGNAL_RANK[b.signal] || discountOf(b) - discountOf(a));
  if (sort === "price") sorted.sort((a, b) => a.price - b.price);
  if (sort === "saving") sorted.sort((a, b) => savingOf(b) - savingOf(a));
  if (sort === "name") sorted.sort((a, b) => a.title.localeCompare(b.title));
  return sorted;
}

export function applyFilters() {
  const query = state.query.trim().toLowerCase();
  const shown = DEALS.filter((deal) => {
    if (state.category && deal.category !== state.category) return false;
    if (state.store && deal.store !== state.store) return false;
    if (discountOf(deal) < state.minDiscount) return false;
    if (query && !(deal.title + " " + deal.store + " " + deal.category).toLowerCase().includes(query)) return false;
    return true;
  });
  return sortDeals(shown, state.sort);
}

export function renderDeals() {
  const shown = applyFilters();
  grid.replaceChildren(...shown.map(dealCard));
  emptyNote.hidden = shown.length > 0;
  countLine.textContent =
    "Showing " + shown.length + " of " + DEALS.length + " deals" +
    (state.category ? " · " + state.category : "") +
    (state.store ? " · " + state.store : "") +
    (state.minDiscount ? " · " + state.minDiscount + "% off or more" : "");
}

export function buildCategoryChips() {
  const all = document.createElement("button");
  all.type = "button";
  all.className = "chip";
  all.textContent = "All categories";
  all.setAttribute("aria-pressed", "true");
  all.addEventListener("click", () => {
    state.category = "";
    chipRow.querySelectorAll(".chip").forEach((chip) => chip.setAttribute("aria-pressed", "false"));
    all.setAttribute("aria-pressed", "true");
    renderDeals();
  });
  chipRow.append(all);
  for (const category of CATEGORIES) {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.textContent = category;
    chip.setAttribute("aria-pressed", "false");
    chip.addEventListener("click", () => {
      state.category = category;
      chipRow.querySelectorAll(".chip").forEach((other) => other.setAttribute("aria-pressed", "false"));
      chip.setAttribute("aria-pressed", "true");
      renderDeals();
    });
    chipRow.append(chip);
  }
}

export function buildStoreOptions() {
  const stores = [...new Set(DEALS.map((deal) => deal.store))].sort();
  for (const store of stores) {
    const option = document.createElement("option");
    option.value = store;
    option.textContent = store;
    storeSelect.append(option);
  }
}

export function fillStats() {
  const stores = new Set(DEALS.map((deal) => deal.store)).size;
  const avg = Math.round(DEALS.reduce((sum, deal) => sum + discountOf(deal), 0) / DEALS.length);
  document.getElementById("stat-deals").textContent = String(DEALS.length);
  document.getElementById("stat-stores").textContent = String(stores);
  document.getElementById("stat-avg").textContent = avg + "%";
}

searchInput.addEventListener("input", () => {
  state.query = searchInput.value;
  renderDeals();
});
storeSelect.addEventListener("change", () => {
  state.store = storeSelect.value;
  renderDeals();
});
minDiscountSelect.addEventListener("change", () => {
  state.minDiscount = Number(minDiscountSelect.value);
  renderDeals();
});
sortSelect.addEventListener("change", () => {
  state.sort = sortSelect.value;
  renderDeals();
});

buildCategoryChips();
buildStoreOptions();
fillStats();
renderDeals();
