import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import {
  selectAll as selectFavorites,
  removeItem as removeFavoriteItem,
  clear as clearFavorites,
} from '../store/slices/favoritesSlice';
import { CourseCardVertical } from '../components/CourseCard';

export default function FavoritesScreen({ navigation }) {
  const colors = useColors();
  const dispatch = useDispatch();
  const favorites = useSelector(selectFavorites);

  const goToCourse = (courseId) => {
    if (!courseId) return;
    const target = {
      screen: 'Home',
      params: {
        screen: 'CourseDetails',
        params: { courseId },
      },
    };

    let rootNav = navigation;
    let parent = navigation?.getParent?.();
    while (parent) {
      rootNav = parent;
      parent = parent.getParent?.();
    }

    if (rootNav?.navigate) {
      rootNav.navigate('HomeTabs', target);
    } else {
      navigation.navigate('CourseDetails', { courseId });
    }
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.headerRow}>
        <Text style={[styles.screenTitle, { color: colors.muted, textAlign: 'center' }]}>Your Favorites</Text>
        {favorites.length > 0 ? (
          <TouchableOpacity onPress={() => dispatch(clearFavorites())} activeOpacity={0.7}>
            <Text style={[styles.clearText, { color: colors.muted }]}>Clear all</Text>
          </TouchableOpacity>
        ) : null}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyTitle, { color: colors.muted, textAlign: 'center' }]}>Your favorites list is empty {'\u2764\uFE0F'}</Text>
          <Text style={[styles.emptySubtitle, { color: colors.muted }]}>
            Tap the heart icon on any course to save it here.
          </Text>
        </View>
      ) : (
        favorites.map((course) => (
          <View key={course.id} style={styles.cardWrapper}>
            <CourseCardVertical course={course} onPress={() => goToCourse(course.id)} />
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: colors.primary, borderColor: colors.primary },
                ]}
                onPress={() => goToCourse(course.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.actionButtonPrimaryText}>View details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { borderColor: colors.border, backgroundColor: colors.card },
                ]}
                onPress={() => dispatch(removeFavoriteItem(course.id))}
                activeOpacity={0.7}
              >
                <Text style={[styles.actionButtonText, { color: colors.muted }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  screenTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.extrabold,
  },
  clearText: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  emptyTitle: {
    fontSize: theme.fontSize.md,
    fontWeight: theme.fontWeight.bold,
  },
  emptySubtitle: {
    marginTop: 8,
    textAlign: 'center',
    lineHeight: 20,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
    columnGap: theme.spacing.sm,
    rowGap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.shadow.none,
  },
  actionButtonPrimaryText: {
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
  },
  actionButtonText: {
    fontWeight: theme.fontWeight.semibold,
  },
  cardWrapper: {
    marginBottom: theme.spacing.lg,
  },
});















