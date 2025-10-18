import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { t } from '../i18n';
import { courses, instructors } from '../mock/data';
import { CourseCardVertical } from '../components/CourseCard';
import { logout } from '../store/userSlice';
import { clearSession } from '../services/authStorage';

const FALLBACK_AVATAR = 'https://i.pravatar.cc/150?img=15';

function SectionTitle({ children, style }) {
  return (
    <Text style={[styles.sectionTitle, style]}>
      {children}
    </Text>
  );
}

export default function ProfileScreen({ navigation }) {
  const colors = useColors();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
  const isAdmin = useSelector((state) => state.user.isAdmin);
  const enrolledIds = useSelector((state) => state.user.enrolled);

  const avatar = user?.avatar || FALLBACK_AVATAR;
  const roleLabel = (() => {
    if (!user?.role) return t('role_user') || 'Learner';
    switch (user.role) {
      case 'teacher':
        return t('role_teacher') || 'Teacher';
      case 'admin':
        return t('role_admin') || 'Admin';
      case 'student':
        return t('role_student') || 'Student';
      default:
        return user.role;
    }
  })();

  const enrolledCourses = useMemo(
    () => courses.filter((course) => enrolledIds.includes(course.id)),
    [enrolledIds],
  );

  const teacherCourses = useMemo(() => {
    if (!user || user.role !== 'teacher') return [];
    const matchingInstructor =
      instructors.find(
        (inst) =>
          inst.name.toLowerCase() === (user.name || '').toLowerCase() ||
          inst.id === user.instructorId,
      ) || null;
    if (!matchingInstructor) return [];
    return courses.filter(
      (course) =>
        course.teacherId === matchingInstructor.id ||
        course.author === matchingInstructor.name,
    );
  }, [user]);

  const handleLogout = async () => {
    dispatch(logout());
    await clearSession();
    const parent = navigation.getParent?.();
    if (parent?.reset) {
      parent.reset({ index: 0, routes: [{ name: 'WelcomeStack' }] });
      return;
    }
    navigation.reset?.({ index: 0, routes: [{ name: 'WelcomeStack' }] });
  };

  const handleEditProfile = () => {
    Alert.alert(
      t('coming_soon') || 'Coming soon',
      t('profile_edit_soon') || 'Profile editing will be available in a future update.'
    );
  };

  const handleManageCourses = () => {
    const parent = navigation.getParent?.();
    const target = { screen: 'AdminDashboard' };
    if (parent?.navigate) {
      parent.navigate('AdminPanel', target);
    } else {
      navigation.navigate('AdminPanel', target);
    }
  };

  if (!isAuthenticated || !user) {
    return (
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: colors.background },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.card, { alignItems: 'center' }]}>
          <Ionicons
            name="person-circle-outline"
            size={96}
            color={colors.muted}
          />
          <Text style={[styles.title, { color: colors.text }]}>
            {t('profile_guest_title') || 'You are viewing as a guest'}
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: colors.muted, textAlign: 'center' },
            ]}
          >
            {t('profile_guest_message') ||
              'Sign in to see your saved courses, progress, and personal details.'}
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.primaryBtnText}>
              {t('login') || 'Login'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
              {t('create_account') || 'Create Account'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.card, { alignItems: 'center' }]}>
        <Image source={{ uri: avatar }} style={styles.avatar} />
        <Text style={[styles.name, { color: colors.text }]}>
          {user.name || 'Learner'}
        </Text>
        <Text style={[styles.role, { color: colors.muted }]}>{roleLabel}</Text>
        <Text style={[styles.email, { color: colors.muted }]}>
          {user.email || 'no-email@example.com'}
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {enrolledCourses.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {t('profile_enrolled') || 'Enrolled'}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {teacherCourses.length}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {t('profile_created') || 'Created'}
            </Text>
          </View>
          <View style={styles.stat}>
            <Text style={[styles.statValue, { color: colors.text }]}>
              {isAdmin ? t('yes') || 'Yes' : t('no') || 'No'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.muted }]}>
              {t('profile_admin') || 'Admin'}
            </Text>
          </View>
        </View>

        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: colors.primary }]}
            onPress={handleEditProfile}
          >
            <Ionicons name="create-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
              {t('edit_profile') || 'Edit profile'}
            </Text>
          </TouchableOpacity>
          {(user.role === 'admin' || user.role === 'teacher') ? (
            <TouchableOpacity
              style={[styles.outlineBtn, { borderColor: colors.primary }]}
              onPress={handleManageCourses}
            >
              <Ionicons name="briefcase-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
              <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
                {user.role === 'admin'
                  ? t('admin_dashboard') || 'Admin dashboard'
                  : t('manage_courses') || 'Manage courses'}
              </Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[styles.outlineBtn, { borderColor: colors.primary }]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={[styles.outlineBtnText, { color: colors.primary }]}>
              {t('browse_courses') || 'Browse Courses'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
            onPress={handleLogout}
          >
            <Ionicons
              name="log-out-outline"
              size={18}
              color="#fff"
              style={{ marginRight: 6 }}
            />
            <Text style={styles.primaryBtnText}>{t('logout') || 'Logout'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.card}>
        <SectionTitle style={{ color: colors.text }}>
          {t('profile_about_you') || 'About you'}
        </SectionTitle>
        <Text style={[styles.paragraph, { color: colors.muted }]}>
          {user.bio ||
            t('profile_about_default') ||
            'Your profile is ready to share with learners. Add more details to let others know about your expertise.'}
        </Text>
      </View>

      <View style={styles.card}>
        <SectionTitle style={{ color: colors.text }}>
          {t('profile_enrolled_courses') || 'Enrolled courses'}
        </SectionTitle>
        {enrolledCourses.length === 0 ? (
          <Text style={{ color: colors.muted }}>
            {t('profile_no_enrolled') || 'You have not enrolled in any courses yet.'}
          </Text>
        ) : (
          enrolledCourses.map((course) => (
            <CourseCardVertical
              key={course.id}
              course={course}
              onPress={() =>
                navigation.navigate('Home', {
                  screen: 'CourseDetails',
                  params: { courseId: course.id },
                })
              }
            />
          ))
        )}
      </View>

      {user.role === 'teacher' ? (
        <View style={styles.card}>
          <SectionTitle style={{ color: colors.text }}>
            {t('profile_teacher_courses') || 'Courses you teach'}
          </SectionTitle>
          {teacherCourses.length === 0 ? (
            <Text style={{ color: colors.muted }}>
              {t('profile_teacher_empty') || 'No courses assigned yet.'}
            </Text>
          ) : (
            teacherCourses.map((course) => (
              <CourseCardVertical
                key={course.id}
                course={course}
                onPress={() =>
                  navigation.navigate('Home', {
                    screen: 'CourseDetails',
                    params: { courseId: course.id },
                  })
                }
              />
            ))
          )}
        </View>
      ) : null}

      <View style={{ height: 32 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 12,
  },
  name: {
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
  },
  role: {
    textTransform: 'capitalize',
    marginTop: 4,
  },
  email: {
    marginTop: 4,
    fontSize: theme.fontSize.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: theme.fontSize.lg,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: theme.fontSize.xs,
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    flex: 1,
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '700',
  },
  outlineBtn: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  outlineBtnText: {
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: theme.fontSize.base,
    fontWeight: '700',
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: '800',
    marginTop: 12,
  },
  subtitle: {
    marginTop: 8,
    lineHeight: 20,
  },
  paragraph: {
    lineHeight: 20,
  },
});
