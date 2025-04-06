import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchHabits = createAsyncThunk(
    "habits/fetchHabits",
    async (_, { getState }) => {
        const token = getState().auth.token; 
        const response = await fetch("http://localhost:5000/habits", {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`, 
            },
        });
        if (!response.ok) {
            throw new Error("Error al obtener hábitos");
        }
        return response.json(); 
    }
);

export const addHabit = createAsyncThunk(
    "habits/addHabit",
    async (habitData, { getState }) => {
        const token = getState().auth.token; 
        const response = await fetch("http://localhost:5000/habits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, 
            },
            body: JSON.stringify(habitData),
        });
        if (!response.ok) {
            throw new Error("Error al agregar hábito");
        }
        return response.json(); 
    }
);

const habitsSlice = createSlice({
    name: "habits",
    initialState: {
        habits: [], 
        status: "idle", 
        error: null, 
    },
    reducers: {
        markHabitAsDone(state, action) {
            const habitIndex = state.habits.findIndex((h) => h._id === action.payload);
            if (habitIndex !== -1) {
                state.habits[habitIndex].streakDays += 1;
                const habit = state.habits[habitIndex];
                habit.progress = Math.min(
                    ((habit.streakDays + 1) / habit.goalDays) * 100,
                    100
                );
            }
        },
        resetStreak(state, action) {
            const habitIndex = state.habits.findIndex((h) => h._id === action.payload);
            if (habitIndex !== -1) {
                state.habits[habitIndex].streakDays = 0;
                state.habits[habitIndex].progress = 0; 
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchHabits.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchHabits.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.habits = action.payload; 
            })
            .addCase(fetchHabits.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            });
        builder.addCase(addHabit.fulfilled, (state, action) => {
            state.habits.push(action.payload); 
        });
    },
});

export const { markHabitAsDone, resetStreak } = habitsSlice.actions;

export default habitsSlice.reducer;