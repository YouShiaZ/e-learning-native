import React from 'react';
import { View, Text, TouchableOpacity, Platform, Image, StyleSheet, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import QuickPrefsHeaderRight from './QuickPrefs';
import { goToSearch } from '../utils/nav';
import { DrawerActions } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { selectAll as selectAllFavorites } from '../store/slices/favoritesSlice';
import { selectAll as selectAllWishlist } from '../store/slices/wishlistSlice';
import { selectCount as selectCartCount } from '../store/slices/cartSlice';

const FALLBACK_AVATAR = 'https://i.pravatar.cc/100?img=24';

export default function AppHeader({ navigation, route, options, back }) {
  const colors = useColors();
  const insets = useSafeAreaInsets?.() || { top: Platform.OS === 'ios' ? 44 : 0 };
  const { width } = useWindowDimensions();
  const isCompact = width <= 380;
  const iconSize = isCompact ? 18 : 22;
  const title =
    (typeof options?.headerTitle === 'string' && options.headerTitle) ||
    (typeof options?.title === 'string' && options.title) ||
    route?.name || '';

  const onMenu = () => {
    try { navigation?.dispatch?.(DrawerActions.openDrawer()); } catch {}
    if (navigation?.openDrawer) navigation.openDrawer();
  };

  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const user = useSelector((state) => state.user.user);
  const avatarUri = user?.avatar || FALLBACK_AVATAR;
  const favorites = useSelector(selectAllFavorites);
  const wishlist = useSelector(selectAllWishlist);
  const cartCount = useSelector(selectCartCount);

  const goToProfile = () => {
    try {
      navigation?.navigate?.('Profile');
    } catch {
      navigation?.navigate?.('Home', { screen: 'Profile' });
    }
  };

  const navigateTo = (routeName) => {
    const getRootNavigator = () => {
      let current = navigation;
      let parent = navigation?.getParent?.();
      while (parent) {
        current = parent;
        parent = parent.getParent?.();
      }
      return current;
    };

    const tryNavigate = (nav) => {
      const routeNames = nav?.getState?.()?.routeNames;
      if (routeNames?.includes(routeName) && nav?.navigate) {
        nav.navigate(routeName);
        return true;
      }
      return false;
    };

    if (!tryNavigate(navigation)) {
      const rootNav = getRootNavigator();
      if (!tryNavigate(rootNav) && rootNav?.navigate) {
        rootNav.navigate(routeName);
      }
    }
  };

  const quickAccessButtons = [
    {
      key: 'favorites',
      route: 'Favorites',
      count: favorites.length,
      icon: 'heart-outline',
      activeIcon: 'heart',
      activeColor: colors.primary,
      label: 'Favorites',
    },
    {
      key: 'wishlist',
      route: 'Wishlist',
      count: wishlist.length,
      icon: 'star-outline',
      activeIcon: 'star',
      activeColor: colors.primary,
      label: 'Wishlist',
    },
    {
      key: 'cart',
      route: 'Cart',
      count: cartCount,
      icon: 'cart-outline',
      activeIcon: 'cart',
      activeColor: colors.primary,
      label: 'Cart',
    },
  ];

  const DefaultRight = (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {isAuthenticated ? (
        <TouchableOpacity
          onPress={goToProfile}
          accessibilityRole="button"
          accessibilityLabel="Profile"
          activeOpacity={0.7}
          style={styles.avatarButton}
        >
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      ) : null}

      <View style={[styles.navIconGroup, isCompact && styles.navIconGroupCompact]}>
        {quickAccessButtons.map((item) => {
          const hasItems = item.count > 0;
          return (
            <TouchableOpacity
              key={item.key}
              onPress={() => navigateTo(item.route)}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              activeOpacity={0.7}
              style={[
                styles.navIconButton,
                isCompact && styles.navIconButtonCompact,
                hasItems && styles.navIconButtonActive,
              ]}
            >
              <Ionicons
                name={hasItems ? item.activeIcon : item.icon}
                size={iconSize}
                color={hasItems ? item.activeColor : colors.muted}
              />
              {hasItems ? (
                <View style={styles.navIconBadge}>
                  <Text style={[styles.navIconBadgeText, { color: colors.primary }]}>
                    {item.count > 99 ? '99+' : item.count}
                  </Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => goToSearch(navigation)}
        accessibilityRole="button"
        accessibilityLabel="Search"
        activeOpacity={0.7}
        style={styles.searchButton}
      >
        <Ionicons name="search" size={22} color="#fff" />
      </TouchableOpacity>
      <QuickPrefsHeaderRight tint="light" />
    </View>
  );

  const Right = options?.headerRight
    ? options.headerRight({ tintColor: '#fff', canGoBack: !!back })
    : DefaultRight;

  return (
    <View style={{ backgroundColor: colors.primary, paddingTop: insets.top }}>
      <View style={{ height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: theme.spacing.lg }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {!options?.headerLeft?.({}) && (
            <TouchableOpacity onPress={onMenu} style={{ marginRight: theme.spacing.base }} accessibilityRole="button" accessibilityLabel="Open navigation menu">
              <Ionicons name="menu" size={24} color="#fff" />
            </TouchableOpacity>
          )}
          <Text style={{ color: '#fff', fontSize: theme.fontSize.lg, fontWeight: '800' }} numberOfLines={1}>{title}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {Right}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarButton: {
    marginRight: theme.spacing.base,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#fff',
  },
  navIconGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    gap: 10,
    marginRight: theme.spacing.sm,
    flexShrink: 1,
    maxWidth: 160,
    minWidth: 0,
  },
  navIconGroupCompact: {
    gap: 8,
    maxWidth: 130,
  },
  navIconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  navIconButtonCompact: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  navIconButtonActive: {
    backgroundColor: 'rgba(255,255,255,0.28)',
  },
  navIconBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  navIconBadgeText: {
    fontSize: 10,
    fontWeight: theme.fontWeight.bold,
  },
  searchButton: {
    marginRight: theme.spacing.base,
  },
});


