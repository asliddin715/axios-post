import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  posts: [],
  status: 'idle',
  error: null,
};

// Async thunk to fetch posts from the server
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await axios.get('https://axios-server-3uu8.onrender.com/posts');
  return response.data;
});

// Async thunk to add a new post
export const addNewPost = createAsyncThunk('posts/addNewPost', async (newPost) => {
  const response = await axios.post('https://axios-server-3uu8.onrender.com/posts', newPost);
  return response.data;
});

// Async thunk to delete a post
export const deleteExistingPost = createAsyncThunk('posts/deleteExistingPost', async (postId) => {
  await axios.delete(`https://axios-server-3uu8.onrender.com/posts/${postId}`);
  return postId;
});

// Async thunk to edit a post
export const editPost = createAsyncThunk('posts/editPost', async ({ id, updatedPost }) => {
  const response = await axios.put(`https://axios-server-3uu8.onrender.com/posts/${id}`, updatedPost);
  return response.data;
});

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      .addCase(addNewPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
      })
      .addCase(deleteExistingPost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post.id !== action.payload);
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const { id, title, body, datetime } = action.payload;
        const existingPost = state.posts.find((post) => post.id === id);
        if (existingPost) {
          existingPost.title = title;
          existingPost.body = body;
          existingPost.datetime = datetime;
        }
      });
  },
});

export default postsSlice.reducer;
