import React, { useMemo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { setDarkMode, setLocaleUI, setPrimaryColor } from '../store/uiSlice';
import { setLocale, getLocale } from '../i18n';
import { useColors } from '../theme/hooks';

const COLOR_KEY = '@elearning_user_primary_color';

export default function QuickPrefsHeaderRight({ tint = 'auto' }) {
  const dispatch = useDispatch();
  const colors = useColors();
  const locale = getLocale();
  const dark = useSelector((s) => s.ui.darkMode);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const navigation = useNavigation();

  const palette = useMemo(() => ['#6C63FF', '#FF6584', '#00D9C0', '#10B981', '#3B82F6', '#F59E0B'], []);

  const cycleColor = async () => {
    const idx = Math.max(0, palette.findIndex((c) => c.toLowerCase() === (colors.primary || '').toLowerCase()));
    const next = palette[(idx + 1) % palette.length];
    dispatch(setPrimaryColor(next));
    try { await AsyncStorage.setItem(COLOR_KEY, next); } catch {}
  };

  const toggleLocale = () => {
    const target = locale === 'ar' ? 'en' : 'ar';
    setLocale(target);
    dispatch(setLocaleUI(target));
  };

  const toggleDark = () => {
    dispatch(setDarkMode(!dark));
  };

  const iconColor = tint === 'light' ? '#fff' : colors.text;
  const accentColor = tint === 'light' ? '#fff' : colors.primary;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, paddingRight: 12 }}>
      <TouchableOpacity onPress={cycleColor}>
        <Ionicons name="color-palette-outline" size={22} color={accentColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleDark}>
        <Ionicons name={dark ? 'moon' : 'moon-outline'} size={22} color={iconColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={toggleLocale}>
        <Ionicons name="language-outline" size={22} color={iconColor} />
      </TouchableOpacity>
      {!isAuthenticated ? (
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Ionicons name="log-in-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={() => navigation.navigate('Logout')}>
          <Ionicons name="log-out-outline" size={22} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  );
}

