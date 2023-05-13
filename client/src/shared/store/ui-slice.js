import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: { modalIsShown: false },
  reducers: {
    openModal(state) {
      state.modalIsShown = true;
    },
    closeModal(state) {
      state.modalIsShown = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
