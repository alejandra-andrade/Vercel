import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "./habitsSlice";
import userReducer from "./userSlice";

export const store = configureStore({
    reducer: {
        habits: habitReducer,
    },

    user: userReducer,
});
