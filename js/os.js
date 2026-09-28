// Highlight the download that matches the visitor's system: that button stays gold and comes first, the others turn plain.
// A phone, tablet or Chromebook has no desktop version, so only those visitors see the (otherwise hidden) line pointing at the web client.
// (The Mac got its own download on 2026-09-27; an iPad reports itself as a Mac, so a touch screen does not count as one.)
(function () {
  const buttons = { windows: document.getElementById('dl-windows'), linux: document.getElementById('dl-linux'), mac: document.getElementById('dl-mac') };
  if (!buttons.windows || !buttons.linux) return;

  const ua = navigator.userAgent;
  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  const touch = navigator.maxTouchPoints > 1;
  const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const isWindows = /Win/i.test(platform) || /Windows/i.test(ua);
  const isMac = !mobile && !touch && !isWindows && (/Mac/i.test(platform) || /Macintosh/i.test(ua));
  const isLinux = !mobile && !isMac && !/CrOS/i.test(ua) && (/Linux/i.test(platform) || /Linux|X11/i.test(ua)) && !isWindows;
  const mine = isWindows ? 'windows' : isMac ? 'mac' : isLinux ? 'linux' : null;

  function plain(a) { if (a) { a.classList.remove('btn-primary'); a.classList.add('btn-secondary'); } }

  if (mine && buttons[mine]) {
    for (const key in buttons) if (key !== mine) plain(buttons[key]);
    const first = buttons.windows;
    const me = buttons[mine];
    if (me !== first && me.parentNode === first.parentNode) me.parentNode.insertBefore(me, first);   // same row (home page) only, never across cards
  } else {
    const hint = document.getElementById('alt-hint');
    if (hint) {
      hint.hidden = false;
      hint.innerHTML = 'On a phone, tablet or Chromebook? There is no desktop version for it, but you can ' +
        '<a href="https://play.warriorsandwizards.com">play the Web Client in your browser</a>.';
    }
  }
})();
