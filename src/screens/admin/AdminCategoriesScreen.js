import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { useColors } from '../../theme/hooks';
import AdminLayout, { AdminCard, AdminButton } from '../../components/admin/AdminLayout';

const CATEGORIES_KEY = '@elearning_categories';

export default function AdminCategoriesScreen() {
  const colors = useColors();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newName, setNewName] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(CATEGORIES_KEY);
      const list = raw ? JSON.parse(raw) : [];
      setCategories(Array.isArray(list) ? list : []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (list) => {
    setCategories(list);
    await AsyncStorage.setItem(CATEGORIES_KEY, JSON.stringify(list));
  };

  const addCategory = async () => {
    const name = (newName || '').trim();
    if (!name) return;
    const id = Date.now().toString(36);
    const list = [...categories, { id, name }];
    await save(list);
    setNewName('');
  };

  const removeCategory = async (id) => {
    const list = categories.filter((c) => c.id !== id);
    await save(list);
  };

  const renameCategory = async (id, name) => {
    const list = categories.map((c) => (c.id === id ? { ...c, name } : c));
    await save(list);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <TextInput
        style={[styles.input, { flex: 1 }]}
        value={item.name}
        onChangeText={(txt) => renameCategory(item.id, txt)}
      />
      <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => removeCategory(item.id)}>
        <Ionicons name="trash" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <AdminLayout title="Categories" subtitle="Organize courses by category" scrollable={false}>
      <AdminCard>
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="New category name"
            placeholderTextColor={colors.muted}
            value={newName}
            onChangeText={setNewName}
          />
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={addCategory}>
            <Ionicons name="add" size={16} color="#fff" />
          </TouchableOpacity>
        </View>
      </AdminCard>
      <AdminCard title="All Categories">
        <FlatList
          data={categories}
          keyExtractor={(i) => i.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: theme.spacing.base }}
          ListEmptyComponent={<Text style={{ color: colors.muted }}>No categories</Text>}
          refreshing={loading}
          onRefresh={load}
        />
      </AdminCard>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontWeight: '800', marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  btn: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnDanger: { backgroundColor: theme.colors.danger },
});

