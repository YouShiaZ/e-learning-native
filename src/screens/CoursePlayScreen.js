import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { courses } from '../mock/data';
import Tabs from '../components/Tabs';
import Accordion from '../components/Accordion';

export default function CoursePlayScreen({ route }) {
  const id = route?.params?.courseId || 'c2';
  const course = useMemo(() => courses.find((c) => c.id === id) || courses[0], [id]);
  const [tab, setTab] = useState('LESSONS');

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 90 }}
        showsVerticalScrollIndicator={false}
      >
        <Image source={{ uri: course.thumbnail }} style={styles.cover} />

        <View style={{ paddingHorizontal: 20, paddingTop: 12 }}>
          <Text style={styles.title}>{course.title}</Text>
          <View style={styles.topMeta}>
            <Text style={styles.meta}>231 Like</Text>
            <Text style={styles.dot}>•</Text>
            <Text style={styles.meta}>16 Share</Text>
          </View>

          <Tabs items={['LESSONS', 'PROJECTS', 'Q&A']} value={tab} onChange={setTab} />

          {tab === 'LESSONS' && <Lessons course={course} />}
          {tab === 'PROJECTS' && <Projects course={course} />}
          {tab === 'Q&A' && <QA />}
        </View>
      </ScrollView>
      {tab === 'Q&A' && <QAInput />}
    </View>
  );
}

function Lessons({ course }) {
  const sections = course.curriculum?.map((sec) => ({
    id: sec.id,
    title: sec.title,
    items: sec.items.map((it, idx) => ({
      id: it.id,
      index: idx + 1,
      title: it.title,
      subtitle: `${it.duration} mins`,
      trailing: <Ionicons name={'play-outline'} size={18} color={theme.colors.primary} />,
    })),
  }));
  return <Accordion sections={sections} initiallyOpen={sections?.[0]?.id} />;
}

function Projects() {
  return (
    <View style={{ paddingBottom: 16 }}>
      <TouchableOpacity style={styles.uploadBox}>
        <Ionicons name="cloud-upload-outline" size={24} color={theme.colors.primary} />
        <Text style={styles.uploadText}>Upload your project here</Text>
      </TouchableOpacity>

      <Text style={styles.sectionTitle}>12 Student Projects</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 8 }}>
        {[1,2,3,4].map((i) => (
          <Image key={i} source={{ uri: `https://images.unsplash.com/photo-15${i}58979218367-8466d910aaa4?w=600&q=60` }} style={styles.projectImg} />
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Project Description</Text>
      <Text style={styles.desc}>Culpa aliquip commodo incididunt nostrud aliqua et adipisicing officia. Laborum consequat ea reprehenderit voluptate voluptate quis pariatur dolor.</Text>

      <Text style={styles.sectionTitle}>Resources (2)</Text>
      {[{name: 'Document 1.txt', size: '612 Kb'}, {name: 'Document 2.pdf', size: '35 Mb'}].map((r) => (
        <View key={r.name} style={styles.resourceRow}>
          <Ionicons name="document-text-outline" size={22} color={theme.colors.text} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={{ fontWeight: '600', color: theme.colors.text }}>{r.name}</Text>
            <Text style={{ color: theme.colors.muted, fontSize: 12 }}>{r.size}</Text>
          </View>
          <Ionicons name="download-outline" size={22} color={theme.colors.muted} />
        </View>
      ))}
    </View>
  );
}

function QA() {
  const items = [
    { id: 1, name: 'Jane Barry', time: 'A day ago', likes: 23, comments: 5, text: 'Deserunt minim incididunt cillum nostrud do voluptate.' },
    { id: 2, name: 'Thomas', time: 'A day ago', likes: 23, comments: 5, text: 'Excepteur minim ex enim est.' },
    { id: 3, name: 'Jenny Barry', time: '5 days ago', likes: 23, comments: 5, text: 'Magna es esse nisi dolor laboris ullamco.' },
  ];
  return (
    <View style={{ paddingBottom: 80 }}>
      {items.map((m) => (
        <View key={m.id} style={styles.qaCard}>
          <Image source={{ uri: 'https://i.pravatar.cc/100' }} style={styles.qaAvatar} />
          <View style={{ flex: 1 }}>
            <Text style={styles.qaName}>{m.name}</Text>
            <Text style={styles.qaTime}>{m.time}</Text>
            <Text style={styles.qaText}>{m.text}</Text>
            <View style={styles.qaMetaRow}>
              <Ionicons name="heart-outline" size={16} color={theme.colors.muted} />
              <Text style={styles.qaMeta}>{m.likes}</Text>
              <Ionicons name="chatbubble-ellipses-outline" size={16} color={theme.colors.muted} style={{ marginLeft: 10 }} />
              <Text style={styles.qaMeta}>{m.comments} Comment</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}

function QAInput() {
  return (
    <View style={styles.qaInputBar}>
      <Image source={{ uri: 'https://i.pravatar.cc/100?img=5' }} style={styles.qaMe} />
      <View style={styles.qaField}>
        <TextInput placeholder="Write a Q&A..." style={{ flex: 1 }} />
      </View>
      <Ionicons name="send" size={20} color={theme.colors.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  cover: { width: '100%', height: 190 },
  title: { fontSize: 18, fontWeight: '800', color: theme.colors.text },
  topMeta: { flexDirection: 'row', marginTop: 6 },
  meta: { color: theme.colors.muted },
  dot: { marginHorizontal: 6, color: theme.colors.muted },
  

  

  uploadBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: theme.colors.primary, borderRadius: 12, padding: 16, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  uploadText: { color: theme.colors.primary, marginTop: 6, fontWeight: '700' },
  projectImg: { width: 160, height: 110, borderRadius: 12, marginRight: 10 },
  sectionTitle: { fontWeight: '700', color: theme.colors.text, marginTop: 16, marginBottom: 6 },
  desc: { color: theme.colors.muted },
  resourceRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, backgroundColor: '#fff', marginTop: 10 },

  qaCard: { flexDirection: 'row', borderWidth: 1, borderColor: theme.colors.border, borderRadius: 12, padding: 12, backgroundColor: '#fff', marginTop: 10 },
  qaAvatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  qaName: { fontWeight: '700', color: theme.colors.text },
  qaTime: { color: theme.colors.muted, fontSize: 12 },
  qaText: { color: theme.colors.text, marginTop: 6 },
  qaMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  qaMeta: { color: theme.colors.muted, marginLeft: 4 },
  qaInputBar: { position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: '#fff', paddingHorizontal: 12, paddingVertical: 10 },
  qaMe: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  qaField: { flex: 1, backgroundColor: theme.colors.surface, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8 },
});
