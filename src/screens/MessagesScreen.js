import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../theme';
import { useColors } from '../theme/hooks';

const DATA = [
  { id: 'm1', title: 'Welcome to E-Learning', preview: 'Happy to have you here.' },
  { id: 'm2', title: 'New course released', preview: 'Check out UI Design Pro.' },
];

export default function MessagesScreen() {
  const colors = useColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={DATA}
        keyExtractor={(i) => i.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.row, { backgroundColor: colors.card }]}>
            <View style={[styles.icon, { backgroundColor: colors.surface }]}><Ionicons name="chatbubble-ellipses" size={18} color={colors.primary} /></View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
              <Text style={[styles.preview, { color: colors.muted }]}>{item.preview}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.muted} />
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        contentContainerStyle={{ paddingBottom: theme.spacing.xl }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 12, borderRadius: 12 },
  icon: { width: 36, height: 36, borderRadius: 18, backgroundColor: theme.colors.surface, alignItems: 'center', justifyContent: 'center', marginRight: 10 },
  title: { color: theme.colors.text, fontWeight: '700' },
  preview: { color: theme.colors.muted, marginTop: 2, fontSize: 12 },
  sep: { height: 10 },
});
