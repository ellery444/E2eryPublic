// Apply before first paint. Old day/night preferences intentionally become NORMAL.
try {
  document.documentElement.dataset.mode =
    localStorage.getItem('e2eryPublicMode') === 'overdrive' ? 'overdrive' : 'normal';
} catch {
  document.documentElement.dataset.mode = 'normal';
}
