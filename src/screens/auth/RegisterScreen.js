import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image,
  Platform, KeyboardAvoidingView
} from 'react-native';
import theme from '../../theme';
import { t } from '../../i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../store/userSlice';

export default function RegisterScreen({ navigation }) {
  const dispatch = useDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [role, setRole] = useState('student');
  const [birthDate, setBirthDate] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('');
  const [avatarUri, setAvatarUri] = useState('');
  const [errors, setErrors] = useState({});
  const courseOptions = ['frontend', 'ui-ux', 'backend', 'mobile', 'data-science', 'devops', 'ai-ml'];
  const fileInputRef = useRef(null);
  const dateInputRef = useRef(null);
  const [birthDateObj, setBirthDateObj] = useState(null);
  const [NativeDatePicker, setNativeDatePicker] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const validate = () => {
    const next = {};
    const nm = name.trim();
    const em = email.trim();
    const bd = birthDate.trim();
    const ph = phone.trim();

    if (!nm) next.name = t('name_required') || 'Name is required';
    if (!em) next.email = t('email_required') || 'Email is required';
    if ((password || '').length < 6) next.password = t('password_min') || 'Min 6 characters';
    if (!confirmPassword) next.confirmPassword = t('confirm_password_required') || 'Confirm your password';
    else if (confirmPassword !== password) next.confirmPassword = t('passwords_mismatch') || 'Passwords do not match';
    if (role === 'student') {
      if (!bd) next.birthDate = t('birthdate_required') || 'Birth date is required';
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(bd)) next.birthDate = t('birthdate_format') || 'Use YYYY-MM-DD';
      if (!ph) next.phone = t('phone_required') || 'Phone is required';
    }
    if (role === 'teacher' && !selectedCourse) next.selectedCourse = 'Select a course';
    setErrors(next);
    return Object.keys(next).length === 0;
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
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) setAvatarUri(res.assets[0].uri);
    } catch {}
  };

  const formatDate = (d) => {
    try {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    } catch { return ''; }
  };

  const onRegister = async () => {
    if (!validate()) return;

    const profile = {
      phone: (phone || '').trim() || null,
      birthDate: (birthDate || '').trim() || null,
      teacherCourse: role === 'teacher' ? selectedCourse : null,
    };

    const user = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role,
      avatar: avatarUri || 'https://i.pravatar.cc/150?img=4',
      profile,
    };

    try {
      dispatch(loginSuccess(user));
      await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ user }));
      const key = user.email.toLowerCase();
      const raw = await AsyncStorage.getItem('@elearning_profiles');
      const map = raw ? JSON.parse(raw) : {};
      map[key] = user;
      await AsyncStorage.setItem('@elearning_profiles', JSON.stringify(map));
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
    } catch {}
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.centerContainer}
        keyboardShouldPersistTaps="handled"
        style={{ flex: 1, backgroundColor: theme.colors.background }}
      >
        <View style={styles.formCard}>
          <Text style={[styles.title, styles.centerText]}>{t('create_account') || 'Create account'}</Text>

          {/* نفس المدخلات هنا بدون تعديل */}
          {/* (اختصرتها عشان الكود ما يطولش أكتر من اللازم) */}
          {/* الكود الداخلي بتاع الحقول زي اللي عندك بالضبط */}

          <TouchableOpacity onPress={onRegister} style={styles.btn} activeOpacity={0.85}>
            <Text style={styles.btnText}>{t('create_account') || 'Create Account'}</Text>
          </TouchableOpacity>
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Text style={{ color: theme.colors.muted }}>
              {(t('have_account') || 'Already have an account?') + ' '}
              <Text
                style={{ color: theme.colors.primary, fontWeight: '700' }}
                onPress={() => navigation.navigate('Login')}
              >
                {t('login') || 'Login'}
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  centerContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  formCard: {
    width: '100%',
    maxWidth: 480,
    backgroundColor: theme.colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 12, shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  centerText: { textAlign: 'center' },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: 6 },
  subtitle: { color: theme.colors.muted, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { color: theme.colors.muted, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, backgroundColor: theme.colors.card, color: theme.colors.text },
  inputError: { borderColor: theme.colors.danger },
  btn: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
});
