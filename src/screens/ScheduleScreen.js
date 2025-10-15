import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { t } from '../i18n';

const STORAGE_KEY = '@elearning_schedule';

export default function ScheduleScreen() {
  const colors = useColors();
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        const list = raw ? JSON.parse(raw) : [];
        setItems(Array.isArray(list) ? list : []);
      } catch {}
    })();
  }, []);

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>
        {item.title}
      </Text>
      <View style={styles.metaRow}>
        <Ionicons name="calendar" size={14} color={colors.primary} />
        <Text style={[styles.meta, { color: colors.muted }]}>
          {item.date} - {item.time}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      style={[styles.list, { backgroundColor: colors.background }]}
      contentContainerStyle={items.length === 0 ? styles.emptyContainer : styles.listContent}
      data={items}
      keyExtractor={(i, idx) => i.id || String(idx)}
      renderItem={renderItem}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListEmptyComponent={
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          {t('no_events') || 'No events scheduled'}
        </Text>
      }
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  list: { flex: 1 },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.base,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.base,
  },
  emptyText: { textAlign: 'center' },
  separator: { height: theme.spacing.base },
  card: {
    borderWidth: 1,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.base,
    ...theme.shadow.card,
  },
  title: { fontWeight: '800' },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  meta: { marginLeft: 6 },
});
