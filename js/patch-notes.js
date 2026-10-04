// The Patch Notes page (2026-10-01: the patch notes live on the website only - no longer in the game or The Portal).
// Reads the game's own list from the public API (the patch notes file the server ships + the entries posted from the Developer Dashboard),
// newest first, grouped by month: the version big, "Author - date" small, the update's title, its bullets.
(function () {
  // (?api=<url> reads another server - for testing against a local one)
  const API = new URLSearchParams(location.search).get('api') || 'https://portal.warriorsandwizards.com/api/public/releases';
  const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const monthOf = (date) => { const m = /^(\d{4})-(\d{2})/.exec(date || ''); return m ? `${MONTHS[+m[2] - 1]} ${m[1]}` : 'Undated'; };
  const idOf = (label) => 'm-' + label.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  function render(d) {
    const current = $('pn-current');
    current.innerHTML = d.version ? `The game is on version <b>${esc(d.version)}</b>. Every update, newest first.` : 'Every update, newest first.';
    const list = d.releases || [];
    if (!list.length) { $('pn-list').innerHTML = '<div class="card pn-note"><p class="fine">Nothing written down yet.</p></div>'; return; }
    let html = '', month = null;
    const months = [];
    for (const r of list) {
      const m = monthOf(r.date);
      if (m !== month) {
        if (month !== null) html += '</section>';
        month = m;
        months.push(m);
        html += `<section class="pn-month" id="${idOf(m)}"><h2 class="pn-month-title">${esc(m)}</h2>`;
      }
      const heading = r.version ? `v${esc(r.version)}` : 'Early Beta';
      const meta = `Author: ${esc(r.author || 'riigged')}${r.date ? ` &nbsp;&middot;&nbsp; ${esc(r.date)}` : ''}`;
      html += `<article class="card pn-note"><h3 class="pn-version">${heading}</h3><div class="pn-meta">${meta}</div>` +
              `<h4 class="pn-title">${esc(r.title)}</h4><ul>${(r.lines || []).map((l) => `<li>${esc(l)}</li>`).join('')}</ul></article>`;
    }
    if (month !== null) html += '</section>';
    $('pn-list').innerHTML = html;
    $('pn-months').innerHTML = months.length > 1 ? months.map((m) => `<a href="#${idOf(m)}">${esc(m)}</a>`).join(' &middot; ') : '';
  }

  fetch(API, { headers: { Accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(render)
    .catch(() => {
      $('pn-current').innerHTML = 'The patch notes could not be loaded right now. Please try again in a moment.';
    });
})();
