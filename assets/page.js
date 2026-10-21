(() => {
  const root = document.documentElement;
  const button = document.getElementById('themeButton');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let animationTimer;

  // Window chrome is decorative: original content and link destinations stay intact.
  document.querySelectorAll('.panel:not(.chapter-nav), .card').forEach((panel, index) => {
    const bar = document.createElement('div');
    bar.className = 'window-bar';
    bar.setAttribute('aria-hidden', 'true');
    const label = panel.classList.contains('clock-panel') ? 'clock / local' :
      panel.querySelector('.eyebrow, h3, h2')?.textContent.trim().toLowerCase() || 'reader';
    const path = document.createElement('span');
    path.className = 'window-path';
    path.textContent = `${String(index + 1).padStart(2, '0')} / ~/${label}`;
    const controls = document.createElement('span');
    controls.className = 'window-controls';
    controls.textContent = '─ □';
    bar.append(path, controls);
    panel.prepend(bar);
    panel.style.setProperty('--signal-delay', `${Math.min(index, 7) * 35}ms`);
  });

  const status = document.createElement('div');
  status.className = 'system-status';
  status.setAttribute('role', 'status');
  document.querySelector('footer')?.append(status);
  const hint = document.createElement('div');
  hint.className = 'gesture-hint';
  hint.textContent = 'LMB ↓ OVERDRIVE / ↑ NORMAL · 横向拖动选择文字';
  document.querySelector('.topbar')?.after(hint);
  const main = document.querySelector('main');
  if (main) {
    main.id = 'main-content';
    main.tabIndex = -1;
    const skip = document.createElement('a');
    skip.href = '#main-content';
    skip.className = 'skip-link';
    skip.textContent = '跳到正文';
    document.body.prepend(skip);
  }
  document.querySelectorAll('nav a').forEach(link => {
    if (!link.hash && link.pathname === location.pathname) link.setAttribute('aria-current', 'page');
  });

  // Slice the rendered interface, not its DOM: links, focus and IDs stay intact.
  const svgNS = 'http://www.w3.org/2000/svg';
  function svgNode(name, attributes = {}) {
    const node = document.createElementNS(svgNS, name);
    for (const [key, value] of Object.entries(attributes)) node.setAttribute(key, value);
    return node;
  }
  const effect = svgNode('svg', { width: 0, height: 0, 'aria-hidden': 'true', focusable: 'false' });
  effect.style.position = 'absolute';
  const defs = svgNode('defs');
  const filter = svgNode('filter', {
    id: 'screen-slice', filterUnits: 'userSpaceOnUse', primitiveUnits: 'userSpaceOnUse',
    'color-interpolation-filters': 'sRGB'
  });
  const bands = [-5, 5, -5].map((dx, index) => {
    const mask = svgNode('feFlood', { 'flood-color': 'white', result: `band-${index}` });
    const crop = svgNode('feComposite', { in: 'SourceGraphic', in2: `band-${index}`, operator: 'in', result: `crop-${index}` });
    const offset = svgNode('feOffset', { in: `crop-${index}`, dx, dy: 0, result: `shift-${index}` });
    filter.append(mask, crop, offset);
    return mask;
  });
  const merge = svgNode('feMerge');
  bands.forEach((_, index) => merge.append(svgNode('feMergeNode', { in: `shift-${index}` })));
  filter.append(merge);
  defs.append(filter);
  effect.append(defs);
  document.body.append(effect);

  function updateScreenSlices() {
    if (!main) return;
    const rect = main.getBoundingClientRect();
    const clamp = value => Math.max(0, Math.min(rect.height, value));
    // Boundaries follow the visible viewport, including when switching after scrolling.
    const edges = [0, clamp(innerHeight / 3 - rect.top), clamp(innerHeight * 2 / 3 - rect.top), rect.height];
    filter.setAttribute('x', '-8');
    filter.setAttribute('y', '0');
    filter.setAttribute('width', rect.width + 16);
    filter.setAttribute('height', rect.height);
    bands.forEach((band, index) => {
      band.setAttribute('x', '0');
      band.setAttribute('y', edges[index]);
      band.setAttribute('width', rect.width);
      band.setAttribute('height', edges[index + 1] - edges[index]);
    });
  }
  for (const event of ['scroll', 'resize']) {
    window.addEventListener(event, () => {
      if (document.body.classList.contains('mode-switching')) updateScreenSlices();
    }, { passive: true });
  }

  function applyMode(mode, animate = false, persist = true) {
    const next = mode === 'overdrive' ? 'overdrive' : 'normal';
    const changed = root.dataset.mode !== next;
    root.dataset.mode = next;
    const active = next === 'overdrive';
    if (button) {
      button.textContent = active ? 'NORMAL' : 'OVERDRIVE';
      button.setAttribute('aria-label', active ? '当前 OVERDRIVE，切换到 NORMAL 模式' : '当前 NORMAL，切换到 OVERDRIVE 模式');
    }
    status.textContent = active ? 'OVERDRIVE / HELLO MA AMIE' : 'STABLE / NORMAL';
    clearTimeout(animationTimer);
    document.body.classList.remove('mode-switching');
    if (animate && changed && !reducedMotion.matches) {
      updateScreenSlices();
      void document.body.offsetWidth;
      document.body.classList.add('mode-switching');
      animationTimer = setTimeout(() => document.body.classList.remove('mode-switching'), 720);
    }
    if (persist) {
      try { localStorage.setItem('e2eryPublicMode', next); } catch { /* Private storage may be unavailable. */ }
    }
  }
  button?.addEventListener('click', () => applyMode(root.dataset.mode === 'overdrive' ? 'normal' : 'overdrive', true));
  applyMode(root.dataset.mode, false, false);
  window.addEventListener('storage', event => {
    if (event.key === 'e2eryPublicMode') applyMode(event.newValue, false, false);
  });

  let drag = null;
  let suppressClick = false;
  let clickTimer;
  function finishDrag() {
    drag = null;
    document.body.classList.remove('theme-dragging');
  }
  document.addEventListener('pointerdown', event => {
    clearTimeout(clickTimer);
    suppressClick = false;
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target.closest('a, button, input, textarea, select, [contenteditable], [role="button"]')) return;
    drag = { x: event.clientX, y: event.clientY, locked: false, triggered: false };
  });
  document.addEventListener('pointermove', event => {
    if (!drag) return;
    if (!(event.buttons & 1)) return finishDrag();
    const dx = event.clientX - drag.x;
    const dy = event.clientY - drag.y;
    if (!drag.locked && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy)) return finishDrag();
    if (Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx) * 1.2) drag.locked = true;
    if (!drag.locked) return;
    document.body.classList.add('theme-dragging');
    event.preventDefault();
    window.getSelection()?.removeAllRanges();
    if (!drag.triggered && Math.abs(dy) >= 90) {
      applyMode(dy > 0 ? 'overdrive' : 'normal', true);
      drag.triggered = true;
      suppressClick = true;
    }
  }, { passive: false });
  document.addEventListener('pointerup', () => {
    finishDrag();
    clickTimer = setTimeout(() => { suppressClick = false; }, 0);
  });
  document.addEventListener('pointercancel', () => { finishDrag(); suppressClick = false; });
  window.addEventListener('blur', () => { finishDrag(); suppressClick = false; });
  document.addEventListener('dragstart', event => { if (drag) event.preventDefault(); });
  document.addEventListener('click', event => {
    if (suppressClick) { event.preventDefault(); event.stopPropagation(); suppressClick = false; }
  }, true);

  const clock = document.getElementById('clock');
  const date = document.getElementById('date');
  function updateClock() {
    const now = new Date();
    if (clock) clock.textContent = now.toLocaleTimeString('zh-CN', { hour12: false });
    if (date) date.textContent = now.toLocaleDateString('zh-CN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  }
  if (clock) { updateClock(); setInterval(updateClock, 1000); }
  const quotes = ['GOOD DAY, Dr.', 'Have fun, Dr.', 'Tidy up.', 'Take a break.', 'Good luck, Dr.', 'Nice work.'];
  const quote = document.getElementById('quote');
  if (quote) quote.textContent = quotes[Math.floor(Math.random() * quotes.length)];
})();
