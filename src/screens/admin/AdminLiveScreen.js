import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, FlatList, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import AdminLayout, { AdminCard, AdminButton } from '../../components/admin/AdminLayout';
import theme from '../../theme';
import { useColors } from '../../theme/hooks';
import { t } from '../../i18n';

const LIVE_KEY = '@elearning_live_now';

export default function AdminLiveScreen() {
  const colors = useColors();
  const [items, setItems] = useState([]);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => { (async () => {
    try { const raw = await AsyncStorage.getItem(LIVE_KEY); setItems(raw ? JSON.parse(raw) : []); } catch {}
  })(); }, []);

  const persist = async (next) => {
    setItems(next);
    try { await AsyncStorage.setItem(LIVE_KEY, JSON.stringify(next)); } catch {}
  };

  const add = async () => {
    const t1 = (title || '').trim(); const u1 = (url || '').trim();
    if (!t1) return Alert.alert('Validation', 'Title required');
    const next = [{ id: Date.now(), title: t1, url: u1 }, ...items];
    await persist(next); setTitle(''); setUrl('');
  };

  const remove = async (id) => { await persist(items.filter((x) => x.id !== id)); };
  const notify = (aud) => Alert.alert('Notify', `Sent to ${aud}`);

  return (
    <AdminLayout title={t('live_now') || 'Live Now'} subtitle={t('manage_live') || 'Manage live sessions'}>
      <AdminCard title={t('add_live') || 'Add live item'}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput placeholder={t('title') || 'Title'} value={title} onChangeText={setTitle} style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
          <TextInput placeholder={t('url') || 'URL'} value={url} onChangeText={setUrl} style={[styles.input, { flex: 1, borderColor: colors.border, color: colors.text, backgroundColor: colors.card }]} />
          <AdminButton label={t('add') || 'Add'} icon="add" onPress={add} />
        </View>
      </AdminCard>

      <AdminCard title={t('notify') || 'Notify'}>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <AdminButton label={t('notify_teachers') || 'Notify Teachers'} icon="notifications" onPress={() => notify('teachers')} />
          <AdminButton label={t('notify_students') || 'Notify Students'} icon="notifications-outline" variant="outline" onPress={() => notify('students')} />
        </View>
      </AdminCard>

      <FlatList
        style={{ marginTop: 8 }}
        data={items}
        keyExtractor={(i) => String(i.id)}
        renderItem={({ item }) => (
          <View style={[styles.row, { borderColor: colors.border, backgroundColor: colors.card }]}>
            <Text style={[styles.title, { color: colors.text }]}>{item.title}</Text>
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
  row: { borderWidth: 1, borderRadius: 8, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontWeight: '700' },
});

