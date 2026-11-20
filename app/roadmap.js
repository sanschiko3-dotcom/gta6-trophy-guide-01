export const completionTargets = [
  ["Story", "100%"],
  ["Gang Operations", "39 / 39"],
  ["Bank Jobs", "22 / 22"],
  ["Bank Vaults", "8 / 8"],
  ["Collectible Card Sets", "15 / 18"],
  ["WAiNK Locations", "100"],
  ["Underwater Discoveries", "33 / 33"],
  ["Meditations", "15 / 18"],
  ["Cocaine Flamingos", "100 / 125"],
  ["Unique Races Won", "30 / 40"],
  ["Shooting Range Gold Medals", "42 / 42"],
  ["Drone Time Trials", "42 / 42"],
  ["Stunts", "300 / 397"],
  ["Challenges", "70 / 80"],
  ["Bret's Target Decks", "15 / 15"]
];

const targetMarkup = completionTargets.map(([name, count]) => `
  <div class="target-cell"><span>${name}</span><b>${count}</b></div>`).join("");

export function renderRoadmap(container) {
  container.innerHTML = `
    <div class="missable-callout">
      <span class="callout-icon">!</span>
      <div><p class="eyebrow">ONE MISSABLE · POSITIVE MENTAL ATTITUDE</p>
        <h3>Save the Chapter 1 moment.</h3>
        <p>After <b>Down to Earth</b>, visit Jason's house in the morning. Follow Lucia to the balcony and accept the meditation. Keep a Chapter 1 manual save until the trophy pops; its exact necessity is still being confirmed, so do it anyway.</p>
      </div>
      <a href="#trophy=28" class="callout-link">Open guide <span>↗</span></a>
    </div>

    <div class="roadmap-grid">
      <article class="stage-card stage-one">
        <div class="stage-top"><span class="stage-number">01</span><span class="stage-time">60–80 HOURS</span></div>
        <p class="eyebrow">CHAPTERS 1–4 + FINALE</p><h3>Story first</h3>
        <p>Move through the five chapters while protecting the one time-sensitive meditation and Yago's race strand.</p>
        <ul class="route-list">
          <li><b>Ch. 1 · Gone Fishing → Down to Earth</b><span>Do Lucia's balcony meditation; hold a save.</span></li>
          <li><b>Ch. 2 · Coffee Break → Daily Driver</b><span>Unlock partner switching, garages and Scooter Bros.</span></li>
          <li><b>Ch. 3 · Race Against Yago</b><span>Save and race when its hourglass marker appears.</span></li>
          <li><b>Ch. 4 · That's Where The Money Is</b><span>Open the bank-vault job chain near the end.</span></li>
          <li><b>Final mission</b><span>Keep a manual save before starting the finale.</span></li>
        </ul>
        <div class="stage-foot"><span>CHAPTER SAVE SLOTS</span><b>15 manual saves available</b></div>
      </article>

      <article class="stage-card stage-two">
        <div class="stage-top"><span class="stage-number">02</span><span class="stage-time">ABOUT 100 HOURS</span></div>
        <p class="eyebrow">PROGRESS › STATS › 100% COMPLETION</p><h3>Build the full file</h3>
        <p>Earlier work counts. Clear robbery income first, then collectibles and activity counters.</p>
        <div class="targets-heading"><span>100% CHECKLIST · VERIFIED COUNTS</span><span>15 TRACKED</span></div>
        <div class="targets-grid">${targetMarkup}</div>
        <div class="stage-foot"><span>FUND THE CLEANUP</span><b>Robberies → collectibles → activities</b></div>
      </article>

      <article class="stage-card stage-three">
        <div class="stage-top"><span class="stage-number">03</span><span class="stage-time">10–20 HOURS</span></div>
        <p class="eyebrow">FREE ROAM CLEANUP</p><h3>Close the ledger</h3>
        <p>Return to open strands, finish every qualifying finale, and let the last trophy resolve.</p>
        <ul class="route-list">
          <li><b>Strangers & Freaks · 8 strands</b><span>Track the counter; Andy, Billy and Tyrone have separate trophies.</span></li>
          <li><b>Side-story finales</b><span>Kenton, Billy, Andy, Randy and Tyrone remain open after the story.</span></li>
          <li><b>Meditations · 18 total</b><span>Outdoor spots can count for both characters.</span></li>
          <li><b>Vice Got a Price!</b><span>Earn the other 54 trophies for the platinum.</span></li>
        </ul>
        <a class="final-link" href="#trophy=1">View the platinum trophy <span>→</span></a>
      </article>
    </div>
    <p class="roadmap-footnote">No difficulty trophies · No online trophies · Cheats disable trophies and saving on that save.</p>
  `;
}
