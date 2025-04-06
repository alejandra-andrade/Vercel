import React, { useState } from "react";
import { Provider } from "react-redux";
import { store } from "../store";
import "../styles/globals.css";

export default function Home() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userToken, setUserToken] = useState("");
    const [habits, setHabits] = useState([]);
    const [activeForm, setActiveForm] = useState("login");


    const handleRegister = (name, email, password) => {
        fetch("http://localhost:5000/User/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ name, email, password }),
        })
            .then((res) => {
                if (res.status === 201) {
                    return res.json(); 
                } else {
                    throw new Error("No se pudo registrar el usuario");
                }
            })
            .then((data) => {
                console.log("Usuario registrado: ", data.message);
                setActiveForm("login"); 
                alert("Registro exitoso. Por favor, inicie sesión con sus credenciales."); 
            })
            .catch((error) => console.error("Error al registrarse:", error.message));
    };

    const handleLogin = (email, password) => {
        fetch("http://localhost:5000/User/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({ email, password }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.token && data.userId) {
                    setUserToken(data.token);
                    setIsAuthenticated(true);
    
                    fetch(`http://localhost:5000/habits/${data.userId}`, {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${data.token}`,
                        },
                    })
                        .then((res) => res.json())
                        .then((habits) => setHabits(habits))
                        .catch((error) => console.error("Error al cargar los hábitos:", error));
                } else {
                    console.error("Error al iniciar sesión:", data.message);
                }
            })
            .catch((error) => console.error("Error al iniciar sesión:", error));
    };

    const handleAddHabit = (habitName, goalDays) => {
        fetch("http://localhost:5000/habits", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
            body: JSON.stringify({ name: habitName, goalDays, streakDays: 0 }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al agregar el hábito.");
                }
                return res.json();
            })
            .then((newHabit) => setHabits((prev) => (Array.isArray(prev) ? [...prev, newHabit] : [newHabit])))
            .catch((error) => console.error("Error al agregar hábito:", error));
    };

    const handleMarkAsDone = (habitId) => {
        console.log("Habit ID:", habitId);
        fetch(`http://localhost:5000/habits/${habitId}/mark-as-done`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al actualizar el hábito en el servidor");
                }
                return res.json();
            })
            .then((updatedHabit) => {
                setHabits((prev) =>
                    prev.map((habit) =>
                        habit._id === habitId ? updatedHabit : habit
                    )
                );
            })
            .catch((error) => console.error("Error al marcar el hábito como completado:", error));
    };

    const handleResetStreak = (habitId) => {
        fetch(`http://localhost:5000/habits/${habitId}/reset-streak`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${userToken}`,
            },
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Error al reiniciar la racha en el servidor");
                }
                return res.json();
            })
            .then((updatedHabit) => {
                setHabits((prev) =>
                    prev.map((habit) =>
                        habit._id === habitId ? updatedHabit : habit
                    )
                );
            })
            .catch((error) =>
                console.error("Error al reiniciar la racha:", error)
            );
    };

    const handleLogout = () => {
        setUserToken("");
        setIsAuthenticated(false);
        setHabits([]);
    };

    return (
        <Provider store={store}>
            <div className="min-h-screen bg-black-100 p-10">
                {!isAuthenticated ? (
                    <div className="max-w-lg mx-auto bg-black shadow-md rounded-lg p-5">
                        {activeForm === "register" && (
                            <div className="bg-black p-4 rounded shadow">
                                <h2 className="text-xl font-bold mb-4">Regístrate</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const name = e.target.name.value;
                                        const email = e.target.email.value;
                                        const password = e.target.password.value;
                                        handleRegister(name, email, password);
                                    }}
                                >
                                    <input
                                        type="text"
                                        name="name"
                                        placeholder="Nombre"
                                        className="w-full mb-2 p-2 border rounded"
                                    />
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Correo Electrónico"
                                        className="w-full mb-2 p-2 border rounded"
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        className="w-full mb-2 p-2 border rounded"
                                    />
                                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                        Registrarse
                                    </button>
                                </form>
                                <button onClick={() => setActiveForm("login")} className="mt-4 text-blue-500">
                                    Ya tengo una cuenta
                                </button>
                            </div>
                        )}
                        {activeForm === "login" && (
                            <div className="bg-black p-4 rounded shadow">
                                <h2 className="text-xl font-bold mb-4">Iniciar Sesión</h2>
                                <form
                                    onSubmit={(e) => {
                                        e.preventDefault();
                                        const email = e.target.email.value;
                                        const password = e.target.password.value;
                                        handleLogin(email, password);
                                    }}
                                >
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Correo Electrónico"
                                        className="w-full mb-2 p-2 border rounded"
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Contraseña"
                                        className="w-full mb-2 p-2 border rounded"
                                    />
                                    <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                        Iniciar Sesión
                                    </button>
                                </form>
                                <button onClick={() => setActiveForm("register")} className="mt-4 text-blue-500">
                                    Crear una cuenta
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="max-w-lg mx-auto bg-black shadow-md rounded-lg p-5">
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                            Cerrar Sesión
                        </button>
                        <div className="mt-4">
                            <p></p>
                            <button
                                onClick={() => {
                                    const habitName = prompt("Nombre del hábito:");
                                    const goalDays = parseInt(prompt("¿Cuántos días son tu meta?"), 10);
                                    if (habitName && goalDays) handleAddHabit(habitName, goalDays);
                                }}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                            >
                                Agregar nuevo hábito
                            </button>
                        </div>
                        {habits.length > 0 && (
                            <ul className="mt-4">
                                {habits.map((habit) => (
                                    <li key={habit._id} className="p-4 border-b">
                                        <div className="flex justify-between items-center mb-2">
                                            <span>{habit.name}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleMarkAsDone(habit._id)}
                                                    disabled={habit.streakDays >= habit.goalDays}
                                                    className={`px-3 py-1 rounded ${habit.streakDays >= habit.goalDays
                                                            ? "bg-gray-400 cursor-not-allowed"
                                                            : "bg-green-500 text-white hover:bg-green-600"
                                                        }`}
                                                >
                                                    Done
                                                </button>
                                                <button
                                                    onClick={() => handleResetStreak(habit._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Reset
                                                </button>
                                            </div>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-4 relative">
                                            <div
                                                className="bg-blue-500 h-4 rounded-full"
                                                style={{ width: `${habit.progress || 0}%` }}
                                            />
                                            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 text-sm font-bold text-black">
                                                {Math.round(habit.progress || 0)}%
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Progreso: ({habit.streakDays}/{habit.goalDays} días)
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </Provider>
    );
}