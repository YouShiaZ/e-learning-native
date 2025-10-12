import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../theme/hooks';
import theme from '../theme';
import { t } from '../i18n';
import { courses } from '../mock/data';

export default function LiveNowScreen({ navigation }) {
  const colors = useColors();
  // Dummy live list: pick first few courses as "Live"
  const live = courses.slice(0, 3).map((c) => ({ ...c, viewers: Math.floor(Math.random() * 900) + 100 }));
  return (
    <View style={[styles.container, { backgroundColor: colors.background }] }>
      <FlatList
        data={live}
        keyExtractor={(i) => i.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={() => navigation.navigate('CourseDetails', { courseId: item.id })}>
            <View style={styles.mediaWrap}>
              <Image source={{ uri: item.thumbnail }} style={styles.thumb} />
              <View style={styles.liveBadge}>
                <Ionicons name="radio" size={12} color="#fff" />
                <Text style={styles.liveText}>{t('live_now') || 'Live now'}</Text>
              </View>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.title, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
              <Text style={[styles.meta, { color: colors.muted }]} numberOfLines={1}>{item.author || '—'}</Text>
              <Text style={[styles.viewers, { color: colors.primary }]}>{item.viewers} {t('viewers') || 'viewers'}</Text>
            </View>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={{ paddingVertical: theme.spacing.base }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: theme.spacing.base },
  card: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: theme.radius.lg, padding: theme.spacing.base, ...theme.shadow.card },
  mediaWrap: { position: 'relative' },
  thumb: { width: 96, height: 72, borderRadius: theme.radius.md },
  liveBadge: { position: 'absolute', left: 6, top: 6, backgroundColor: theme.colors.danger, borderRadius: theme.radius.full, paddingHorizontal: 8, paddingVertical: 4, flexDirection: 'row', alignItems: 'center', ...(Platform.OS==='web'?{ boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }:{}) },
  liveText: { color: '#fff', fontWeight: '800', fontSize: 10, marginLeft: 6 },
  title: { fontWeight: '800', fontSize: theme.fontSize.md },
  meta: { marginTop: 4, fontSize: theme.fontSize.sm },
  viewers: { marginTop: 6, fontWeight: '700' },
});
