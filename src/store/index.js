import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import React from 'react';

// Import all slices
import coursesReducer from './slices/coursesSlice';
import wishlistReducer from './slices/wishlistSlice';
import favoritesReducer from './slices/favoritesSlice';
import cartReducer from './slices/cartSlice';
import userReducer from './userSlice';
import uiReducer from './uiSlice';

// Create Redux store
const store = configureStore({
    reducer: {
        courses: coursesReducer,
        wishlist: wishlistReducer,
        favorites: favoritesReducer,
        cart: cartReducer,
        user: userReducer,
        ui: uiReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware(),
});

// HOC to wrap App with Redux Provider
export function withStore(Component) {
    return function StoreWrapper(props) {
        return (
            <Provider store={store}>
                <Component {...props} />
            </Provider>
        );
    };
}

export default store;
