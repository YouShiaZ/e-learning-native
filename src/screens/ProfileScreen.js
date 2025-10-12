import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, TextInput, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';
import { courses } from '../mock/data';
import { CourseCardVertical } from '../components/CourseCard';
import { useSelector, useDispatch } from 'react-redux';
import { setAdmin, logout, updateProfile, loginSuccess } from '../store/userSlice';
import LanguageSwitcher from '../components/LanguageSwitcher';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setPrimaryColor, setDarkMode, setLocaleUI } from '../store/uiSlice';
import { setLocale, getLocale } from '../i18n';

export default function ProfileScreen({ navigation }) {
  const colors = useColors();
  const dispatch = useDispatch();

  const favIds = useSelector((s) => s.favorites.ids);
  const isAdmin = useSelector((s) => s.user.isAdmin);
  const user = useSelector((s) => s.user.user);
  const isAuthenticated = useSelector((s) => s.user.isAuthenticated);
  const favCourses = courses.filter((c) => favIds.includes(c.id));

  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formBirthDate, setFormBirthDate] = useState('');
  const [formTeacherCourse, setFormTeacherCourse] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [colorInput, setColorInput] = useState('');
  const fileInputRef = useRef(null);

  // ✅ تحميل بيانات المستخدم من AsyncStorage لو Redux فاضي
  useEffect(() => {
    const loadUser = async () => {
      try {
        const raw = await AsyncStorage.getItem('@elearning_auth_state');
        if (raw) {
          const parsed = JSON.parse(raw);
          if (parsed?.user) dispatch(loginSuccess(parsed.user));
        }
      } catch (e) {
        console.log('Error loading user:', e);
      }
    };
    if (!user) loadUser();
  }, [dispatch, user]);

  // ✅ تحميل اللون لو متخزن
  useEffect(() => {
    (async () => {
      try {
        const c = await AsyncStorage.getItem('@elearning_user_primary_color');
        if (c) dispatch(setPrimaryColor(c));
      } catch {}
    })();
  }, [dispatch]);

  // ✅ تحميل بيانات المستخدم في الـ inputs
  useEffect(() => {
    if (user) {
      setFormName(user?.name || '');
      setFormPhone(user?.profile?.phone || '');
      setFormBirthDate(user?.profile?.birthDate || '');
      setFormTeacherCourse(user?.profile?.teacherCourse || '');
      setAvatarUri(user?.avatar || '');
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      dispatch(logout());
      await AsyncStorage.removeItem('@elearning_auth_state');
    } catch {}
  };

  const applyColor = async () => {
    const c = (colorInput || '').trim();
    if (!c) return;
    dispatch(setPrimaryColor(c));
    try { await AsyncStorage.setItem('@elearning_user_primary_color', c); } catch {}
  };

  const toggleLocale = () => {
    const current = getLocale();
    const next = current === 'ar' ? 'en' : 'ar';
    setLocale(next);
    dispatch(setLocaleUI(next));
  };

  const pickAvatar = async () => {
    if (Platform.OS === 'web') {
      try { fileInputRef.current && fileInputRef.current.click(); } catch {}
      return;
    }
    try {
      const ImagePicker = await import('expo-image-picker');
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') return;
      const res = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [1,1], quality: 0.8 });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAvatarUri(res.assets[0].uri);
      }
    } catch {}
  };

  const saveProfile = async () => {
    const updates = {
      name: formName.trim(),
      avatar: avatarUri || user?.avatar,
      profile: {
        ...(user?.profile || {}),
        phone: formPhone.trim() || null,
        birthDate: formBirthDate.trim() || null,
        teacherCourse: user?.role === 'teacher' ? formTeacherCourse : (user?.profile?.teacherCourse || null),
      },
    };
    try {
      dispatch(updateProfile(updates));
      const auth = { user: { ...(user || {}), ...updates, profile: { ...(user?.profile || {}), ...(updates.profile || {}) } } };
      await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify(auth));

      const key = String(auth.user.email || '').toLowerCase();
      const raw = await AsyncStorage.getItem('@elearning_profiles');
      const map = raw ? JSON.parse(raw) : {};
      map[key] = auth.user;
      await AsyncStorage.setItem('@elearning_profiles', JSON.stringify(map));

      setEditMode(false);
    } catch {}
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Image source={{ uri: avatarUri || user?.avatar || 'https://i.pravatar.cc/150?img=5' }} style={styles.avatar} />
        <Text style={[styles.name, { color: colors.text }]}>{user?.name || 'Guest User'}</Text>
        <Text style={[styles.title, { color: colors.muted }]}>{user?.role || 'guest'}</Text>
      </View>

      {/* Editable Profile */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('profile') || 'Profile'}</Text>
          <TouchableOpacity onPress={() => setEditMode(!editMode)}>
            <Text style={{ color: colors.primary, fontWeight: '700' }}>{editMode ? (t('cancel') || 'Cancel') : (t('edit') || 'Edit')}</Text>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        {editMode && (
          <TouchableOpacity onPress={pickAvatar} style={[styles.btn, { backgroundColor: colors.primary, alignSelf: 'flex-start' }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{t('change_photo') || 'Change Photo'}</Text>
          </TouchableOpacity>
        )}

        {/* Name */}
        <Text style={[styles.label, { color: colors.muted }]}>{t('name') || 'Name'}</Text>
        {editMode ? (
          <TextInput value={formName} onChangeText={setFormName} style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        ) : (
          <Text style={{ color: colors.text }}>{user?.name || '-'}</Text>
        )}

        {/* Email */}
        <Text style={[styles.label, { color: colors.muted }]}>{t('email') || 'Email'}</Text>
        <Text style={{ color: colors.text }}>{user?.email || '-'}</Text>

        {/* Phone */}
        <Text style={[styles.label, { color: colors.muted }]}>{t('phone') || 'Phone'}</Text>
        {editMode ? (
          <TextInput value={formPhone} onChangeText={setFormPhone} keyboardType="phone-pad" style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        ) : (
          <Text style={{ color: colors.text }}>{user?.profile?.phone || '-'}</Text>
        )}

        {/* Birth Date */}
        <Text style={[styles.label, { color: colors.muted }]}>{t('birth_date') || 'Birth Date'}</Text>
        {editMode ? (
          <TextInput value={formBirthDate} onChangeText={setFormBirthDate} placeholder="YYYY-MM-DD" style={[styles.input, { color: colors.text, borderColor: colors.border }]} />
        ) : (
          <Text style={{ color: colors.text }}>{user?.profile?.birthDate || '-'}</Text>
        )}

        {/* Save */}
        {editMode && (
          <TouchableOpacity onPress={saveProfile} style={[styles.btn, { backgroundColor: colors.primary, marginTop: 10 }]}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{t('save') || 'Save'}</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Logout */}
      {isAuthenticated && (
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
          <Text style={styles.logoutText}>{t('logout')}</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  header: { alignItems: 'center', marginBottom: 16 },
  avatar: { width: 84, height: 84, borderRadius: 42 },
  name: { fontSize: 18, fontWeight: '800', marginTop: 10 },
  title: { textTransform: 'capitalize', marginTop: 4 },
  card: { padding: 16, borderWidth: 1, borderRadius: 12, borderColor: theme.colors.border, backgroundColor: theme.colors.card },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  label: { marginTop: 12, marginBottom: 4 },
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  btn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  logoutButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 12, marginTop: 20, borderRadius: 10, backgroundColor: '#fee', gap: 6 },
  logoutText: { color: theme.colors.danger, fontWeight: '700' },
});
