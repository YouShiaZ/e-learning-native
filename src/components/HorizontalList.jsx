import React, { useRef } from 'react';
import { FlatList } from 'react-native';

export default function HorizontalList({
  data,
  keyExtractor,
  renderItem,
  paddingBottom = 8,
  onEndReached,
  onEndReachedThreshold = 0.5,
  refreshing,
  onRefresh,
  ListFooterComponent,
}) {
  const canLoad = useRef(false);
  return (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={data}
      keyExtractor={keyExtractor}
      renderItem={renderItem}
      contentContainerStyle={{ paddingBottom }}
      onMomentumScrollBegin={() => { canLoad.current = true; }}
      onEndReached={() => {
        if (canLoad.current && typeof onEndReached === 'function') {
          canLoad.current = false;
          onEndReached();
        }
      }}
      onEndReachedThreshold={onEndReachedThreshold}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListFooterComponent={ListFooterComponent}
    />
  );
}
