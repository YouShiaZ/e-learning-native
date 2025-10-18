import React from 'react';
import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AppButton from '../../components/AppButton';
import theme from '../../theme';
import { t } from '../../i18n';

import { useDispatch, useSelector } from 'react-redux';
import {
  addItem as addWishlistItem,
  removeItem as removeWishlistItem,
} from '../../store/slices/wishlistSlice';

export default function BottomBar({ styles, course, teacher, isEnrolled, onJoin, onUnjoin, onMessage }) {
  const dispatch = useDispatch();
  const wishlist = useSelector((s) => s.wishlist.items);
  const inWishlist = wishlist.some((item) => item.id === course.id);
  const toggleWishlist = () => {
    if (inWishlist) {
      dispatch(removeWishlistItem(course.id));
    } else {
      dispatch(addWishlistItem(course));
    }
  };
  return (
    <LinearGradient colors={['rgba(255,255,255,0)', 'rgba(255,255,255,1)']} style={styles.bottomBarGradient}>
      <View style={styles.bottomBar}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>{t('price')}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>${course.price}</Text>
            <Text style={styles.discount}>$99</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <AppButton label={inWishlist ? 'Wishlisted' : 'Wishlist'} variant={inWishlist ? 'secondary' : 'outline'} leftIcon={inWishlist ? 'heart' : 'heart-outline'} onPress={toggleWishlist} />
          <AppButton label={t('message')} variant="outline" leftIcon="chatbubbles-outline" onPress={() => onMessage?.(teacher)} />
          {isEnrolled ? (
            <AppButton label={t('unjoin')} variant="outline" leftIcon="close" onPress={onUnjoin} />
          ) : (
            <AppButton label={t('join')} leftIcon="add" onPress={onJoin} />
          )}
        </View>
      </View>
    </LinearGradient>
  );
}
