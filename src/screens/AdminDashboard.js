import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import {
  addCourse,
  updateCourse,
  deleteCourse,
  loadCourses,
  selectAllCourses,
} from '../store/slices/coursesSlice';
import {
  addTeacher,
  updateTeacher,
  deleteTeacher,
  loadTeachers,
  selectAllTeachers,
} from '../store/slices/teachersSlice';
import { t } from '../i18n';

const CourseModal = ({
  visible,
  onClose,
  onSubmit,
  course,
  teachers,
  canPickTeacher,
}) => {
  const colors = useColors();
  const [form, setForm] = useState({
    id: course?.id || null,
    title: course?.title || '',
    description: course?.description || '',
    price: course?.price ? String(course.price) : '',
    category: course?.category || '',
    teacherId: course?.teacherId || '',
    imageUrl: course?.imageUrl || '',
  });
  useEffect(() => {
    if (visible) {
      setForm({
        id: course?.id || null,
        title: course?.title || '',
        description: course?.description || '',
        price: course?.price ? String(course.price) : '',
        category: course?.category || '',
        teacherId: course?.teacherId || '',
        imageUrl: course?.imageUrl || '',
      });
    }
  }, [course, visible]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      Alert.alert(t('validation_error') || 'Validation error', t('title_required') || 'Title is required');
      return;
    }
    const priceNumber = Number(form.price);
    const payload = {
      ...course,
      ...form,
      price: Number.isFinite(priceNumber) ? priceNumber : 0,
    };
    onSubmit(payload);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {form.id ? (t('edit_course') || 'Edit course') : (t('add_course') || 'Add course')}
          </Text>
          <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.base }}>
            <AdminInput
              label={t('title') || 'Title'}
              value={form.title}
              onChangeText={(text) => updateField('title', text)}
            />
            <AdminInput
              label={t('description') || 'Description'}
              value={form.description}
              onChangeText={(text) => updateField('description', text)}
              multiline
            />
            <AdminInput
              label={t('category') || 'Category'}
              value={form.category}
              onChangeText={(text) => updateField('category', text)}
            />
            <AdminInput
              label={t('price') || 'Price'}
              value={form.price}
              onChangeText={(text) => updateField('price', text)}
              keyboardType="decimal-pad"
            />
            {canPickTeacher ? (
              <View style={styles.field}>
                <Text style={[styles.label, { color: colors.muted }]}>
                  {t('teacher') || 'Teacher'}
                </Text>
                <ScrollView horizontal contentContainerStyle={{ gap: theme.spacing.sm }}>
                  <TouchableOpacity
                    onPress={() => updateField('teacherId', '')}
                    style={[
                      styles.chip,
                      {
                        backgroundColor: !form.teacherId ? colors.primary : colors.surface,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        { color: !form.teacherId ? '#fff' : colors.muted },
                      ]}
                    >
                      {t('unassigned') || 'Unassigned'}
                    </Text>
                  </TouchableOpacity>
                  {teachers.map((teacher) => (
                    <TouchableOpacity
                      key={teacher.id}
                      onPress={() => updateField('teacherId', teacher.id)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor:
                            form.teacherId === teacher.id ? colors.primary : colors.surface,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.chipText,
                          { color: form.teacherId === teacher.id ? '#fff' : colors.muted },
                        ]}
                      >
                        {teacher.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            ) : null}
            <AdminInput
              label={t('image_url') || 'Image URL'}
              value={form.imageUrl}
              onChangeText={(text) => updateField('imageUrl', text)}
            />
          </ScrollView>
          <View style={styles.modalActions}>
            <AdminButton variant="outline" label={t('cancel') || 'Cancel'} onPress={onClose} />
            <AdminButton variant="primary" label={t('save') || 'Save'} onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const TeacherModal = ({ visible, onClose, onSubmit, teacher }) => {
  const colors = useColors();
  const [form, setForm] = useState({
    id: teacher?.id || null,
    name: teacher?.name || '',
    email: teacher?.email || '',
    title: teacher?.title || '',
    bio: teacher?.bio || '',
  });

  useEffect(() => {
    if (visible) {
      setForm({
        id: teacher?.id || null,
        name: teacher?.name || '',
        email: teacher?.email || '',
        title: teacher?.title || '',
        bio: teacher?.bio || '',
      });
    }
  }, [teacher, visible]);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      Alert.alert(t('validation_error') || 'Validation error', t('name_required') || 'Name is required');
      return;
    }
    onSubmit({
      ...teacher,
      ...form,
      email: form.email?.trim() || '',
    });
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.modalBackdrop}>
        <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
          <Text style={[styles.modalTitle, { color: colors.text }]}>
            {form.id ? (t('edit_teacher') || 'Edit teacher') : (t('add_teacher') || 'Add teacher')}
          </Text>
          <ScrollView contentContainerStyle={{ paddingBottom: theme.spacing.base }}>
            <AdminInput
              label={t('name') || 'Name'}
              value={form.name}
              onChangeText={(text) => updateField('name', text)}
            />
            <AdminInput
              label={t('email') || 'Email'}
              value={form.email}
              onChangeText={(text) => updateField('email', text)}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <AdminInput
              label={t('title') || 'Title'}
              value={form.title}
              onChangeText={(text) => updateField('title', text)}
            />
            <AdminInput
              label={t('bio') || 'Bio'}
              value={form.bio}
              onChangeText={(text) => updateField('bio', text)}
              multiline
            />
          </ScrollView>
          <View style={styles.modalActions}>
            <AdminButton variant="outline" label={t('cancel') || 'Cancel'} onPress={onClose} />
            <AdminButton variant="primary" label={t('save') || 'Save'} onPress={handleSubmit} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const AdminButton = ({ label, onPress, variant = 'primary', icon }) => {
  const colors = useColors();
  const isPrimary = variant === 'primary';
  const isOutline = variant === 'outline';
  const isDanger = variant === 'danger';
  const backgroundColor = isPrimary ? colors.primary : isDanger ? theme.colors.danger : 'transparent';
  const borderColor = isOutline ? colors.primary : 'transparent';
  const textColor = isPrimary || isDanger ? '#fff' : colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.adminButton,
        {
          backgroundColor,
          borderColor,
        },
      ]}
    >
      {icon ? <Ionicons name={icon} size={16} color={textColor} style={{ marginRight: 6 }} /> : null}
      <Text style={[styles.adminButtonText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
};

const AdminInput = (props) => {
  const colors = useColors();
  const { label, style, multiline, ...rest } = props;
  return (
    <View style={styles.field}>
      {label ? <Text style={[styles.label, { color: colors.muted }]}>{label}</Text> : null}
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.surface,
            color: colors.text,
            height: multiline ? 96 : 44,
            textAlignVertical: multiline ? 'top' : 'center',
          },
          style,
        ]}
        multiline={multiline}
        {...rest}
      />
    </View>
  );
};

export default function AdminDashboard({ navigation }) {
  const colors = useColors();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  const courses = useSelector(selectAllCourses);
  const teachers = useSelector(selectAllTeachers);
  const coursesStatus = useSelector((state) => state.courses.status);
  const teachersStatus = useSelector((state) => state.teachers.status);

  const role = user?.role;
  const isAdmin = role === 'admin';
  const isTeacher = role === 'teacher';
  useEffect(() => {
    if (coursesStatus === 'idle') {
      dispatch(loadCourses());
    }
  }, [coursesStatus, dispatch]);

  useEffect(() => {
    if (teachersStatus === 'idle') {
      dispatch(loadTeachers());
    }
  }, [teachersStatus, dispatch]);

  useEffect(() => {
    if (!isAdmin && !isTeacher) {
      navigation.goBack?.();
    }
  }, [isAdmin, isTeacher, navigation]);

  const [courseModalVisible, setCourseModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const teacherLookup = useMemo(() => {
    const map = {};
    teachers.forEach((teacher) => {
      map[teacher.id] = teacher;
      if (teacher.email) {
        map[teacher.email.toLowerCase()] = teacher;
      }
    });
    return map;
  }, [teachers]);

  const teacherId = useMemo(() => {
    if (user?.profile?.teacherId) return user.profile.teacherId;
    const emailKey = user?.email?.toLowerCase?.();
    if (emailKey && teacherLookup[emailKey]?.id) return teacherLookup[emailKey].id;
    return null;
  }, [teacherLookup, user]);

  const visibleCourses = useMemo(() => {
    if (isAdmin) return courses;
    if (isTeacher && teacherId) {
      return courses.filter((course) => course?.teacherId === teacherId);
    }
    return [];
  }, [isAdmin, isTeacher, teacherId, courses]);

  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseModalVisible(true);
  };

  const openEditCourse = (course) => {
    setEditingCourse(course);
    setCourseModalVisible(true);
  };

  const handleSubmitCourse = async (course) => {
    const payload = isAdmin
      ? course
      : {
          ...course,
          teacherId: teacherId || course.teacherId || '',
        };
    if (course.id) {
      await dispatch(updateCourse(payload));
    } else {
      await dispatch(
        addCourse({
          ...payload,
          createdAt: Date.now(),
        }),
      );
    }
    setCourseModalVisible(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (course) => {
    Alert.alert(t('confirm_delete') || 'Confirm delete', t('delete_course_confirm') || 'Delete this course?', [
      { text: t('cancel') || 'Cancel', style: 'cancel' },
      {
        text: t('delete') || 'Delete',
        style: 'destructive',
        onPress: async () => {
          await dispatch(deleteCourse(course.id));
        },
      },
    ]);
  };

  const canModifyCourse = (course) => {
    if (isAdmin) return true;
    if (isTeacher && teacherId) {
      return course.teacherId === teacherId || !course.teacherId;
    }
    return false;
  };

  const openAddTeacher = () => {
    setEditingTeacher(null);
    setTeacherModalVisible(true);
  };

  const openEditTeacher = (teacher) => {
    setEditingTeacher(teacher);
    setTeacherModalVisible(true);
  };

  const handleSubmitTeacher = async (teacher) => {
    if (teacher.id) {
      await dispatch(updateTeacher(teacher));
    } else {
      await dispatch(addTeacher(teacher));
    }
    setTeacherModalVisible(false);
    setEditingTeacher(null);
  };

  const handleDeleteTeacher = (teacher) => {
    Alert.alert(
      t('confirm_delete') || 'Confirm delete',
      t('delete_teacher_confirm') || 'Delete this teacher?',
      [
        { text: t('cancel') || 'Cancel', style: 'cancel' },
        {
          text: t('delete') || 'Delete',
          style: 'destructive',
          onPress: async () => {
            await dispatch(deleteTeacher(teacher.id));
            const relatedCourses = courses.filter((course) => course.teacherId === teacher.id);
            for (const course of relatedCourses) {
              await dispatch(updateCourse({ ...course, teacherId: '' }));
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={{ padding: theme.spacing.base, gap: theme.spacing.base }}
    >
      <View style={[styles.card, { backgroundColor: colors.card }]}>
        <View style={styles.cardHeader}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>{t('courses') || 'Courses'}</Text>
          {isAdmin ? <AdminButton label={t('add_course') || 'Add course'} icon="add" onPress={openAddCourse} /> : null}
        </View>
        {visibleCourses.length === 0 ? (
          <Text style={{ color: colors.muted }}>{t('no_courses_available') || 'No courses available.'}</Text>
        ) : (
          visibleCourses.map((course) => {
            const teacher = teacherLookup[course.teacherId];
            return (
              <View key={course.id} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.courseTitle, { color: colors.text }]}>{course.title}</Text>
                  <Text style={[styles.courseMeta, { color: colors.muted }]}>
                    {(teacher?.name || t('unassigned') || 'Unassigned')}{' '}
                    · {course.category || t('category') || 'Category'} · $
                    {(course.price ?? 0).toFixed ? course.price.toFixed(2) : Number(course.price || 0).toFixed(2)}
                  </Text>
                </View>
                <View style={styles.rowActions}>
                  {canModifyCourse(course) ? (
                    <>
                      <TouchableOpacity onPress={() => openEditCourse(course)} style={styles.iconButton}>
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteCourse(course)} style={styles.iconButton}>
                        <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
                      </TouchableOpacity>
                    </>
                  ) : (
                    <Text style={{ color: colors.muted, fontSize: theme.fontSize.sm }}>
                      {t('restricted') || 'Restricted'}
                    </Text>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      {isAdmin ? (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>{t('teachers') || 'Teachers'}</Text>
            <AdminButton label={t('add_teacher') || 'Add teacher'} icon="person-add" onPress={openAddTeacher} />
          </View>
          {teachers.length === 0 ? (
            <Text style={{ color: colors.muted }}>{t('no_teachers_available') || 'No teachers yet.'}</Text>
          ) : (
            teachers.map((teacher) => (
              <View key={teacher.id} style={[styles.listItem, { borderBottomColor: colors.border }]}>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.courseTitle, { color: colors.text }]}>{teacher.name}</Text>
                  <Text style={[styles.courseMeta, { color: colors.muted }]}>
                    {teacher.email || t('no_email') || 'No email'} · {teacher.title || t('teacher') || 'Teacher'}
                  </Text>
                </View>
                <View style={styles.rowActions}>
                  <TouchableOpacity onPress={() => openEditTeacher(teacher)} style={styles.iconButton}>
                    <Ionicons name="create-outline" size={18} color={colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteTeacher(teacher)} style={styles.iconButton}>
                    <Ionicons name="trash-outline" size={18} color={theme.colors.danger} />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      ) : null}

      <CourseModal
        visible={courseModalVisible}
        onClose={() => {
          setCourseModalVisible(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSubmitCourse}
        course={editingCourse}
        teachers={teachers}
        canPickTeacher={isAdmin}
      />

      <TeacherModal
        visible={teacherModalVisible}
        onClose={() => {
          setTeacherModalVisible(false);
          setEditingTeacher(null);
        }}
        onSubmit={handleSubmitTeacher}
        teacher={editingTeacher}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.base,
    ...theme.shadow.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.extrabold,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: theme.spacing.sm,
  },
  courseTitle: {
    fontWeight: theme.fontWeight.semibold,
    fontSize: theme.fontSize.md,
  },
  courseMeta: {
    fontSize: theme.fontSize.sm,
    marginTop: 2,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.surface,
  },
  adminButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    borderWidth: 1,
  },
  adminButtonText: {
    fontWeight: theme.fontWeight.bold,
    fontSize: theme.fontSize.sm,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  modalCard: {
    borderRadius: theme.radius.lg,
    padding: theme.spacing.base,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.extrabold,
    marginBottom: theme.spacing.sm,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  field: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.semibold,
    marginBottom: 6,
  },
  input: {
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
  },
  chip: {
    borderRadius: theme.radius.full,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
  },
  chipText: {
    fontWeight: theme.fontWeight.semibold,
  },
});
