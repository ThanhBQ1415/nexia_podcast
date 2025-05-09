import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AudiobookState {
  bookId: number | null;
}

const initialState: AudiobookState = {
  bookId: null,
};

const audiobookSlice = createSlice({
  name: 'audiobook',
  initialState,
  reducers: {
    setBookId: (state, action: PayloadAction<number>) => {
      state.bookId = action.payload;
    },
    clearBookId: (state) => {
      state.bookId = null;
    },
  },
});

export const { setBookId, clearBookId } = audiobookSlice.actions;
export default audiobookSlice.reducer;