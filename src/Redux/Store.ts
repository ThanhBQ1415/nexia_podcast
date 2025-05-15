import { configureStore } from '@reduxjs/toolkit';
import audiobookReducer from './Features/audiobookSlice';
import searchReducer from './Features/searchSlice';
export const store = configureStore({
  reducer: {
    audiobook: audiobookReducer,
    search: searchReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
