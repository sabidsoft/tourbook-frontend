import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InitialState } from "./types";

const initialState: InitialState = {
    token: null,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        userLoggedIn: (state, action: PayloadAction<InitialState>) => {
            state.token = action.payload.token;
            state.user = action.payload.user;
        },

        userLoggedOut: (state) => {
            state.token = null;
            state.user = null;
        }
    }
});

export const { userLoggedIn, userLoggedOut } = authSlice.actions;
export default authSlice.reducer;