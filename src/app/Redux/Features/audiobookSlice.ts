import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AudiobookState {
  bookId: number | null;
  chapterId: number | null;
}

const initialState: AudiobookState = {
  bookId: null,
  chapterId: null,
};

const audiobookSlice = createSlice({
  name: 'audiobook',
  initialState,
  reducers: {
    setBookId(state, action: PayloadAction<number>) {
      state.bookId = action.payload;
    },
    setChapterId(state, action: PayloadAction<number>) {
      state.chapterId = action.payload;
    },
  },
});

export const { setBookId, setChapterId } = audiobookSlice.actions;
export default audiobookSlice.reducer;