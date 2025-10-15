import React from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
import theme from '../theme';
import { useColors } from '../theme/hooks';
import { instructors, courses } from '../mock/data';
import { CourseCardHorizontal } from '../components/CourseCard';

export default function TeacherProfileScreen({ route, navigation }) {
  const id = route?.params?.teacherId || 't1';
  const colors = useColors();
  const teacher = instructors.find((t) => t.id === id) || instructors[0];
  const teacherCourses = courses.filter((c) => c.teacherId === teacher.id);

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: colors.background }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <ImageBackground source={{ uri: teacher.banner }} style={styles.banner}>
        <View style={styles.overlay} />
        <View style={styles.profileRow}>
          <Image source={{ uri: teacher.avatar }} style={styles.avatar} />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.name}>{teacher.name}</Text>
            <Text style={styles.role}>Teacher</Text>
          </View>
        </View>
      </ImageBackground>

      <View style={{ padding: 20 }}>
        <Text style={[styles.section, { color: colors.text }]}>UI/UX Design</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
          {teacherCourses.map((c) => (
            <CourseCardHorizontal key={c.id} course={c} onPress={() => navigation.navigate('CourseDetails', { courseId: c.id })} />
          ))}
        </ScrollView>

        <Text style={[styles.section, { color: colors.text }]}>Graphic Design</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
          {courses.map((c) => (
            <CourseCardHorizontal key={c.id + '-g'} course={c} onPress={() => navigation.navigate('CourseDetails', { courseId: c.id })} />
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingBottom: 24 },
  banner: { height: 170, justifyContent: 'flex-end' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },
  profileRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 72, height: 72, borderRadius: 36, borderWidth: 2, borderColor: '#fff' },
  name: { color: '#fff', fontWeight: '800', fontSize: 16 },
  role: { color: '#fff', opacity: 0.9, marginTop: 4 },
  section: { fontWeight: '700', color: theme.colors.text, marginTop: 16 },
});
