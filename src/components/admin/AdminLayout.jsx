import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../theme/hooks';
import theme from '../../theme';
import { t } from '../../i18n';
import { useSelector } from 'react-redux';

// AdminButton: primary, danger, outline variants
export function AdminButton({ label, icon, onPress, variant = 'primary', style, textStyle }) {
  const colors = useColors();
  const bg = variant === 'primary' ? colors.primary : variant === 'danger' ? colors.danger : 'transparent';
  const borderColor = variant === 'outline' ? colors.primary : 'transparent';
  const color = variant === 'outline' ? colors.primary : '#fff';
  return (
    <TouchableOpacity onPress={onPress} style={[styles.btn, { backgroundColor: bg, borderColor }, style]}> 
      {icon ? <Ionicons name={icon} size={16} color={color} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.btnText, { color }, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
}

// Card wrapper for panel sections
export function AdminCard({ title, right, children, style, headerStyle }) {
  const colors = useColors();
  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }, style]}>
      {(title || right) ? (
        <View style={[styles.cardHeader, { borderBottomColor: colors.border }, headerStyle]}>
          {title ? <Text style={[styles.cardTitle, { color: colors.text }]}>{title}</Text> : <View />}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>{right}</View>
        </View>
      ) : null}
      <View style={styles.cardBody}>{children}</View>
    </View>
  );
}

// Small label-value row for stats
export function AdminStat({ label, value, icon, color }) {
  const colors = useColors();
  return (
    <View style={[styles.stat, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        {icon ? <Ionicons name={icon} size={18} color={color || colors.primary} style={{ marginRight: 8 }} /> : null}
        <Text style={[styles.statLabel, { color: colors.muted }]}>{label}</Text>
      </View>
      <Text style={[styles.statValue, { color: colors.text }]}>{value}</Text>
    </View>
  );
}

// Top navigation for admin pages
function AdminTopNav() {
  const colors = useColors();
  const nav = useNavigation();
  const route = useRoute();
  const items = [
    { key: 'AdminDashboard', label: t('dashboard') || 'Dashboard', icon: 'speedometer' },
    { key: 'AdminCourses', label: t('courses') || 'Courses', icon: 'book' },
    { key: 'AdminUsers', label: t('users') || 'Users', icon: 'people' },
    { key: 'AdminCategories', label: t('categories') || 'Categories', icon: 'pricetags' },
    { key: 'AdminSettings', label: t('settings') || 'Settings', icon: 'settings' },
    { key: 'AdminLive', label: t('live_now') || 'Live', icon: 'radio' },
    { key: 'AdminSchedule', label: t('schedule') || 'Schedule', icon: 'calendar' },
  ];
  return (
    <View style={[styles.topNav, { borderBottomColor: colors.border }]}>
      {items.map((it) => {
        const active = route?.name === it.key;
        return (
          <TouchableOpacity key={it.key} style={styles.topNavItem} onPress={() => nav.navigate(it.key)}>
            <Ionicons name={it.icon} size={16} color={active ? colors.primary : colors.muted} />
            <Text style={[styles.topNavText, { color: active ? colors.primary : colors.muted }]}>{it.label}</Text>
            {active ? <View style={[styles.navUnderline, { backgroundColor: colors.primary }]} /> : null}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Admin layout with common padding, header and optional actions
export default function AdminLayout({ title, subtitle, actions, children, scrollable = true, contentStyle }) {
  const colors = useColors();
  const isAdmin = useSelector((s) => s.user?.isAdmin);
  const Header = (
    <View style={styles.header}>
      <View style={{ flex: 1 }}>
        {title ? <Text style={[styles.title, { color: colors.text }]}>{title}</Text> : null}
        {subtitle ? <Text style={[styles.subtitle, { color: colors.muted }]}>{subtitle}</Text> : null}
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        {Array.isArray(actions) ? actions.map((a, idx) => (
          <AdminButton key={idx} {...a} />
        )) : actions}
      </View>
    </View>
  );

  const Content = (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      {Header}
      {isAdmin ? <AdminTopNav /> : null}
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );

  if (scrollable) {
    return <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: theme.spacing.xxl }}>{Content}</ScrollView>;
  }
  return Content;
}

const styles = StyleSheet.create({
  container: { padding: theme.spacing.base, minHeight: '100%', flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: theme.spacing.sm },
  title: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.extrabold },
  subtitle: { marginTop: 2 },
  topNav: { flexDirection: 'row', alignItems: 'center', gap: 8, borderBottomWidth: 1, marginTop: theme.spacing.sm },
  topNavItem: { paddingVertical: 10, paddingHorizontal: 8, alignItems: 'center', justifyContent: 'center' },
  topNavText: { marginTop: 2, fontWeight: theme.fontWeight.semibold },
  navUnderline: { height: 2, width: '80%', alignSelf: 'center', marginTop: 8, borderRadius: 2 },
  content: { marginTop: theme.spacing.base },

  // Buttons
  btn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: theme.radius.md, borderWidth: 1 },
  btnText: { fontWeight: theme.fontWeight.bold },

  // Card
  card: { borderRadius: theme.radius.lg, borderWidth: 1, ...theme.shadow.card, overflow: Platform.OS === 'web' ? 'visible' : 'hidden' },
  cardHeader: { paddingHorizontal: 12, paddingVertical: 10, borderBottomWidth: StyleSheet.hairlineWidth, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontWeight: theme.fontWeight.extrabold },
  cardBody: { padding: 12 },

  // Stat
  stat: { borderRadius: theme.radius.md, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { fontSize: theme.fontSize.sm },
  statValue: { fontSize: theme.fontSize.xl, fontWeight: theme.fontWeight.extrabold },
});
