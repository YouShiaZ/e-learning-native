import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { instructors as seedTeachers } from '../../mock/data';

const STORAGE_KEY = '@elearning_teachers';

const normalizeTeachers = (list = []) => {
  const byId = {};
  const allIds = [];
  list.forEach((teacher) => {
    if (!teacher) return;
    const id = teacher.id || nanoid();
    const normalized = {
      ...teacher,
      id,
    };
    if (!normalized.email && normalized.id === 't1') {
      normalized.email = 'teacher@demo.com';
    }
    if (!normalized.userId && normalized.email === 'teacher@demo.com') {
      normalized.userId = 'user-teacher';
    }
    byId[id] = normalized;
    allIds.push(id);
  });
  return { byId, allIds };
};

const serializeTeachers = (state) => state.allIds.map((id) => state.byId[id]);

export const loadTeachers = createAsyncThunk('teachers/load', async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore parse errors and fall back to seeds
  }
  return seedTeachers;
});

export const addTeacher = createAsyncThunk('teachers/addTeacher', async (teacher, { getState }) => {
  const id = teacher?.id || nanoid();
  const nextTeacher = { ...teacher, id };
  const state = getState().teachers;
  const current = serializeTeachers(state);
  const updated = [...current, nextTeacher];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return nextTeacher;
});

export const updateTeacher = createAsyncThunk('teachers/updateTeacher', async (teacher, { getState }) => {
  const state = getState().teachers;
  const current = serializeTeachers(state);
  const updated = current.map((item) => (item.id === teacher.id ? { ...item, ...teacher } : item));
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  const existing = state.byId[teacher.id] || {};
  return { ...existing, ...teacher };
});

export const deleteTeacher = createAsyncThunk('teachers/deleteTeacher', async (teacherId, { getState }) => {
  const state = getState().teachers;
  const current = serializeTeachers(state);
  const updated = current.filter((item) => item.id !== teacherId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return teacherId;
});

const initialState = {
  byId: {},
  allIds: [],
  status: 'idle',
};

const teachersSlice = createSlice({
  name: 'teachers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadTeachers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadTeachers.fulfilled, (state, action) => {
        const normalized = normalizeTeachers(action.payload || []);
        state.byId = normalized.byId;
        state.allIds = normalized.allIds;
        state.status = 'succeeded';
      })
      .addCase(loadTeachers.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(addTeacher.fulfilled, (state, action) => {
        const teacher = action.payload;
        state.byId[teacher.id] = teacher;
        if (!state.allIds.includes(teacher.id)) {
          state.allIds.push(teacher.id);
        }
      })
      .addCase(updateTeacher.fulfilled, (state, action) => {
        const teacher = action.payload;
        if (!teacher?.id) return;
        if (!state.byId[teacher.id]) return;
        state.byId[teacher.id] = teacher;
      })
      .addCase(deleteTeacher.fulfilled, (state, action) => {
        const id = action.payload;
        delete state.byId[id];
        state.allIds = state.allIds.filter((teacherId) => teacherId !== id);
      });
  },
});

export const selectTeachersState = (state) => state.teachers;
export const selectAllTeachers = (state) =>
  state.teachers.allIds.map((id) => state.teachers.byId[id]).filter(Boolean);
export const selectTeacherById = (state, id) => state.teachers.byId[id];

export default teachersSlice.reducer;
