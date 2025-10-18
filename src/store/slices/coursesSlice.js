import AsyncStorage from '@react-native-async-storage/async-storage';
import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';
import { courses as seedCourses } from '../../mock/data';

const STORAGE_KEY = '@elearning_courses';

const normalizeCourses = (list = []) => {
  const byId = {};
  const allIds = [];
  list.forEach((course) => {
    if (!course) return;
    const id = course.id || nanoid();
    const normalized = { ...course, id };
    byId[id] = normalized;
    allIds.push(id);
  });
  return { byId, allIds };
};

const serializeCourses = (state) => state.allIds.map((id) => state.byId[id]);

export const loadCourses = createAsyncThunk('courses/load', async () => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore parse errors and fall back to seed data
  }
  return seedCourses;
});

export const addCourse = createAsyncThunk('courses/addCourse', async (course, { getState }) => {
  const id = course?.id || nanoid();
  const nextCourse = { ...course, id };
  const state = getState().courses;
  const existing = serializeCourses(state);
  const next = [...existing, nextCourse];
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return nextCourse;
});

export const updateCourse = createAsyncThunk('courses/updateCourse', async (course, { getState }) => {
  const state = getState().courses;
  const existing = serializeCourses(state);
  const next = existing.map((item) => {
    if (item.id === course.id) {
      return { ...item, ...course };
    }
    return item;
  });
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  const current = state.byId[course.id] || {};
  return { ...current, ...course };
});

export const deleteCourse = createAsyncThunk('courses/deleteCourse', async (courseId, { getState }) => {
  const state = getState().courses;
  const existing = serializeCourses(state);
  const next = existing.filter((item) => item.id !== courseId);
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return courseId;
});

const initialState = {
  byId: {},
  allIds: [],
  status: 'idle',
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loadCourses.fulfilled, (state, action) => {
        const normalized = normalizeCourses(action.payload || []);
        state.byId = normalized.byId;
        state.allIds = normalized.allIds;
        state.status = 'succeeded';
      })
      .addCase(loadCourses.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        const course = action.payload;
        state.byId[course.id] = { ...state.byId[course.id], ...course };
        if (!state.allIds.includes(course.id)) {
          state.allIds.push(course.id);
        }
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const course = action.payload;
        if (!course?.id) return;
        if (!state.byId[course.id]) return;
        state.byId[course.id] = { ...state.byId[course.id], ...course };
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        const id = action.payload;
        if (!id) return;
        delete state.byId[id];
        state.allIds = state.allIds.filter((courseId) => courseId !== id);
      });
  },
});

export const selectCoursesState = (state) => state.courses;
export const selectAllCourses = (state) =>
  state.courses.allIds.map((id) => state.courses.byId[id]).filter(Boolean);
export const selectCourseById = (state, id) => state.courses.byId[id];
export const selectCoursesByTeacher = (state, teacherId) =>
  selectAllCourses(state).filter((course) => course?.teacherId === teacherId);

export default coursesSlice.reducer;
