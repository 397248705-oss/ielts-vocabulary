export function registerServiceWorker(
  base: string,
  targetWindow: Window = window,
  targetNavigator: Navigator = navigator
): void {
  if (!('serviceWorker' in targetNavigator)) {
    return;
  }

  targetWindow.addEventListener('load', () => {
    targetNavigator.serviceWorker.register(`${base}sw.js`).catch(() => undefined);
  });
}
