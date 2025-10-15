import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Platform } from 'react-native';
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
  const courseOptions = ['frontend','ui-ux','backend','mobile','data-science','devops','ai-ml'];
  const fileInputRef = useRef(null);

  const validate = () => {
    const next = {};
    const nm = name.trim();
    const em = email.trim();
    const bd = birthDate.trim();
    const ph = phone.trim();
    if (!nm) next.name = t('name_required') || 'Name is required';
    if (!em) next.email = t('email_required') || 'Email is required';
    if (role === 'admin' && em && !/^[^@]+@admin\.com$/i.test(em)) {
      next.email = t('admin_email_required') || 'Admin email must end with @admin.com';
    }
    if ((password || '').length < 6) next.password = t('password_min') || 'Min 6 characters';
    if (role !== 'teacher') {
      if (!confirmPassword) next.confirmPassword = t('confirm_password_required') || 'Confirm your password';
      else if (confirmPassword !== password) next.confirmPassword = t('passwords_mismatch') || 'Passwords do not match';
    }
    if (role === 'student') {
      if (!bd) next.birthDate = t('birthdate_required') || 'Birth date is required';
      else if (!/^\d{4}-\d{2}-\d{2}$/.test(bd)) next.birthDate = t('birthdate_format') || 'Use YYYY-MM-DD';
      if (!ph) next.phone = t('phone_required') || 'Phone is required';
      else if (!/^\+?[0-9]{8,15}$/.test(ph)) next.phone = t('phone_invalid') || 'Invalid phone number';
    } else if (role === 'admin') {
      if (!ph) next.phone = t('phone_required') || 'Phone is required';
      else if (!/^\+?[0-9]{8,15}$/.test(ph)) next.phone = t('phone_invalid') || 'Invalid phone number';
    }
    if (role === 'teacher' && !selectedCourse) {
      next.selectedCourse = t('select_course_required') || 'Select a course';
    }
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
      if (status !== 'granted') {
        setErrors((e) => ({ ...e, avatar: t('permission_denied') || 'Permission denied' }));
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!res.canceled && res.assets && res.assets.length > 0) {
        setAvatarUri(res.assets[0].uri);
        if (errors.avatar) setErrors({ ...errors, avatar: null });
      }
    } catch (e) {
      setErrors((prv) => ({ ...prv, avatar: t('image_picker_unavailable') || 'Image picker not available' }));
    }
  };

  const onRegister = async () => {
    if (!validate()) return;
    const profile = {
      phone: (phone || '').trim() || null,
      birthDate: (birthDate || '').trim() || null,
            teacherCourse: role === 'teacher' ? (selectedCourse || null) : null,
    };
    const user = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      role: role,
      avatar: avatarUri || 'https://i.pravatar.cc/150?img=4',
      profile,
    };
    try { dispatch(loginSuccess(user)); } catch {}
    try { await AsyncStorage.setItem('@elearning_auth_state', JSON.stringify({ user })); } catch {}
    try {
      const key = (user.email || '').toLowerCase();
      const raw = await AsyncStorage.getItem('@elearning_profiles');
      const map = raw ? JSON.parse(raw) : {};
      map[key] = user;
      await AsyncStorage.setItem('@elearning_profiles', JSON.stringify(map));
    } catch {}
    try {
      navigation.reset({ index: 0, routes: [{ name: 'HomeTabs' }] });
    } catch {}
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      style={{ flex: 1, backgroundColor: theme.colors.background }}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{t('create_account') || 'Create account'}</Text>
            <View style={styles.field}> 
        <Text style={styles.label}>{t('name') || 'Name'}</Text>
        <TextInput
          placeholder={t('name_placeholder') || 'Your name'}
          placeholderTextColor={theme.colors.textLight}
          value={name}
          onChangeText={(v) => { setName(v); if (errors.name) setErrors({ ...errors, name: null }); }}
          style={[styles.input, errors.name && styles.inputError]}
        />
        {errors.name ? <Text style={styles.err}>{errors.name}</Text> : null}
      </View>
      <View style={styles.field}> 
        <Text style={styles.label}>{t('email') || 'Email'}</Text>
        <TextInput
          placeholder={t('email_placeholder') || 'you@example.com'}
          placeholderTextColor={theme.colors.textLight}
          value={email}
          autoCapitalize="none"
          keyboardType="email-address"
          onChangeText={(v) => { setEmail(v); if (errors.email) setErrors({ ...errors, email: null }); }}
          style={[styles.input, errors.email && styles.inputError]}
        />
        {errors.email ? <Text style={styles.err}>{errors.email}</Text> : null}
      </View>
      <View style={styles.field}> 
        <Text style={styles.label}>{t('password') || 'Password'}</Text>
        <View style={styles.inputContainer}>
          <TextInput
            placeholder={t('password_placeholder') || '••••••'}
            placeholderTextColor={theme.colors.textLight}
            value={password}
            onChangeText={(v) => { setPassword(v); if (errors.password) setErrors({ ...errors, password: null }); }}
            secureTextEntry={!showPassword}
            style={[styles.input, { paddingRight: 42 }, errors.password && styles.inputError]}
          />
          <TouchableOpacity onPress={() => setShowPassword((s) => !s)} style={styles.eyeBtn}>
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={20} color={theme.colors.muted} />
          </TouchableOpacity>
        </View>
        {errors.password ? <Text style={styles.err}>{errors.password}</Text> : null}
      </View>
      
      {role !== 'teacher' ? (
        <View style={styles.field}>
          <Text style={styles.label}>{t('confirm_password') || 'Confirm Password'}</Text>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t('confirm_password') || 'Confirm Password'}
              placeholderTextColor={theme.colors.textLight}
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: null }); }}
              secureTextEntry={!showConfirm}
              style={[styles.input, { paddingRight: 42 }, errors.confirmPassword && styles.inputError]}
            />
            <TouchableOpacity onPress={() => setShowConfirm((s) => !s)} style={styles.eyeBtn}>
              <Ionicons name={showConfirm ? 'eye-off' : 'eye'} size={20} color={theme.colors.muted} />
            </TouchableOpacity>
          </View>
          {errors.confirmPassword ? <Text style={styles.err}>{errors.confirmPassword}</Text> : null}
        </View>
      ) : null}

      {role === 'student' ? (
        <>
          <View style={styles.field}>
            <Text style={styles.label}>{t('birth_date') || 'Birth Date'}</Text>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.textLight}
              value={birthDate}
              onChangeText={(v) => { setBirthDate(v); if (errors.birthDate) setErrors({ ...errors, birthDate: null }); }}
              style={[styles.input, errors.birthDate && styles.inputError]}
            />
            {errors.birthDate ? <Text style={styles.err}>{errors.birthDate}</Text> : null}
          </View>
          <View style={styles.field}>
            <Text style={styles.label}>{t('phone') || 'Phone'}</Text>
            <TextInput
              placeholder={t('phone_placeholder') || '+20123456789'}
              placeholderTextColor={theme.colors.textLight}
              value={phone}
              keyboardType="phone-pad"
              onChangeText={(v) => { setPhone(v); if (errors.phone) setErrors({ ...errors, phone: null }); }}
              style={[styles.input, errors.phone && styles.inputError]}
            />
            {errors.phone ? <Text style={styles.err}>{errors.phone}</Text> : null}
          </View>
                  </>
      ) : null}

      {role === 'admin' ? (
        <View style={styles.field}>
          <Text style={styles.label}>{t('phone') || 'Phone'}</Text>
          <TextInput
            placeholder={t('phone_placeholder') || '+20123456789'}
            placeholderTextColor={theme.colors.textLight}
            value={phone}
            keyboardType="phone-pad"
            onChangeText={(v) => { setPhone(v); if (errors.phone) setErrors({ ...errors, phone: null }); }}
            style={[styles.input, errors.phone && styles.inputError]}
          />
          {errors.phone ? <Text style={styles.err}>{errors.phone}</Text> : null}
        </View>
      ) : null}

      {role === 'teacher' ? (
        <View style={styles.field}>
          <Text style={styles.label}>{t('select_course') || 'Select Course'}</Text>
          <View style={styles.roleRow}>
            {courseOptions.map((opt) => (
              <TouchableOpacity key={opt} onPress={() => setSelectedCourse(opt)} style={[styles.roleChip, selectedCourse === opt && styles.roleChipActive]} activeOpacity={0.8}>
                <Text style={[styles.roleChipText, { color: selectedCourse === opt ? '#fff' : theme.colors.muted }]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
          {errors.selectedCourse ? <Text style={styles.err}>{errors.selectedCourse}</Text> : null}
        </View>
      ) : null}

      <View style={styles.field}>
        <Text style={styles.label}>{t('avatar') || 'Avatar'}</Text>
        {avatarUri ? (
          <Image source={{ uri: avatarUri }} style={styles.avatarPreview} />
        ) : null}
        {Platform.OS === 'web' ? (
          React.createElement('input', {
            type: 'file',
            accept: 'image/*',
            ref: (el) => (fileInputRef.current = el),
            onChange: (e) => {
              try {
                const f = e.target && e.target.files && e.target.files[0];
                if (f) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    try {
                      const dataUrl = reader.result;
                      if (typeof dataUrl === 'string') {
                        setAvatarUri(dataUrl);
                        if (errors.avatar) setErrors({ ...errors, avatar: null });
                      }
                    } catch {}
                  };
                  reader.readAsDataURL(f);
                }
              } catch {}
            },
            style: { display: 'none' },
          })
        ) : null}
        <View style={styles.rowActions}>
          <TouchableOpacity onPress={pickAvatar} style={[styles.chipBtn, { backgroundColor: theme.colors.primary }]}> 
            <Text style={{ color: '#fff', fontWeight: '700' }}>{t('choose_image') || 'Choose Image'}</Text>
          </TouchableOpacity>
          {avatarUri ? (
            <TouchableOpacity onPress={() => setAvatarUri('')} style={[styles.chipBtn, { borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}> 
              <Text style={{ color: theme.colors.text }}>{t('remove') || 'Remove'}</Text>
            </TouchableOpacity>
          ) : null}
        </View>
        {errors.avatar ? <Text style={styles.err}>{errors.avatar}</Text> : null}
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>{t('role') || 'Role'}</Text>
        <View style={styles.roleRow}>
          {['student','teacher','admin'].map((r) => (
            <TouchableOpacity key={r} onPress={() => { setRole(r); }} style={[styles.roleChip, role === r && styles.roleChipActive]} activeOpacity={0.8}>
              <Text style={[styles.roleChipText, { color: role === r ? '#fff' : theme.colors.muted }]}>{t(r) || r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity onPress={onRegister} style={styles.btn} activeOpacity={0.85}>
        <Text style={styles.btnText}>{t('create_account') || 'Create Account'}</Text>
      </TouchableOpacity>
      <View style={{ marginTop: 12, alignItems: 'center' }}>
        <Text style={{ color: theme.colors.muted }}>
          {(t('have_account') || 'Already have an account?') + ' '}
          <Text style={{ color: theme.colors.primary, fontWeight: '700' }} onPress={() => navigation.navigate('Login')}>
            {t('login') || 'Login'}
          </Text>
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '800', color: theme.colors.text, marginBottom: 6 },
  subtitle: { color: theme.colors.muted, marginBottom: 16 },
  field: { marginBottom: 12 },
  label: { color: theme.colors.muted, marginBottom: 6, fontWeight: '600' },
  input: { borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 12, paddingVertical: 12, borderRadius: 10, backgroundColor: theme.colors.card, color: theme.colors.text },
  inputError: { borderColor: theme.colors.danger },
  inputContainer: { position: 'relative' },
  eyeBtn: { position: 'absolute', right: 12, top: 12, height: 24, width: 24, alignItems: 'center', justifyContent: 'center' },
  err: { color: theme.colors.danger, fontSize: 12, marginTop: 6 },
  btn: { backgroundColor: theme.colors.primary, paddingVertical: 12, borderRadius: 10, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700' },
  roleRow: { flexDirection: 'row', gap: 8 },
  roleChip: { borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 999, backgroundColor: theme.colors.card },
  roleChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  roleChipText: { fontWeight: '700' },
  avatarPreview: { width: 84, height: 84, borderRadius: 42, marginBottom: 8 },
  rowActions: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  chipBtn: { paddingVertical: 10, paddingHorizontal: 12, borderRadius: 10 },
});

