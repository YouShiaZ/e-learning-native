import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import RatingStars from './RatingStars';
import {
  addItem as addFavoriteItem,
  removeItem as removeFavoriteItem,
  selectAll as selectAllFavorites,
} from '../store/slices/favoritesSlice';
import {
  addItem as addWishlistItem,
  removeItem as removeWishlistItem,
  selectAll as selectAllWishlist,
} from '../store/slices/wishlistSlice';
import {
  addItem as addCartItem,
  removeItem as removeCartItem,
  selectAll as selectAllCart,
} from '../store/slices/cartSlice';

function ActionIcons({ course, variant = 'card' }) {
  const colors = useColors();
  const dispatch = useDispatch();
  const favorites = useSelector(selectAllFavorites);
  const wishlist = useSelector(selectAllWishlist);
  const cartItems = useSelector(selectAllCart);

  const isFavorite = favorites.some((item) => item.id === course.id);
  const isWishlisted = wishlist.some((item) => item.id === course.id);
  const isInCart = cartItems.some((item) => item.id === course.id);

  const iconSize = variant === 'overlay' ? 18 : 20;

  const actions = [
    {
      key: 'favorite',
      active: isFavorite,
      iconActive: 'heart',
      iconInactive: 'heart-outline',
      onPress: () =>
        isFavorite ? dispatch(removeFavoriteItem(course.id)) : dispatch(addFavoriteItem(course)),
    },
    {
      key: 'wishlist',
      active: isWishlisted,
      iconActive: 'star',
      iconInactive: 'star-outline',
      onPress: () =>
        isWishlisted
          ? dispatch(removeWishlistItem(course.id))
          : dispatch(addWishlistItem(course)),
    },
    {
      key: 'cart',
      active: isInCart,
      iconActive: 'cart',
      iconInactive: 'cart-outline',
      onPress: () =>
        isInCart ? dispatch(removeCartItem(course.id)) : dispatch(addCartItem(course)),
    },
  ];

  return (
    <View style={[styles.actionRow, variant === 'overlay' && styles.actionRowOverlay]}>
      {actions.map((action, index) => (
        <TouchableOpacity
          key={action.key}
          activeOpacity={0.7}
          onPress={action.onPress}
          style={[
            styles.actionButton,
            variant === 'overlay' && styles.actionButtonOverlay,
            index > 0 && styles.actionButtonSpacer
          ]}
        >
          <Ionicons
            name={action.active ? action.iconActive : action.iconInactive}
            size={iconSize}
            color={action.active ? colors.primary : colors.muted}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
}

export function CourseCardHorizontal({ course, onPress }) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.hCard, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: course.thumbnail }} style={styles.hImage} resizeMode="cover" />
        {course.bestSeller && (
          <LinearGradient
            colors={[theme.colors.secondary, '#FF8BA7']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.badge}
          >
            <Ionicons name="trophy" size={10} color="#fff" style={{ marginEnd: 4 }} />
            <Text style={styles.badgeText}>{require('../i18n').t('best_seller') || 'Best-seller'}</Text>
          </LinearGradient>
        )}
        <View style={styles.overlayActions}>
          <ActionIcons course={course} variant="overlay" />
        </View>
        <View style={styles.overlay} />
      </View>
      <View style={styles.hCardContent}>
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {course.title}
        </Text>
        <Text style={[styles.author, { color: colors.muted }]} numberOfLines={1}>
          {course.author}
        </Text>
        <View style={styles.cardFooter}>
          <Text style={styles.price}>${course.price}</Text>
          <RatingStars rating={course.rating} reviews={course.reviews} size={12} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function CourseCardVertical({ course, onPress }) {
  const colors = useColors();

  return (
    <TouchableOpacity
      style={[styles.vCard, { backgroundColor: colors.card }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.vImageContainer}>
        <Image source={{ uri: course.thumbnail }} style={styles.vImage} resizeMode="cover" />
      </View>
      <View style={styles.vCardContent}>
        <View style={styles.headerRow}>
          <Text numberOfLines={2} style={[styles.title, { color: colors.text, flex: 1 }]}>
            {course.title}
          </Text>
          <ActionIcons course={course} />
        </View>
        <Text style={[styles.author, { color: colors.muted }]} numberOfLines={1}>
          {course.author}
        </Text>
        <View style={styles.vMetaRow}>
          <View style={styles.lessonBadge}>
            <Ionicons name="play-circle-outline" size={14} color={theme.colors.primary} />
            <Text style={styles.lessonText}>
              {course.lessons} {require('../i18n').t('lessons') || 'lessons'}
            </Text>
          </View>
          <Text style={styles.price}>${course.price}</Text>
        </View>
        <View style={styles.ratingRow}>
          <RatingStars rating={course.rating} size={12} />
          <Text style={styles.reviewCount}>({course.reviews})</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  // Horizontal Card Styles
  hCard: {
    width: 240,
    marginEnd: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.card,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 140,
  },
  hImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  overlayActions: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
  hCardContent: {
    padding: theme.spacing.md,
  },
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    left: theme.spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    ...theme.shadow.sm,
  },
  badgeText: {
    color: '#fff',
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.bold,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.sm,
  },

  // Vertical Card Styles
  vCard: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadow.card,
  },
  vImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    marginEnd: theme.spacing.md,
  },
  vImage: {
    width: '100%',
    height: '100%',
  },
  vCardContent: {
    flex: 1,
  },

  // Common Styles
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold,
    color: theme.colors.text,
    lineHeight: 22,
  },
  author: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.muted,
    marginTop: theme.spacing.xs,
    fontWeight: theme.fontWeight.medium,
  },
  price: {
    fontSize: theme.fontSize.md,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.extrabold,
  },
  vMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: theme.spacing.xs,
  },
  lessonBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  lessonText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.textSecondary,
    marginStart: 4,
    fontWeight: theme.fontWeight.medium,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  reviewCount: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.muted,
    marginStart: 4,
    fontWeight: theme.fontWeight.medium,
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  actionRowOverlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 999,
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 4,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.card,
    ...theme.shadow.sm,
  },
  actionButtonOverlay: {
    backgroundColor: 'transparent',
    ...theme.shadow.none,
  },
  actionButtonSpacer: {
    marginLeft: theme.spacing.xs,
  },
});

export default { CourseCardHorizontal, CourseCardVertical };












