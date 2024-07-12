import { configureStore } from '@reduxjs/toolkit';
import postsReducer from './slices/postsSlice'; // Ensure this path is correct based on your project structure

const store = configureStore({
  reducer: {
    posts: postsReducer,
  },
});

export default store;
