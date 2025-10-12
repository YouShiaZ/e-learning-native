import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { DrawerActions } from '@react-navigation/native';
import { openDrawer, goToMessages, goToProfile } from '../utils/nav';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { categories, instructors } from '../mock/data';
import SectionHeader from '../components/SectionHeader';
import { CourseCardVertical } from '../components/CourseCard';
import CategoryGrid from '../components/CategoryGrid';
import CourseSection from '../components/CourseSection';
import TeacherSection from '../components/TeacherSection';
import BannerPromo from '../components/BannerPromo';
import { t } from '../i18n';
import { CoursesAPI } from '../services/api';
import config from '../config';
import { useSelector, useDispatch } from 'react-redux';
import { setDarkMode, setUnread } from '../store/uiSlice';
import { loadWishlist } from '../store/slices/wishlistSlice';

export default function HomeScreen({ navigation }) {
  const colors = useColors();
  const [popular, setPopular] = useState([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const user = useSelector((s) => s.user.user);
  const favIds = useSelector((s) => s.favorites.ids);
  const wishlistItems = useSelector((s) => s.wishlist.items);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const dispatch = useDispatch();
  const darkMode = useSelector((s) => s.ui.darkMode);
  const hasUnread = useSelector((s) => s.ui.hasUnread);

  useEffect(() => {
    // Load guest wishlist by default
    dispatch(loadWishlist());
  }, [dispatch]);

  const badgeCount = wishlistItems.length || favIds.length;

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

  const name = (user?.name && String(user.name).trim()) || 'Learner';
  const avatarUri = user?.avatar || 'https://i.pravatar.cc/100?img=5';

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
            onPress={() => navigation.navigate('Search')}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <SectionHeader title={t('categories')} onPress={() => {}} />
          <CategoryGrid items={categories} onPressCategory={(c) => navigation.navigate('SearchResults', { category: c.id })} />
        </View>

        {/* Popular Courses */}
        <View style={styles.section}>
          <CourseSection
            title={t('popular_courses')}
            data={popular}
            onPressItem={onCourse}
            onEndReached={loadMore}
            hasMore={hasMore}
            loading={loading}
          />
        </View>

        {/* Recommended */}
        <View style={styles.section}>
          <CourseSection title={t('recommended_for_you')} data={popular.slice(0, 3)} onPressItem={onCourse} />
        </View>

        {/* Course that inspires */}
        <View style={styles.section}>
          <SectionHeader title={t('course_inspires')} onPress={() => {}} />
          <View style={styles.verticalList}>
            {popular.map((c) => (
              <CourseCardVertical key={c.id + '-v'} course={c} onPress={() => onCourse(c)} showBookmark />
            ))}
          </View>
        </View>

        {/* Teachers */}
        <View style={styles.section}>
          <TeacherSection data={instructors} onMore={() => {}} onTeacherPress={onTeacher} />
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
