import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';
import { CourseCardVertical } from '../components/CourseCard';
import { CoursesAPI } from '../services/api';
import config from '../config';

export default function SearchResultsScreen({ route, navigation }) {
  const colors = useColors();
  const query = route?.params?.query || '';
  const category = route?.params?.category || '';
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await CoursesAPI.list({ q: query, category, offset, limit: config.PAGE_SIZE });
      const chunk = res.items || [];
      setItems((prev) => [...prev, ...chunk]);
      setOffset((prev) => prev + chunk.length);
      setHasMore(Boolean(res.hasMore));
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [query, category, offset, loading, hasMore]);

  useEffect(() => {
    // Reset when query changes
    setItems([]);
    setOffset(0);
    setHasMore(true);
  }, [query, category]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <Text style={[styles.count, { color: colors.muted }]}>{items.length} {t('results')}</Text>
      <FlatList
        data={items}
        keyExtractor={(c) => c.id}
        renderItem={({ item: c }) => (
          <CourseCardVertical key={c.id + '-res'} course={c} onPress={() => navigation.navigate('CourseDetails', { courseId: c.id })} showBookmark />
        )}
        onEndReached={hasMore ? load : undefined}
        onEndReachedThreshold={0.4}
        ListFooterComponent={loading ? (
          <View style={{ paddingVertical: 12 }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        ) : null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  count: { color: theme.colors.muted },
});
