import React from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import QuickPrefsHeaderRight from './QuickPrefs';
import { goToSearch } from '../utils/nav';
import { DrawerActions } from '@react-navigation/native';

export default function AppHeader({ navigation, route, options, back }) {
  const colors = useColors();
  const insets = useSafeAreaInsets?.() || { top: Platform.OS === 'ios' ? 44 : 0 };
  const title =
    (typeof options?.headerTitle === 'string' && options.headerTitle) ||
    (typeof options?.title === 'string' && options.title) ||
    route?.name || '';

  const onMenu = () => {
    try { navigation?.dispatch?.(DrawerActions.openDrawer()); } catch {}
    if (navigation?.openDrawer) navigation.openDrawer();
  };

  const Right = options?.headerRight
    ? options.headerRight({ tintColor: '#fff', canGoBack: !!back })
    : (
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TouchableOpacity onPress={() => goToSearch(navigation)} accessibilityRole="button" accessibilityLabel="Search" style={{ marginRight: theme.spacing.base }}>
          <Ionicons name="search" size={22} color={'#fff'} />
        </TouchableOpacity>
        <QuickPrefsHeaderRight tint="light" />
      </View>
    );

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
