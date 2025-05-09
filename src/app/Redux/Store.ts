import { configureStore } from '@reduxjs/toolkit';
import audiobookReducer from './Features/audiobookSlice';

export const store = configureStore({
  reducer: {
    audiobook: audiobookReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
