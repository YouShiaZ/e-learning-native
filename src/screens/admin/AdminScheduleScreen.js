import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AdminLayout, { AdminCard, AdminButton } from '../../components/admin/AdminLayout';
import { useColors } from '../../theme/hooks';
import theme from '../../theme';
import { t } from '../../i18n';

const SKEY = '@elearning_schedule';

export default function AdminScheduleScreen() {
  const colors = useColors();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => { (async () => {
    try { const raw = await AsyncStorage.getItem(SKEY); setItems(raw ? JSON.parse(raw) : []); } catch {}
  })(); }, []);

  const persist = async (next) => { setItems(next); try { await AsyncStorage.setItem(SKEY, JSON.stringify(next)); } catch {} };
  const add = async () => {
    if (!(title && date && time)) return Alert.alert('Validation', 'Fill all fields');
    const next = [{ id: Date.now(), title, date, time }, ...items];
    await persist(next); setTitle(''); setDate(''); setTime('');
  };
  const remove = async (id) => { await persist(items.filter((i) => i.id !== id)); };

  return (
    <AdminLayout title={t('schedule') || 'Schedule'} subtitle={t('manage_schedule') || 'Manage online sessions schedule'}>
      <AdminCard title={t('add_event') || 'Add event'}>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          <TextInput placeholder={t('title') || 'Title'} value={title} onChangeText={setTitle} style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
          <TextInput placeholder={t('date') || 'YYYY-MM-DD'} value={date} onChangeText={setDate} style={[styles.input, { width: 140, borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
          <TextInput placeholder={t('time') || 'HH:mm'} value={time} onChangeText={setTime} style={[styles.input, { width: 100, borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
          <AdminButton label={t('add') || 'Add'} icon="add" onPress={add} />
        </View>
      </AdminCard>

      <FlatList
        style={{ marginTop: 8 }}
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
            <Text style={{ color: colors.muted }}>{item.date} • {item.time}</Text>
            <TouchableOpacity onPress={() => remove(item.id)}>
              <Ionicons name="trash" size={18} color={theme.colors.danger} />
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8 },
  row: { borderWidth: 1, borderRadius: 8, padding: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontWeight: '700' },
});

