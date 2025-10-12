import React from 'react';
import SectionHeader from './SectionHeader';
import HorizontalList from './HorizontalList';
import { CourseCardHorizontal } from './CourseCard';
import { ActivityIndicator, View } from 'react-native';
import { useColors } from '../theme/hooks';

export default function CourseSection({ title, data, onMore, onPressItem, onEndReached, loading, hasMore }) {
  const colors = useColors();
  return (
    <>
      <SectionHeader title={title} onPress={onMore} />
      <HorizontalList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CourseCardHorizontal course={item} onPress={() => onPressItem?.(item)} />}
        onEndReached={hasMore ? onEndReached : undefined}
        ListFooterComponent={loading ? (() => (
          <View style={{ width: 56, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator color={colors.primary} />
          </View>
        )) : undefined}
      />
    </>
  );
}
