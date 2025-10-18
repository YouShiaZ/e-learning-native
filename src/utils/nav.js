import { DrawerActions } from '@react-navigation/native';

export function openDrawer(navigation) {
  try {
    // Prefer dispatching DrawerActions to ensure it works across nested navigators
    let nav = navigation;
    for (let i = 0; i < 3 && nav; i++) {
      if (typeof nav.dispatch === 'function') {
        nav.dispatch(DrawerActions.openDrawer());
        return true;
      }
      nav = nav.getParent?.();
    }
  } catch {}
  // Fallback to method calls if available
  const parent = navigation?.getParent?.();
  const grand = parent?.getParent?.();
  const opened = grand?.openDrawer?.() || parent?.openDrawer?.() || navigation?.openDrawer?.();
  return opened;
}

export function goToMessages(navigation) {
  if (!navigation) return;
  const routeName = 'Messages';
  const tryNavigate = (nav) => {
    const names = nav?.getState?.()?.routeNames;
    if (names?.includes?.(routeName) && nav?.navigate) {
      nav.navigate(routeName);
      return true;
    }
    return false;
  };
  if (tryNavigate(navigation)) return;
  let parent = navigation.getParent?.();
  let root = navigation;
  while (parent) {
    if (tryNavigate(parent)) return;
    root = parent;
    parent = parent.getParent?.();
  }
  root?.navigate?.('Messages');
}

export function goToProfile(navigation) {
  if (!navigation) return;
  const routeName = 'Profile';
  const tryNavigate = (nav) => {
    const names = nav?.getState?.()?.routeNames;
    if (names?.includes?.(routeName) && nav?.navigate) {
      nav.navigate(routeName);
      return true;
    }
    return false;
  };
  if (tryNavigate(navigation)) return;
  let parent = navigation.getParent?.();
  let root = navigation;
  while (parent) {
    if (tryNavigate(parent)) return;
    root = parent;
    parent = parent.getParent?.();
  }
  root?.navigate?.('HomeTabs', { screen: 'Profile' });
}

export function goToCourseDetails(navigation, courseId) {
  if (!navigation) return;
  const tryNavigate = (nav) => {
    const routeNames = nav?.getState?.()?.routeNames;
    if (routeNames?.includes?.('CourseDetails') && nav?.navigate) {
      nav.navigate('CourseDetails', { courseId });
      return true;
    }
    return false;
  };
  if (tryNavigate(navigation)) return;
  let parent = navigation.getParent?.();
  let root = navigation;
  while (parent) {
    if (tryNavigate(parent)) return;
    root = parent;
    parent = parent.getParent?.();
  }
  root?.navigate?.('HomeTabs', {
    screen: 'Home',
    params: {
      screen: 'CourseDetails',
      params: { courseId },
    },
  });
}

export function goToSearch(navigation) {
  try {
    if (navigation?.navigate?.('Search')) return;
  } catch {}
  try { const p = navigation?.getParent?.(); if (p?.navigate?.('Search')) return; } catch {}
  try { const gp = navigation?.getParent?.()?.getParent?.(); gp?.navigate?.('Search'); } catch {}
}
