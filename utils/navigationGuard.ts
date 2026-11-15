let isTransitioning = false;
let transitionTimeout: any = null;

/**
 * Safe navigation wrapper that prevents double-tap / duplicate route pushing.
 */
export const safeNavigate = (router: any, route: string, params?: Record<string, any>) => {
  if (isTransitioning) return;

  isTransitioning = true;
  if (params && Object.keys(params).length > 0) {
    const queryString = Object.entries(params)
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`)
      .join('&');
    const finalRoute = route.includes('?') ? `${route}&${queryString}` : `${route}?${queryString}`;
    router.push(finalRoute);
  } else {
    router.push(route);
  }

  if (transitionTimeout) clearTimeout(transitionTimeout);
  
  transitionTimeout = setTimeout(() => {
    isTransitioning = false;
  }, 200); // Wait for transition animation to complete
};
