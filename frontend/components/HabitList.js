import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchHabits } from "../store/habitsSlice";

const HabitList = () => {
    const dispatch = useDispatch();
    const { habits, status, error } = useSelector((state) => state.habits);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchHabits());
        }
    }, [dispatch, status]);

    if (status === "loading") {
        return <p>Cargando hábitos...</p>;
    }

    if (status === "failed") {
        return <p>Error al cargar hábitos: {error}</p>;
    }

    return (
        <ul>
            {habits.map((habit) => (
                <li key={habit._id}>{habit.name}</li>
            ))}
        </ul>
    );
};

export default HabitList;