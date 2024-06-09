import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    username: '',
    avatar: '',
};

export const activateSlice = createSlice({
    name: 'activate',
    initialState,
    reducers: {
        setUsername: (state, action) => {
            state.username = action.payload;
        },
        setAvatar: (state, action) => {
            state.avatar = action.payload;
        },
    },
});

export const { setUsername, setAvatar } = activateSlice.actions;

export default activateSlice.reducer;
