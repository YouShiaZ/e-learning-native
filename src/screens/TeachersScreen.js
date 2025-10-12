import React, { useMemo, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useColors } from '../theme/hooks';
import { instructors } from '../mock/data';
import TeacherCard from '../components/TeacherCard';
import SearchBar from '../components/SearchBar';
import theme from '../theme';

export default function TeachersScreen({ navigation }) {
  const colors = useColors();
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const s = (q || '').toLowerCase();
    return instructors.filter((t) => !s || t.name?.toLowerCase().includes(s) || t.title?.toLowerCase().includes(s));
  }, [q]);
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={{ paddingHorizontal: theme.spacing.base, paddingTop: theme.spacing.base }}>
        <SearchBar value={q} onChangeText={setQ} onSubmit={() => {}} />
      </View>
      <FlatList
        style={{ padding: theme.spacing.base }}
        data={list}
        keyExtractor={(t) => t.id}
        numColumns={2}
        columnWrapperStyle={{ gap: theme.spacing.base }}
        renderItem={({ item }) => (
          <View style={{ flex: 1, marginBottom: theme.spacing.base }}>
            <TeacherCard teacher={item} onPress={() => navigation.navigate('TeacherProfile', { teacherId: item.id })} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});

