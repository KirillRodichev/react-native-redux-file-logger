import { createSlice } from '@reduxjs/toolkit';

/* eslint-disable no-param-reassign */
export const counterSlice = createSlice({
    name: 'counter',
    initialState: {
        value: 0,
    },
    reducers: {
        increment: (state) => {
            state.value += 1;
        },
        decrement: (state) => {
            state.value -= 1;
        },
    },
});
/* eslint-enable no-param-reassign */

export const { increment, decrement } = counterSlice.actions;

export default counterSlice.reducer;
