import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { courses as seedCourses, categories, instructors } from '../mock/data';
import SectionHeader from '../components/SectionHeader';
import { CourseCardVertical } from '../components/CourseCard';
import CategoryGrid from '../components/CategoryGrid';
import CourseSection from '../components/CourseSection';
import TeacherSection from '../components/TeacherSection';
import BannerPromo from '../components/BannerPromo';
import { t } from '../i18n';
import { CoursesAPI } from '../services/api';
import config from '../config';
import { goToSearch } from '../utils/nav';

export default function HomeScreen({ navigation }) {
  const colors = useColors();
  const [popular, setPopular] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const res = await CoursesAPI.list({ offset, limit: config.PAGE_SIZE });
      const items = res.items || [];
      setPopular((prev) => [...prev, ...items]);
      setOffset((prev) => prev + items.length);
      setHasMore(Boolean(res.hasMore));
    } catch (e) {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [offset, loading, hasMore]);

  useEffect(() => {
    loadMore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onCourse = (c) => navigation.navigate('CourseDetails', { courseId: c.id });
  const onTeacher = (tch) => navigation.navigate('TeacherProfile', { teacherId: tch.id });

  const openSearch = () => {
    goToSearch(navigation);
  };

  const openTeachers = () => {
    const tryNavigate = (nav) => {
      const names = nav?.getState?.()?.routeNames;
      if (names?.includes?.('Teachers') && nav?.navigate) {
        nav.navigate('Teachers');
        return true;
      }
      return false;
    };
    if (tryNavigate(navigation)) return;
    let parent = navigation.getParent?.();
    let root = navigation;
    while (parent) {
      if (tryNavigate(parent)) return;
      root = parent;
      parent = parent.getParent?.();
    }
    root?.navigate?.('Teachers');
  };

  const navigateToCategory = (categoryId) => {
    if (!categoryId) return;
    const parent = navigation.getParent?.();
    if (parent?.navigate) {
      parent.navigate('Search', {
        screen: 'SearchResults',
        params: { category: categoryId },
      });
      return;
    }
    navigation.navigate('SearchResults', { category: categoryId });
  };

  const fallbackPopular = popular.length ? popular : seedCourses.slice(0, config.PAGE_SIZE);
  const recommended = fallbackPopular.slice(0, 3);

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }] }>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} bounces>
        {/* App header is unified across screens; Home no longer renders its own nav */}

        {/* Banner Promo */}
        <View style={styles.bannerContainer}>
          <BannerPromo
            titleTop="PROJECT MANAGEMENT"
            titleMain="20% OFF"
            ctaLabel={t('view_more')}
            image={{ uri: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=500&q=60' }}
            onPress={openSearch}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader title={t('categories')} onPress={openSearch} />
          <CategoryGrid
            items={categories}
            onPressCategory={(c) => navigateToCategory(c.id)}
          />
        </View>

        {/* Popular Courses */}
        <View style={styles.section}>
          <CourseSection
            title={t('popular_courses')}
            data={fallbackPopular}
            onPressItem={onCourse}
            onEndReached={loadMore}
            hasMore={hasMore}
            loading={loading}
          />
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <CourseSection title={t('recommended_for_you')} data={recommended} onPressItem={onCourse} />
        </View>

        {/* Course that inspires */}
        <View style={styles.section}>
          <SectionHeader title={t('course_inspires')} onPress={openSearch} />
          <View style={styles.verticalList}>
            {fallbackPopular.map((c) => (
              <CourseCardVertical key={c.id + '-v'} course={c} onPress={() => onCourse(c)} />
            ))}
          </View>
        </View>

        {/* Teachers */}
        <View style={styles.section}>
          <TeacherSection data={instructors} onMore={openTeachers} onTeacherPress={onTeacher} />
        </View>

        <View style={{ height: theme.spacing.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  container: {
    flexGrow: 1,
    paddingBottom: theme.spacing.xl,
  },
  
  bannerContainer: {
    paddingHorizontal: theme.spacing.xl,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  section: {
    marginTop: theme.spacing.lg,
    paddingHorizontal: theme.spacing.xl,
  },
  verticalList: {
    marginTop: theme.spacing.sm,
  },
});
