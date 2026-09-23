// Highlight the download that matches the visitor's system: that button stays gold and comes first, the other one turns plain.
// A Mac, phone or tablet has no desktop version yet, so only those visitors see the (otherwise hidden) line pointing at the web client.
(function () {
  const win = document.getElementById('dl-windows');
  const lin = document.getElementById('dl-linux');
  if (!win || !lin) return;

  const ua = navigator.userAgent;
  const platform = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || '';
  const mobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const isWindows = /Win/i.test(platform) || /Windows/i.test(ua);
  const isLinux = !mobile && !/CrOS/i.test(ua) && (/Linux/i.test(platform) || /Linux|X11/i.test(ua)) && !isWindows;

  function plain(a) { a.classList.remove('btn-primary'); a.classList.add('btn-secondary'); }

  if (isWindows) {
    plain(lin);
  } else if (isLinux) {
    plain(win);
    if (lin.parentNode === win.parentNode) lin.parentNode.insertBefore(lin, win);   // same row (home page) only, never across cards
  } else {
    const hint = document.getElementById('alt-hint');
    if (hint) {
      hint.hidden = false;
      hint.innerHTML = 'On a Mac, phone or Chromebook? There is no desktop version for it yet, but you can ' +
        '<a href="https://play.warriorsandwizards.com">play the Web Client in your browser</a>.';
    }
  }
})();
