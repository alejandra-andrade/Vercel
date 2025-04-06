import { configureStore } from "@reduxjs/toolkit";
import habitReducer from "./store/habitsSlice";
// import userReducer from "./store/userSlice";

export const store = configureStore({
    reducer: {
        habits: habitReducer,
        // users: userReducer,
    },
});
