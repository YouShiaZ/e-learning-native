import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import AdminLayout, { AdminCard, AdminButton, AdminStat } from '../../components/admin/AdminLayout';
import { useColors } from '../../theme/hooks';
import theme from '../../theme';
import { useSelector } from 'react-redux';
import { t } from '../../i18n';

export default function AdminDashboardScreen({ navigation }) {
  const colors = useColors();
  const courses = (useSelector((s) => s.courses?.list) || []);
  const users = (useSelector((s) => s.user?.all) || []);

  const stats = useMemo(() => {
    const totalCourses = courses.length || 0;
    const published = courses.filter((c) => c.published).length;
    const drafts = totalCourses - published;
    const totalUsers = users.length || 0;
    const teachers = users.filter((u) => u.role === 'teacher').length;
    return { totalCourses, published, drafts, totalUsers, teachers };
  }, [courses, users]);

  return (
    <AdminLayout
      title={t('admin_panel') || 'Admin Panel'}
      subtitle={t('overview_quick_actions') || 'Overview and quick actions'}
      actions={[
        { label: t('new_course') || 'New Course', icon: 'add', onPress: () => navigation.navigate('AdminCourseForm') },
        { label: t('settings') || 'Settings', icon: 'settings', variant: 'outline', onPress: () => navigation.navigate('AdminSettings') },
      ]}
    >
      <View style={styles.grid}>
        <AdminStat label={t('courses')} value={stats.totalCourses} icon="book" />
        <AdminStat label={t('published')} value={stats.published} icon="cloud-done" color={colors.success} />
        <AdminStat label={t('drafts')} value={stats.drafts} icon="cloud-offline" color={colors.warning} />
        <AdminStat label={t('users')} value={stats.totalUsers} icon="people" />
        <AdminStat label={t('teachers')} value={stats.teachers} icon="school" />
      </View>

      <AdminCard title={t('quick_links') || 'Quick Links'} style={{ marginTop: theme.spacing.base }}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <AdminButton label={t('manage_courses') || 'Manage Courses'} icon="book" onPress={() => navigation.navigate('AdminCourses')} />
          <AdminButton label={t('users')} icon="people" variant="outline" onPress={() => navigation.navigate('AdminUsers')} />
          <AdminButton label={t('categories')} icon="pricetags" variant="outline" onPress={() => navigation.navigate('AdminCategories')} />
        </View>
      </AdminCard>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
});


