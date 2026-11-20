import { renderRoadmap } from "./roadmap.js";

const STORAGE_KEY = "leonida-ledger.progress.v2";
const sampleIds = [2, 3, 8, 10, 14, 15, 20, 28, 31, 36, 42, 46];
const gradeRank = { platinum: 0, gold: 1, silver: 2, bronze: 3 };
const trophies = await fetch("./data/trophies.json").then((response) => {
  if (!response.ok) throw new Error("Trophy data could not be loaded.");
  return response.json();
}).then((data) => data.trophies);

const elements = {
  list: document.querySelector("#trophy-list"),
  detail: document.querySelector("#detail-content"),
  placeholder: document.querySelector("#detail-placeholder"),
  roadmap: document.querySelector("#roadmap-content"),
  checklist: document.querySelector("#checklist-view"),
  roadmapView: document.querySelector("#roadmap-view"),
  empty: document.querySelector("#empty-state"),
  count: document.querySelector("#visible-count"),
  search: document.querySelector("#search"),
  kind: document.querySelector("#kind-filter"),
  grade: document.querySelector("#grade-filter"),
  earned: document.querySelector("#earned-filter"),
  sort: document.querySelector("#sort-order"),
  spoilers: document.querySelector("#spoiler-toggle"),
  sample: document.querySelector("#sample-banner")
};

function readProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return new Set(Array.isArray(saved.earned) ? saved.earned.map(Number) : []);
  } catch {
    return new Set();
  }
}

let earned = readProgress();
let selectedId = null;
let sampleMode = new URLSearchParams(location.search).get("sample") === "1";

if (sampleMode && !localStorage.getItem(STORAGE_KEY)) {
  earned = new Set(sampleIds);
  saveProgress();
}

function saveProgress() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, earned: [...earned].sort((a, b) => a - b) }));
  renderStats();
}

function titleFor(trophy) {
  return elements.spoilers.checked && trophy.kind === "story" && !earned.has(trophy.id)
    ? "Hidden story trophy — earn it to reveal"
    : trophy.name;
}

function descriptionFor(trophy) {
  return elements.spoilers.checked && trophy.kind === "story" && !earned.has(trophy.id)
    ? "The official story description is hidden until this trophy is earned."
    : trophy.description;
}

function currentTrophies() {
  let items = trophies.filter((trophy) => {
    const query = elements.search.value.trim().toLowerCase();
    const matchesQuery = !query || `${trophy.name} ${trophy.description} ${trophy.guide}`.toLowerCase().includes(query);
    const matchesKind = elements.kind.value === "all" || trophy.kind === elements.kind.value;
    const matchesGrade = elements.grade.value === "all" || trophy.grade === elements.grade.value;
    const matchesEarned = elements.earned.value === "all"
      || (elements.earned.value === "earned" ? earned.has(trophy.id) : !earned.has(trophy.id));
    return matchesQuery && matchesKind && matchesGrade && matchesEarned;
  });

  if (elements.sort.value === "grade") {
    items = [...items].sort((a, b) => gradeRank[a.grade] - gradeRank[b.grade] || a.id - b.id);
  } else if (elements.sort.value === "name") {
    items = [...items].sort((a, b) => a.name.localeCompare(b.name));
  } else {
    items = [...items].sort((a, b) => a.stage - b.stage || a.id - b.id);
  }
  return items;
}

function applyFilters() {
  const items = currentTrophies();
  elements.count.textContent = `${items.length} shown`;
  elements.empty.hidden = items.length > 0;
  elements.list.innerHTML = items.map((trophy) => {
    const isEarned = earned.has(trophy.id);
    const isSelected = selectedId === trophy.id;
    const hiddenName = titleFor(trophy);
    const target = trophy.target ? `<span class="target-chip">TARGET ${trophy.target}</span>` : "";
    const kind = trophy.kind === "story" ? "STORY" : trophy.kind.toUpperCase();
    return `<article class="trophy-row ${isEarned ? "is-earned" : ""} ${isSelected ? "is-selected" : ""}" data-row="${trophy.id}">
      <button class="grade-disc ${trophy.grade}" type="button" data-open="${trophy.id}" aria-label="Open ${hiddenName}"><span>${trophy.grade.slice(0, 1).toUpperCase()}</span></button>
      <button class="row-copy" type="button" data-open="${trophy.id}">
        <span class="row-title"><b>${hiddenName}</b><span class="row-id">#${String(trophy.id).padStart(2, "0")}</span></span>
        <span class="row-description">${descriptionFor(trophy)}</span>
        <span class="row-tags"><i>${kind}</i>${target}${trophy.missable ? "<i class=\"missable-tag\">MISSABLE</i>" : ""}</span>
      </button>
      <span class="grade-word ${trophy.grade}">${trophy.grade.toUpperCase()}</span>
      <label class="earned-control" title="Mark ${hiddenName} earned"><input type="checkbox" data-earned="${trophy.id}" ${isEarned ? "checked" : ""}><span><b>${isEarned ? "✓" : ""}</b></span></label>
    </article>`;
  }).join("");
}

function renderStats() {
  const total = earned.size;
  document.querySelector("#earned-total").textContent = String(total);
  document.querySelector("#progress-percent").textContent = `${Math.round((total / trophies.length) * 100)}%`;
  document.querySelector("#progress-fill").style.width = `${(total / trophies.length) * 100}%`;

  const gradeCounts = ["platinum", "gold", "silver", "bronze"].map((grade) => {
    const all = trophies.filter((trophy) => trophy.grade === grade);
    const done = all.filter((trophy) => earned.has(trophy.id)).length;
    return `<div class="grade-stat"><span class="grade-word ${grade}">${grade.toUpperCase()}</span><b>${done}<small> / ${all.length}</small></b><span class="mini-track"><i style="width:${all.length ? done / all.length * 100 : 0}%"></i></span></div>`;
  }).join("");
  document.querySelector("#stats-grade").innerHTML = gradeCounts;

  document.querySelector("#stats-stage").innerHTML = [1, 2, 3].map((stage) => {
    const members = trophies.filter((trophy) => trophy.stage === stage);
    const done = members.filter((trophy) => earned.has(trophy.id)).length;
    return `<span>STAGE 0${stage} <b>${done}<i>/${members.length}</i></b></span>`;
  }).join("");

  const next = [...trophies].sort((a, b) => a.stage - b.stage || a.id - b.id).find((trophy) => !earned.has(trophy.id));
  document.querySelector("#up-next").innerHTML = next
    ? `Up next <span>·</span> <b>Stage 0${next.stage}</b> ${titleFor(next)} <i>${next.grade.toUpperCase()}</i>`
    : "Up next · Every trophy earned. Leonida legend.";
  elements.sample.hidden = !sampleMode;
  applyFilters();
}

function renderDetail(id) {
  const index = trophies.findIndex((trophy) => trophy.id === Number(id));
  if (index < 0) return;
  const trophy = trophies[index];
  selectedId = trophy.id;
  const prev = trophies[(index - 1 + trophies.length) % trophies.length];
  const next = trophies[(index + 1) % trophies.length];
  const sources = trophy.sources.map((source) => `<a href="${source.url}" target="_blank" rel="noreferrer">${source.name}<span>↗</span></a>`).join("");
  const steps = trophy.steps?.length ? `<div class="detail-section"><p class="section-kicker">FIELD STEPS</p><ol>${trophy.steps.map((step) => `<li>${step}</li>`).join("")}</ol></div>` : "";
  const missable = trophy.missable ? `<div class="detail-alert"><b>MISSABLE · CHAPTER 1</b><p>Do Lucia's balcony meditation after Down to Earth. Keep a manual save from Chapter 1 until the trophy appears; the exact necessity is still being confirmed.</p></div>` : "";
  const unconfirmed = /unconfirmed/i.test(trophy.guide) ? `<p class="unconfirmed-note"><b>UNCONFIRMED</b> Some trigger details are still being verified by the listed sources.</p>` : "";
  const target = trophy.target ? `<span class="target-chip">TARGET ${trophy.target}</span>` : "";

  elements.placeholder.hidden = true;
  elements.detail.hidden = false;
  elements.detail.innerHTML = `<div class="detail-nav"><button data-navigate="${prev.id}" type="button">← PREV <span>#${String(prev.id).padStart(2, "0")}</span></button><button data-navigate="${next.id}" type="button">NEXT → <span>#${String(next.id).padStart(2, "0")}</span></button></div>
    ${missable}
    <div class="detail-grade-line"><span class="grade-disc large ${trophy.grade}"><span>${trophy.grade.slice(0, 1).toUpperCase()}</span></span><span class="grade-word ${trophy.grade}">${trophy.grade.toUpperCase()}</span><span class="detail-kind">${trophy.kind.toUpperCase()}</span>${target}</div>
    <p class="eyebrow">TROPHY ${String(trophy.id).padStart(2, "0")} · STAGE 0${trophy.stage}</p>
    <h2>${titleFor(trophy)}</h2><p class="official-label">OFFICIAL DESCRIPTION</p><p class="official-description">${descriptionFor(trophy)}</p>
    <div class="detail-section guide-copy"><p class="section-kicker">THE GUIDE</p><p>${trophy.guide}</p></div>
    ${unconfirmed}${steps}
    <div class="detail-section source-section"><p class="section-kicker">SOURCES · ${trophy.sources.length} REFERENCES</p><div class="source-list">${sources}</div></div>
    <button class="detail-earned ${earned.has(trophy.id) ? "done" : ""}" data-earned="${trophy.id}" type="button">${earned.has(trophy.id) ? "✓  EARNED" : "＋  MARK AS EARNED"}</button>`;
  applyFilters();
}

function syncFromHash() {
  const hash = location.hash.slice(1);
  const params = new URLSearchParams(hash);
  const filter = params.get("filter");
  const trophy = params.get("trophy");
  if (filter === "missable") elements.kind.value = "missable";
  if (params.has("spoilers")) elements.spoilers.checked = params.get("spoilers") === "on";
  const isRoadmap = hash === "roadmap";
  elements.checklist.hidden = isRoadmap;
  elements.roadmapView.hidden = !isRoadmap;
  document.querySelectorAll("[data-nav]").forEach((link) => link.classList.toggle("active", link.dataset.nav === (isRoadmap ? "roadmap" : "checklist")));
  if (isRoadmap) renderRoadmap(elements.roadmap);
  if (trophy) renderDetail(trophy);
  else if (!isRoadmap && !selectedId) {
    elements.detail.hidden = true;
    elements.placeholder.hidden = false;
  }
  applyFilters();
}

elements.list.addEventListener("click", (event) => {
  const button = event.target.closest("[data-open]");
  if (button) location.hash = `trophy=${button.dataset.open}`;
});

document.addEventListener("change", (event) => {
  if (event.target.matches("[data-earned]")) {
    const id = Number(event.target.dataset.earned);
    if (event.target.checked) earned.add(id);
    else earned.delete(id);
    saveProgress();
    if (selectedId) renderDetail(selectedId);
  }
  if ([elements.kind, elements.grade, elements.earned, elements.sort, elements.spoilers].includes(event.target)) applyFilters();
});

document.addEventListener("click", (event) => {
  const nav = event.target.closest("[data-navigate]");
  if (nav) location.hash = `trophy=${nav.dataset.navigate}`;
  const detailEarned = event.target.closest(".detail-earned");
  if (detailEarned) {
    const id = Number(detailEarned.dataset.earned);
    earned.has(id) ? earned.delete(id) : earned.add(id);
    saveProgress();
    renderDetail(id);
  }
});

elements.search.addEventListener("input", applyFilters);
document.querySelector("#export-progress").addEventListener("click", () => {
  const blob = new Blob([JSON.stringify({ game: "Grand Theft Auto VI", version: 2, earned: [...earned] }, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "leonida-ledger-progress.json";
  link.click();
  URL.revokeObjectURL(link.href);
});

document.querySelector("#import-progress").addEventListener("change", async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  try {
    const imported = JSON.parse(await file.text());
    const validIds = new Set(trophies.map((trophy) => trophy.id));
    earned = new Set((Array.isArray(imported.earned) ? imported.earned : []).map(Number).filter((id) => validIds.has(id)));
    sampleMode = false;
    saveProgress();
  } catch {
    window.alert("That file could not be read as a Leonida Ledger progress export.");
  }
  event.target.value = "";
});

document.querySelector("#clear-sample").addEventListener("click", () => {
  earned = new Set();
  sampleMode = false;
  saveProgress();
});

window.addEventListener("hashchange", syncFromHash);
renderStats();
syncFromHash();
