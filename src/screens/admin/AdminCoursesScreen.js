import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Alert, FlatList, TextInput, TouchableOpacity } from 'react-native';
import { CoursesAPI } from '../../services/api';
import config from '../../config';
import theme from '../../theme';
import { useColors } from '../../theme/hooks';
import { t } from '../../i18n';
import AdminLayout, { AdminButton, AdminCard } from '../../components/admin/AdminLayout';

export default function AdminCoursesScreen({ navigation }) {
  const [items, setItems] = useState([]);
  const colors = useColors();
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [showOnly, setShowOnly] = useState('all'); // all | published | drafts
  const [selected, setSelected] = useState({}); // id -> true

  const load = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await CoursesAPI.list({ offset, limit: config.PAGE_SIZE, onlyPublished: false, q: query || undefined });
      const chunk = res.items || [];
      setItems((prev) => [...prev, ...chunk]);
      setOffset((prev) => prev + chunk.length);
      setHasMore(Boolean(res.hasMore));
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore, query]);

  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const q = (query || '').toLowerCase();
    return items.filter((c) => {
      const okQ = !q || c.title?.toLowerCase().includes(q) || c.author?.toLowerCase().includes(q);
      const okF = showOnly === 'all' || (showOnly === 'published' ? c.published : !c.published);
      return okQ && okF;
    });
  }, [items, query, showOnly]);

  const onDelete = (id) => {
    Alert.alert('Delete Course', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await CoursesAPI.remove(id);
          setItems((prev) => prev.filter((c) => c.id !== id));
        } catch (e) {}
      }},
    ]);
  };

  const onTogglePublish = async (course) => {
    try {
      const updated = await CoursesAPI.setPublished(course.id, !course.published);
      setItems((prev) => prev.map((x) => (x.id === course.id ? updated : x)));
    } catch (e) {}
  };

  const setAllSelected = (ids, value) => setSelected((prev) => ids.reduce((acc, id) => ({ ...acc, [id]: value }), { ...prev }));
  const selectedIds = useMemo(() => Object.keys(selected).filter((k) => selected[k]), [selected]);

  const bulkDelete = () => {
    if (selectedIds.length === 0) return;
    Alert.alert('Delete', `Delete ${selectedIds.length} courses?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        for (const id of selectedIds) {
          try { await CoursesAPI.remove(id); } catch {}
        }
        setItems((prev) => prev.filter((c) => !selectedIds.includes(c.id)));
        setSelected({});
      }},
    ]);
  };

  const bulkPublish = async (value) => {
    for (const id of selectedIds) {
      const course = items.find((c) => c.id === id);
      if (!course) continue;
      try { await CoursesAPI.setPublished(id, value); } catch {}
    }
    setItems((prev) => prev.map((c) => (selectedIds.includes(c.id) ? { ...c, published: value } : c)));
    setSelected({});
  };

  return (
    <AdminLayout
      title="Courses"
      subtitle="Manage, filter and bulk edit courses"
      actions={[{ label: t('add_course'), icon: 'add', onPress: () => navigation.navigate('AdminCourseForm') }]}
      scrollable={false}
    >
      <AdminCard>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.text, backgroundColor: colors.card, flex: 1 }]}
            placeholder="Search by title or author"
            placeholderTextColor={colors.muted}
            value={query}
            onChangeText={setQuery}
          />
          <TouchableOpacity onPress={() => setShowOnly('all')} style={[styles.chip, showOnly === 'all' && { backgroundColor: colors.primary }]}> 
            <Text style={[styles.chipText, { color: showOnly === 'all' ? '#fff' : colors.muted }]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOnly('published')} style={[styles.chip, showOnly === 'published' && { backgroundColor: colors.primary }]}> 
            <Text style={[styles.chipText, { color: showOnly === 'published' ? '#fff' : colors.muted }]}>Published</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOnly('drafts')} style={[styles.chip, showOnly === 'drafts' && { backgroundColor: colors.primary }]}> 
            <Text style={[styles.chipText, { color: showOnly === 'drafts' ? '#fff' : colors.muted }]}>Drafts</Text>
          </TouchableOpacity>
        </View>
        {selectedIds.length > 0 && (
          <View style={{ marginTop: 8, flexDirection: 'row', gap: 8 }}>
            <AdminButton label={`Delete (${selectedIds.length})`} icon="trash" variant="danger" onPress={bulkDelete} />
            <AdminButton label="Publish" icon="cloud-done" onPress={() => bulkPublish(true)} />
            <AdminButton label="Unpublish" icon="cloud-offline" variant="outline" onPress={() => bulkPublish(false)} />
          </View>
        )}
      </AdminCard>

      <FlatList
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        data={filtered}
        keyExtractor={(c) => c.id}
        showsVerticalScrollIndicator={false}
        onEndReached={hasMore ? load : undefined}
        onEndReachedThreshold={0.4}
        renderItem={({ item: c }) => (
          <View style={[styles.row, { borderBottomColor: colors.border }]}> 
            <TouchableOpacity onPress={() => setSelected((prev) => ({ ...prev, [c.id]: !prev[c.id] }))} style={[styles.checkbox, { borderColor: colors.border, backgroundColor: selected[c.id] ? colors.primary : 'transparent' }]} />
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={[styles.title, { color: colors.text }]}>{c.title}</Text>
              <Text style={[styles.badge, c.published ? styles.badgePublished : styles.badgeUnpublished]}>{c.published ? t('published') : t('unpublished')}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.link, { color: colors.primary }]} onPress={() => onTogglePublish(c)}>{c.published ? t('unpublish') : t('publish')}</Text>
              <Text style={[styles.link, { color: colors.primary }]} onPress={() => navigation.navigate('AdminCourseForm', { id: c.id })}>{t('edit')}</Text>
              <Text style={[styles.link, { color: theme.colors.danger }]} onPress={() => onDelete(c.id)}>{t('delete')}</Text>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text style={{ color: colors.muted, padding: 12 }}>No courses</Text>}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  chip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: 'transparent' },
  chipText: { fontWeight: '700' },
  row: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.colors.border, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 },
  title: { color: theme.colors.text, fontWeight: '600' },
  link: { marginLeft: 12, color: theme.colors.primary, fontWeight: '700' },
  badge: { alignSelf: 'flex-start', marginTop: 4, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, overflow: 'hidden', fontWeight: '700', fontSize: 12 },
  badgePublished: { backgroundColor: '#DCFCE7', color: '#166534' },
  badgeUnpublished: { backgroundColor: '#FFE4E6', color: '#9F1239' },
  checkbox: { width: 18, height: 18, borderWidth: 2, borderRadius: 4 },
});
