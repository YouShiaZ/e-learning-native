import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@elearning_users_map';
const SESSION_KEY = '@elearning_auth_state';

const BASE_USERS = [
  {
    id: 'user-admin',
    email: 'admin@demo.com',
    role: 'admin',
    name: 'Admin',
    avatar: '',
  },
  {
    id: 'user-teacher',
    email: 'teacher@demo.com',
    role: 'teacher',
    name: 'Teacher One',
    avatar: '',
    profile: {
      teacherId: 't1',
    },
  },
  {
    id: 'user-learner',
    email: 'user@demo.com',
    role: 'user',
    name: 'User One',
    avatar: '',
  },
];

function toMap(users = []) {
  return users.reduce((acc, user) => {
    if (!user?.email) return acc;
    const key = String(user.email).toLowerCase();
    acc[key] = {
      ...user,
      email: key,
    };
    return acc;
  }, {});
}

export async function seedUsers() {
  const map = toMap(BASE_USERS);
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(map));
  } catch {
    // ignore write failure; caller still gets map in memory
  }
  return map;
}

export async function loadUsersMap() {
  try {
    const raw = await AsyncStorage.getItem(USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed;
      }
    }
  } catch {
    // ignore parse errors and fall back to seed
  }
  return seedUsers();
}

export async function saveUsersMap(map) {
  try {
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(map || {}));
  } catch {
    // swallow storage errors
  }
}

export async function loadSession() {
  try {
    const raw = await AsyncStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && parsed.user) {
      return parsed.user;
    }
    if (parsed && typeof parsed === 'object') {
      return parsed;
    }
  } catch {
    // ignore parse errors
  }
  return null;
}

export async function saveSession(user) {
  try {
    await AsyncStorage.setItem(SESSION_KEY, JSON.stringify({ user }));
  } catch {
    // ignore persistence failure
  }
}

export async function clearSession() {
  try {
    await AsyncStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}
