import { createSlice, createSelector } from '@reduxjs/toolkit';

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action) {
      const course = action.payload;
      if (!course?.id) return;
      const exists = state.items.some((item) => item.id === course.id);
      if (!exists) {
        state.items.push({ ...course, quantity: 1 });
      }
    },
    removeItem(state, action) {
      const courseId = action.payload;
      state.items = state.items.filter((item) => item.id !== courseId);
    },
    clear(state) {
      state.items = [];
    },
    incrementQuantity(state, action) {
      const courseId = action.payload;
      const target = state.items.find((item) => item.id === courseId);
      if (target) target.quantity = (target.quantity || 1) + 1;
    },
    decrementQuantity(state, action) {
      const courseId = action.payload;
      const target = state.items.find((item) => item.id === courseId);
      if (target) {
        const next = (target.quantity || 1) - 1;
        target.quantity = next > 0 ? next : 1;
      }
    },
  },
});

export const { addItem, removeItem, clear, incrementQuantity, decrementQuantity } = cartSlice.actions;

export const selectAll = (state) => state.cart.items;
export const selectCount = createSelector(selectAll, (items) => items.reduce((acc, item) => acc + (item.quantity || 1), 0));
export const selectTotal = createSelector(selectAll, (items) =>
  items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0)
);

export default cartSlice.reducer;
