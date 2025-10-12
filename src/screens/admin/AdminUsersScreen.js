import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import { useColors } from '../../theme/hooks';
import AdminLayout, { AdminCard, AdminButton } from '../../components/admin/AdminLayout';

const USERS_KEY = '@elearning_users';
const INVITE_KEY = '@elearning_invite_code';
const AUTH_KEY = '@elearning_auth_state';

export default function AdminUsersScreen() {
  const colors = useColors();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inviteCode, setInviteCode] = useState('');

  // Admin create account form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newRole, setNewRole] = useState('student'); // 'student' | 'teacher'

  const persist = async (list) => {
    try {
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(list));
    } catch {}
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const raw = await AsyncStorage.getItem(USERS_KEY);
      let list = raw ? JSON.parse(raw) : [];

      // Auto-seed from current auth state if not present
      try {
        const authRaw = await AsyncStorage.getItem(AUTH_KEY);
        const auth = authRaw ? JSON.parse(authRaw) : null;
        const current = auth?.user;
        if (current?.email) {
          const exists = list.some((u) => (u.email || '').toLowerCase() === String(current.email).toLowerCase());
          if (!exists) {
            const seeded = {
              id: current.id || Date.now(),
              name: current.name || 'User',
              email: current.email,
              role: current.role || 'student',
              isApproved: current.role === 'teacher' ? false : true,
              avatar: current.avatar || 'https://i.pravatar.cc/150?img=1',
            };
            list = [seeded, ...list];
            await persist(list);
          }
        }
      } catch {}

      setUsers(list);
      const code = (await AsyncStorage.getItem(INVITE_KEY)) || '';
      setInviteCode(code);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const teachers = users.filter((u) => u.role === 'teacher');
  const pending = teachers.filter((u) => !u.isApproved);
  const students = users.filter((u) => u.role !== 'teacher' && u.role !== 'admin');

  const setApproval = async (id, approved) => {
    try {
      const updated = users.map((u) => (u.id === id ? { ...u, isApproved: approved } : u));
      setUsers(updated);
      await persist(updated);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to update user');
    }
  };

  const deleteUser = async (id) => {
    try {
      const updated = users.filter((u) => u.id !== id);
      setUsers(updated);
      await persist(updated);
    } catch (e) {
      Alert.alert('Error', e.message || 'Failed to delete user');
    }
  };

  const onDeletePress = (item) => {
    Alert.alert('Delete', `Delete ${item.email}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteUser(item.id) },
    ]);
  };

  const generateInvite = async () => {
    // Simple 6-char code
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    setInviteCode(code);
    await AsyncStorage.setItem(INVITE_KEY, code);
    Alert.alert('Invite Code', `New code: ${code}`);
  };

  const saveInvite = async () => {
    await AsyncStorage.setItem(INVITE_KEY, (inviteCode || '').trim());
    Alert.alert('Saved', 'Invite code updated');
  };

  const createUser = async () => {
    const name = (newName || '').trim();
    const email = (newEmail || '').trim();
    const role = (newRole || 'student').toLowerCase();

    if (!name) return Alert.alert('Validation', 'Name is required');
    if (!email) return Alert.alert('Validation', 'Email is required');
    const exists = users.some((u) => (u.email || '').toLowerCase() === email.toLowerCase());
    if (exists) return Alert.alert('Validation', 'Email already exists');
    if (!['student', 'teacher', 'admin'].includes(role)) return Alert.alert('Validation', 'Invalid role');

    const u = {
      id: Date.now(),
      name,
      email,
      role,
      isApproved: role === 'teacher' ? false : true,
      avatar: 'https://i.pravatar.cc/150?u=' + encodeURIComponent(email),
    };

    const list = [u, ...users];
    setUsers(list);
    await persist(list);
    setNewName('');
    setNewEmail('');
    setNewRole('student');
  };

  const renderRow = (item) => (
    <View key={item.id} style={styles.row}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.sub}>{item.email} • {item.role}{item.role === 'teacher' ? ` • ${item.isApproved ? 'Approved' : 'Pending'}` : ''}</Text>
      </View>
      {item.role === 'teacher' ? (
        item.isApproved ? (
          <TouchableOpacity style={[styles.btn, styles.btnDanger]} onPress={() => setApproval(item.id, false)}>
            <Ionicons name="close" size={16} color="#fff" /><Text style={styles.btnText}>Revoke</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.btn, styles.btnPrimary]} onPress={() => setApproval(item.id, true)}>
            <Ionicons name="checkmark" size={16} color="#fff" /><Text style={styles.btnText}>Approve</Text>
          </TouchableOpacity>
        )
      ) : null}
      <TouchableOpacity style={[styles.iconBtn, styles.btnDanger]} onPress={() => onDeletePress(item)}>
        <Ionicons name="trash" size={16} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  return (
    <AdminLayout title="Users" subtitle="Approve teachers, manage students, and invitations" scrollable={false}>
      {/* Create account */}
      <AdminCard title="Create Account (Student/Teacher)">
        <View style={styles.createRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Name"
            value={newName}
            onChangeText={setNewName}
          />
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={newEmail}
            onChangeText={setNewEmail}
          />
        </View>
        <View style={[styles.createRow, { marginTop: 8 }]}>
          <TouchableOpacity
            style={[styles.roleChip, newRole === 'student' ? styles.roleChipActive : null]}
            onPress={() => setNewRole('student')}
          >
            <Text style={[styles.roleChipText, newRole === 'student' ? styles.roleChipTextActive : null]}>Student</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleChip, newRole === 'teacher' ? styles.roleChipActive : null]}
            onPress={() => setNewRole('teacher')}
          >
            <Text style={[styles.roleChipText, newRole === 'teacher' ? styles.roleChipTextActive : null]}>Teacher</Text>
          </TouchableOpacity>
          <AdminButton label="Add" icon="add" onPress={createUser} />
        </View>
        <Text style={styles.hint}>Teacher accounts start as Pending and require approval.</Text>
      </AdminCard>

      {/* Invite code section for teachers */}
      <AdminCard title="Teacher Invite Code">
        <View style={styles.inviteRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Enter or generate code"
            value={inviteCode}
            onChangeText={setInviteCode}
            autoCapitalize="characters"
          />
          <AdminButton label="Save" icon="save" onPress={saveInvite} />
          <AdminButton label="Generate" icon="refresh" variant="outline" onPress={generateInvite} />
        </View>
      </AdminCard>

      <ScrollView contentContainerStyle={{ paddingBottom: 16 }}>
        {/* Pending Teachers */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Pending Teachers ({pending.length})</Text>
        {pending.length === 0 ? (
          <Text style={styles.empty}>No pending teachers</Text>
        ) : (
          pending.map(renderRow)
        )}

        {/* All Teachers */}
        <Text style={[styles.sectionTitle, { marginTop: 16, color: colors.text }]}>All Teachers ({teachers.length})</Text>
        {teachers.length === 0 ? (
          <Text style={styles.empty}>No teachers</Text>
        ) : (
          teachers.map(renderRow)
        )}

        {/* Students */}
        <Text style={[styles.sectionTitle, { marginTop: 16, color: colors.text }]}>Students ({students.length})</Text>
        {students.length === 0 ? (
          <Text style={styles.empty}>No students</Text>
        ) : (
          students.map(renderRow)
        )}

        {/* All Emails */}
        <AdminCard title={`All Registered Emails (${users.length})`}>
          {users.length === 0 ? (
            <Text style={styles.empty}>No users</Text>
          ) : (
            <View style={{ gap: 6 }}>
              {users.map((u) => (
                <Text key={u.id} style={styles.emailItem}>{u.email}</Text>
              ))}
            </View>
          )}
        </AdminCard>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background, padding: 16 },
  sectionTitle: { fontWeight: '800', color: theme.colors.text, marginBottom: 8 },
  row: { flexDirection: 'row', alignItems: 'center', backgroundColor: theme.colors.card, padding: 12, borderRadius: 12, marginBottom: 8, gap: 8 },
  name: { color: theme.colors.text, fontWeight: '700' },
  sub: { color: theme.colors.muted, fontSize: 12, marginTop: 2 },
  btn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  iconBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  btnPrimary: { backgroundColor: theme.colors.primary },
  btnDanger: { backgroundColor: theme.colors.danger },
  btnOutline: { borderWidth: 1, borderColor: theme.colors.primary, backgroundColor: 'transparent' },
  btnText: { color: '#fff', fontWeight: '700' },
  empty: { color: theme.colors.muted, fontStyle: 'italic' },
  inviteBox: { backgroundColor: theme.colors.card, padding: 12, borderRadius: 12, marginBottom: 12 },
  inviteRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { backgroundColor: theme.colors.surface, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, color: theme.colors.text, borderWidth: 1, borderColor: theme.colors.border },
  createRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  roleChip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, borderWidth: 1, borderColor: theme.colors.border },
  roleChipActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  roleChipText: { color: theme.colors.text, fontWeight: '600' },
  roleChipTextActive: { color: '#fff' },
  hint: { color: theme.colors.muted, marginTop: 8, fontSize: 12 },
  emailItem: { color: theme.colors.text },
});
