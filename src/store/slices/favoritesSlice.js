import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addItem(state, action) {
      const course = action.payload;
      if (!course?.id) return;
      const exists = state.items.some((item) => item.id === course.id);
      if (!exists) {
        state.items.push(course);
      }
    },
    removeItem(state, action) {
      const courseId = action.payload;
      if (!courseId) return;
      state.items = state.items.filter((item) => item.id !== courseId);
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, clear } = favoritesSlice.actions;

export const selectAll = (state) => state.favorites.items;
export const selectIds = createSelector(selectAll, (items) => items.map((item) => item.id));
export const makeSelectById = (courseId) =>
  createSelector(selectAll, (items) => items.find((item) => item.id === courseId));

export default favoritesSlice.reducer;
