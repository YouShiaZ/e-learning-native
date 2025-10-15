import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TextInput, Switch, TouchableOpacity, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { useColors } from '../../theme/hooks';
import { useDispatch } from 'react-redux';
import { setDarkMode, setPrimaryColor, setSiteTitle } from '../../store/uiSlice';

const SETTINGS_KEY = '@elearning_settings';

export default function AdminSettingsScreen() {
  const dispatch = useDispatch();
  const colors = useColors();
  const [siteTitle, setSiteTitleLocal] = useState('E-Learning');
  const [primaryColor, setPrimaryColorLocal] = useState(theme.colors.primary);
  const [defaultDark, setDefaultDark] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      const s = raw ? JSON.parse(raw) : null;
      if (s) {
        setSiteTitleLocal(s.siteTitle || siteTitle);
        setPrimaryColorLocal(s.primaryColor || primaryColor);
        setDefaultDark(Boolean(s.defaultDark));
        if (s.primaryColor) dispatch(setPrimaryColor(s.primaryColor));
        if (s.siteTitle) dispatch(setSiteTitle(s.siteTitle));
        if (typeof s.defaultDark === 'boolean') dispatch(setDarkMode(s.defaultDark));
      }
    } catch {}
  }, []);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    setSaving(true);
    const s = { siteTitle: siteTitle.trim() || 'E-Learning', primaryColor: primaryColor.trim() || theme.colors.primary, defaultDark };
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    dispatch(setPrimaryColor(s.primaryColor));
    dispatch(setSiteTitle(s.siteTitle));
    dispatch(setDarkMode(Boolean(s.defaultDark)));
    setSaving(false);
  };

  return (
    <ScrollView
      contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.text }]}>Site Settings</Text>
      <View style={styles.fieldRow}>
        <Text style={[styles.label, { color: colors.muted }]}>Site Title</Text>
        <TextInput value={siteTitle} onChangeText={setSiteTitleLocal} style={[styles.input, { color: colors.text }]} placeholder="Site title" placeholderTextColor={colors.muted} />
      </View>
      <View style={styles.fieldRow}>
        <Text style={[styles.label, { color: colors.muted }]}>Primary Color</Text>
        <TextInput value={primaryColor} onChangeText={setPrimaryColorLocal} style={[styles.input, { color: colors.text }]} placeholder="#6C63FF" placeholderTextColor={colors.muted} />
      </View>
      <View style={[styles.fieldRow, { alignItems: 'center' }]}>
        <Text style={[styles.label, { color: colors.muted }]}>Default Dark Mode</Text>
        <Switch value={defaultDark} onValueChange={setDefaultDark} />
      </View>
      <TouchableOpacity style={[styles.saveBtn]} onPress={save} disabled={saving}>
        <Ionicons name="save" size={18} color="#fff" />
        <Text style={styles.saveText}>{saving ? 'Saving...' : 'Save Settings'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 16 },
  title: { fontWeight: '800', marginBottom: 12 },
  fieldRow: { marginBottom: 12 },
  label: { marginBottom: 6 },
  input: { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  saveBtn: { marginTop: 10, backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center' },
  saveText: { color: '#fff', fontWeight: '700' },
});
