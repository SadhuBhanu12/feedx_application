import { router } from 'expo-router';

/**
 * Safely navigates backwards in the navigation stack.
 * If there is no previous screen to go back to (e.g., accessed via tab, direct link, or replace),
 * it safely redirects to the specified fallback route (defaults to '/(tabs)').
 * Prevents "The action 'GO_BACK' was not handled by any navigator" crashes and ErrorBoundary triggers.
 */
export function safeBack(fallback: string = '/(tabs)') {
  try {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace(fallback as any);
    }
  } catch (err) {
    console.warn('[safeBack] Navigation error, using fallback replace:', err);
    try {
      router.replace(fallback as any);
    } catch (_) {}
  }
}
