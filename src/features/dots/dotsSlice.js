import {createSlice} from "@reduxjs/toolkit";
import {deleteDots, getDots, sendDots} from "./dotsActions";
import {authApi} from "../../app/services/auth/authService";

const initialState = {
    loading: false,
    dots: [],
    success: false,
}
const dotsSlice = createSlice({
    name: 'dots',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(sendDots.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addCase(sendDots.fulfilled, (state, action) => {
                    state.loading = false;
                    const newData = Array.isArray(action.payload) ? action.payload : [action.payload];
                    state.dots = [...state.dots, ...newData];
                    state.success = true;

                }
            )
            .addCase(sendDots.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
            .addCase(getDots.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addCase(getDots.fulfilled, (state, action) => {
                    state.loading = false;
                    const newData = Array.isArray(action.payload) ? action.payload : [action.payload];
                    state.dots = [...state.dots, ...newData];
                }
            )
            .addCase(getDots.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
            .addCase(deleteDots.pending, (state) => {
                    state.loading = true;
                    state.error = null;
                }
            )
            .addCase(deleteDots.fulfilled, (state) => {
                    state.loading = false;
                    state.success = true;
                    state.dots = [];
                }
            )
            .addCase(deleteDots.rejected, (state, action) => {
                    state.loading = false;
                    state.error = action.payload;
                }
            )
            .addMatcher(
                (action) =>
                    action.type.endsWith('/pending') &&
                    action.type.startsWith('dots/'),
                (state, action) => {
                    const token = localStorage.getItem('userToken');
                    if (token) {
                        action.meta.arg.headers = {
                            ...action.meta.arg.headers,
                            Authorization: `Bearer ${token}`,
                        };
                    }
                }
            )
    }
})

export default dotsSlice.reducer