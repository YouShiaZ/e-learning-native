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
  navigation?.navigate?.('Messages');
}

export function goToProfile(navigation) {
  navigation?.navigate?.('Profile');
}

export function goToCourseDetails(navigation, courseId) {
  navigation?.navigate?.('CourseDetails', { courseId });
}

export function goToSearch(navigation) {
  try {
    if (navigation?.navigate?.('Search')) return;
  } catch {}
  try { const p = navigation?.getParent?.(); if (p?.navigate?.('Search')) return; } catch {}
  try { const gp = navigation?.getParent?.()?.getParent?.(); gp?.navigate?.('Search'); } catch {}
}
