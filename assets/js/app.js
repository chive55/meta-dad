/* Meta Dad site app: daily joke rotation, joke archive, merch grid. */

const MERCH = [
  { slug: "mustache-emblem", name: "Mustache Badge", item: "Tee" },
  { slug: "catchphrase-tee", name: "So Bad, They're Good", item: "Tee" },
  { slug: "character-tee", name: "Winking Meta Dad", item: "Tee" },
  { slug: "mug-design", name: "I Tell Dad Jokes", item: "Mug" },
  { slug: "halloween-tee", name: "Halloween Vampire Dad", item: "Tee" },
  { slug: "punniest-dad", name: "World's Punniest Dad", item: "Tee" },
  { slug: "loading-tee", name: "Dad Joke Loading", item: "Tee" },
  { slug: "joke-club", name: "Dad Joke Club", item: "Tee" },
  { slug: "groan-maker", name: "Certified Groan Maker", item: "Tee" },
  { slug: "ask-your-mother", name: "Ask Your Mother", item: "Tee" },
  { slug: "dad-fuel", name: "Dad Fuel", item: "Tee" },
  { slug: "powered-by-puns", name: "Powered by Puns", item: "Tee" },
];

function splitJoke(text) {
  const i = text.search(/[.!?]/);
  if (i === -1) return { setup: text, punchline: "" };
  return { setup: text.slice(0, i + 1).trim(), punchline: text.slice(i + 1).trim() };
}

/* --- Today's joke: rotates through the 100 by day of year --- */
(function dailyJoke() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now - start) / 86400000);
  const joke = DAD_JOKES[dayOfYear % DAD_JOKES.length];
  const { setup, punchline } = splitJoke(joke.text);
  document.getElementById("daily-setup").textContent = setup;
  document.getElementById("daily-meta").textContent =
    "Joke #" + joke.n + " of 100 · " + joke.category;
  const punchEl = document.getElementById("daily-punchline");
  const btn = document.getElementById("reveal-btn");
  if (punchline) {
    punchEl.textContent = punchline;
    btn.addEventListener("click", () => {
      punchEl.classList.remove("hidden");
      btn.style.display = "none";
    });
  } else {
    punchEl.textContent = "";
    btn.style.display = "none";
  }
})();

/* --- Joke archive --- */
const FREE_LIMIT = 20; /* free teaser jokes per tab; the rest live in the book */
const state = { set: "daily", category: "All", query: "" };

function currentSet() {
  return state.set === "daily" ? DAD_JOKES : HALLOWEEN_JOKES;
}
function setLabel() {
  return state.set === "daily" ? "Daily 100" : "Halloween 100";
}

function renderChips() {
  const cats = ["All", ...new Set(currentSet().slice(0, FREE_LIMIT).map((j) => j.category))];
  const wrap = document.getElementById("category-chips");
  wrap.innerHTML = "";
  cats.forEach((c) => {
    const b = document.createElement("button");
    b.className = "chip" + (c === state.category ? " active" : "");
    b.textContent = c;
    b.addEventListener("click", () => { state.category = c; renderChips(); renderGrid(); });
    wrap.appendChild(b);
  });
}

function renderGrid() {
  const q = state.query.trim().toLowerCase();
  const free = currentSet().slice(0, FREE_LIMIT);
  const jokes = free.filter(
    (j) =>
      (state.category === "All" || j.category === state.category) &&
      (!q || j.text.toLowerCase().includes(q))
  );
  const grid = document.getElementById("joke-grid");
  grid.innerHTML = "";
  jokes.forEach((j) => {
    const { setup, punchline } = splitJoke(j.text);
    const card = document.createElement("div");
    card.className = "joke-card";
    const num = document.createElement("p");
    num.className = "joke-num";
    num.textContent = "#" + j.n + " · " + j.category;
    const s = document.createElement("p");
    s.className = "joke-setup";
    s.textContent = setup;
    card.appendChild(num);
    card.appendChild(s);
    if (punchline) {
      const p = document.createElement("p");
      p.className = "joke-punchline";
      p.textContent = punchline;
      card.appendChild(p);
    }
    grid.appendChild(card);
  });
  const lock = document.createElement("div");
  lock.className = "joke-card lock-card";
  const lockEmoji = document.createElement("p");
  lockEmoji.className = "lock-emoji";
  lockEmoji.textContent = "🔒";
  const lockTitle = document.createElement("p");
  lockTitle.className = "joke-setup";
  lockTitle.textContent = "Want the other 180?";
  const lockSub = document.createElement("p");
  lockSub.textContent = "All 200 groaners live in the book.";
  const lockBtn = document.createElement("a");
  lockBtn.className = "btn btn-primary";
  lockBtn.href = "#book";
  lockBtn.textContent = "Get the book";
  lock.appendChild(lockEmoji);
  lock.appendChild(lockTitle);
  lock.appendChild(lockSub);
  lock.appendChild(lockBtn);
  grid.appendChild(lock);
  document.getElementById("results-count").textContent =
    "Showing " + FREE_LIMIT + " free teasers · unlock all 200 in the book";
}

document.querySelectorAll(".tab").forEach((t) => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((x) => x.classList.remove("active"));
    t.classList.add("active");
    state.set = t.dataset.set;
    state.category = "All";
    renderChips();
    renderGrid();
  });
});
document.getElementById("joke-search").addEventListener("input", (e) => {
  state.query = e.target.value;
  renderGrid();
});
renderChips();
renderGrid();

/* --- Merch grid --- */
(function renderMerch() {
  const grid = document.getElementById("merch-grid");
  MERCH.forEach((m) => {
    const card = document.createElement("div");
    card.className = "merch-card";
    const img = document.createElement("img");
    img.src = "assets/img/merch/" + m.slug + ".webp";
    img.alt = m.name + " design";
    img.loading = "lazy";
    const badge = document.createElement("span");
    badge.className = "coming-soon";
    badge.textContent = "Coming soon";
    const info = document.createElement("div");
    info.className = "merch-info";
    const h = document.createElement("h3");
    h.textContent = m.name;
    const p = document.createElement("p");
    p.textContent = "Meta Dad " + m.item;
    info.appendChild(h);
    info.appendChild(p);
    card.appendChild(img);
    card.appendChild(badge);
    card.appendChild(info);
    grid.appendChild(card);
  });
})();
