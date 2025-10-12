import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { categories, courses } from '../mock/data';
import SectionHeader from '../components/SectionHeader';
import ChipGroup from '../components/ChipGroup';
import CategoryGrid from '../components/CategoryGrid';
import CourseSection from '../components/CourseSection';
import SearchBar from '../components/SearchBar';

import { t } from '../i18n';
const hotTopics = ['Java', 'SQL', 'Javascript', 'Python', 'Digital marketing', 'Photoshop', 'Watercolor'];

export default function SearchScreen({ navigation }) {
  const [query, setQuery] = useState('');
  const colors = useColors();
  const [active, setActive] = useState('');

  const startSearch = () => {
    navigation.navigate('SearchResults', { query: query || active });
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
      <SearchBar value={query} onChangeText={setQuery} onSubmit={startSearch} />

      <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('hot_topics')}</Text>
      <ChipGroup items={hotTopics} value={active} onChange={(t) => { setActive(t); setQuery(''); }} />

      <SectionHeader title={t('categories')} onPress={() => {}} />
      <CategoryGrid items={categories} />

      <CourseSection
        title={t('recommended_for_you')}
        data={courses}
        onPressItem={(item) => navigation.navigate('CourseDetails', { courseId: item.id })}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: theme.colors.text, marginTop: 16, marginBottom: 8 },
  
});
