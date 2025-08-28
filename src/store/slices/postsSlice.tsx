// store/slices/postsSlice.tsx
import { createSlice } from "@reduxjs/toolkit";
import type {PayloadAction} from "@reduxjs/toolkit";
import type { PostDBFormat } from "../../types/db";

interface PostsState {
  posts: PostDBFormat[];
  loading: boolean;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostDBFormat[]>) => {
      state.posts = action.payload;
    },
    addPost: (state, action: PayloadAction<PostDBFormat>) => {
      state.posts.unshift(action.payload);  //aggiunge new post in cima
    },
    updatePost: (state, action: PayloadAction<PostDBFormat>) => {
      const index = state.posts.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.posts[index] = action.payload;
    },
    removePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(p => p.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
});

export const { setPosts, addPost, updatePost, removePost, setLoading } = postsSlice.actions;
export default postsSlice.reducer;
