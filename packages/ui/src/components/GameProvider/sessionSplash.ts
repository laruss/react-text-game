/**
 * Key used to record, for the lifetime of a browser tab, that the splash
 * sequence has already been shown.
 *
 * `sessionStorage` is scoped to a single tab and survives in-tab reloads, while
 * a freshly opened tab starts with an empty store. That difference is what lets
 * the game show its splash screens only when opened in a new tab and skip them
 * on a reload.
 */
export const SPLASH_SESSION_KEY = "rtgSplashShown";

/**
 * Reports whether the splash sequence should run for the current tab session
 * and records that it has run.
 *
 * Returns `true` the first time it is called within a tab (a freshly opened
 * tab) and `false` on every later call, including after the tab is reloaded,
 * because the marker persists in `sessionStorage` for the tab's lifetime.
 *
 * @returns `true` for a freshly opened tab, `false` for an in-tab reload.
 */
export const consumeFreshTabSession = (): boolean => {
    if (sessionStorage.getItem(SPLASH_SESSION_KEY) !== null) {
        return false;
    }

    sessionStorage.setItem(SPLASH_SESSION_KEY, "1");

    return true;
};
