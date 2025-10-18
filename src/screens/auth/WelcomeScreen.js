import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useColors } from '../../theme/hooks';
import theme from '../../theme';
import { t } from '../../i18n';
import QuickPrefsHeaderRight from '../../components/QuickPrefs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { continueAsGuest } from '../../store/userSlice';
// Header quick prefs are provided via navigator header on this screen

export default function WelcomeScreen({ navigation }) {
  const colors = useColors();
  const dispatch = useDispatch();

  const onGuest = async () => {
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ isGuest: true })); } catch {}
    dispatch(continueAsGuest());
    const rootNav = navigation.getParent?.() || navigation;
    rootNav.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
  };

  return (
    <View style={[styles.wrapper, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <Image
            source={require('../../../assets/splash-icon.png')}
            resizeMode="contain"
            style={styles.heroImage}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            {t('welcome_title') || 'Welcome to EduHub'}
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            {t('welcome_subtitle') || 'Learn anytime, anywhere with our comprehensive courses'}
          </Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.buttonPrimary, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.85}
          >
            <Ionicons name="person-add" size={18} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.buttonPrimaryText}>{t('create_account') || 'Create Account'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonOutline, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.85}
          >
            <Ionicons name="log-in-outline" size={18} color={colors.primary} style={{ marginRight: 8 }} />
            <Text style={[styles.buttonOutlineText, { color: colors.primary }]}>{t('login') || 'Login'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.buttonGhost]}
            onPress={onGuest}
            activeOpacity={0.85}
          >
            <Text style={[styles.buttonGhostText, { color: colors.text }]}>{t('continue_as_guest') || 'Continue as Guest'}</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
  },
  hero: {
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  heroImage: {
    width: 120,
    height: 120,
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.xl,
    fontWeight: theme.fontWeight.extrabold,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: theme.spacing.sm,
    fontSize: theme.fontSize.base,
    textAlign: 'center',
  },
  actions: {
    marginTop: theme.spacing.xl,
  },
  buttonPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    ...theme.shadow.sm,
  },
  buttonPrimaryText: {
    color: '#fff',
    fontWeight: theme.fontWeight.bold,
  },
  buttonOutline: {
    marginTop: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.radius.lg,
    borderWidth: 2,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
  },
  buttonOutlineText: {
    fontWeight: theme.fontWeight.bold,
  },
  buttonGhost: {
    marginTop: theme.spacing.md,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  buttonGhostText: {
    fontWeight: theme.fontWeight.semibold,
  },
});
