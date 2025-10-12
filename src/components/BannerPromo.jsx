import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AppButton from './AppButton';
import theme from '../theme';
import { t } from '../i18n';
import { useColors } from '../theme/hooks';

export default function BannerPromo({ 
  titleTop, 
  titleMain, 
  ctaLabel, 
  image, 
  bgColor = theme.colors.primary,
  onPress 
}) {
  const colors = useColors();
  const label = ctaLabel || t('view_more');
  return (
    <TouchableOpacity 
      style={styles.shadowWrapper}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.clipContainer}>
        <LinearGradient
          colors={[colors.primaryGradientStart, colors.primaryGradientEnd]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.banner}
        >
          {/* Decorative circles */}
          <View style={styles.decorCircle1} />
          <View style={styles.decorCircle2} />
          
          <View style={styles.content}>
            <View style={styles.textContainer}>
              {titleTop ? (
                <View style={styles.topBadge}>
                  <Ionicons name="flash" size={14} color="#fff" />
                  <Text style={styles.bannerTitle}>{titleTop}</Text>
                </View>
              ) : null}
              {titleMain ? (
                <Text style={styles.bannerDiscount}>{titleMain}</Text>
              ) : null}
              <AppButton 
                label={label}
                variant="outline" 
                style={styles.ctaButton}
                textStyle={styles.ctaText}
                rightIcon="arrow-forward"
                onPress={onPress}
              />
            </View>
            {image ? (
              <View style={styles.imageContainer}>
                <Image source={image} style={styles.bannerImage} resizeMode="cover" />
              </View>
            ) : null}
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadowWrapper: {
    borderRadius: theme.radius.xl,
    ...theme.shadow.lg,
  },
  clipContainer: {
    borderRadius: theme.radius.xl,
    overflow: 'hidden',
  },
  banner: { 
    flexDirection: 'row',
    padding: theme.spacing.lg,
    position: 'relative',
    minHeight: 160,
  },
  decorCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -30,
    right: -10,
  },
  decorCircle2: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -10,
    left: -10,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignSelf: 'flex-start',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radius.full,
    marginBottom: theme.spacing.sm,
  },
  bannerTitle: { 
    color: '#fff', 
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.xs,
    marginLeft: 4,
    letterSpacing: 0.5,
  },
  bannerDiscount: { 
    color: '#fff', 
    fontSize: theme.fontSize.xxxl, 
    fontWeight: theme.fontWeight.extrabold,
    marginBottom: theme.spacing.base,
    ...(Platform?.OS === 'web' 
      ? { textShadow: '0 2px 4px rgba(0,0,0,0.1)' } 
      : { textShadowColor: 'rgba(0, 0, 0, 0.1)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }),
  },
  ctaButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff',
    borderWidth: 0,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
  },
  ctaText: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.bold,
  },
  imageContainer: {
    width: 110,
    height: 130,
    marginLeft: theme.spacing.md,
    borderRadius: theme.radius.lg,
    overflow: 'hidden',
    ...theme.shadow.md,
  },
  bannerImage: { 
    width: '100%', 
    height: '100%',
  },
});
