import Habit from '../models/habits.js';

export const createHabit = async (req, res) => {
    try {
        const habit = new Habit({ ...req.body, userId: req.user.id });
        
        await habit.save();
        
        return res.status(201).json(habit); 
    } catch (error) {
        console.error("Error al crear hábito:", error.message);
        return res.status(400).json({ message: error.message }); 
    }
};

export const getHabits = async (req, res) => {
  try {
      if (!req.user || !req.user.id) {
          return res.status(401).json({ message: "Usuario no autenticado" });
      }

      const habits = await Habit.find({ userId: req.user.id });
      res.json(habits);
  } catch (error) {
      console.error("Error al obtener hábitos:", error.message);
      res.status(500).json("<!DOCTYPE html><html><body><h1>Error interno del servidor</h1></body></html>");
  }
};

export const completeHabit = async (req, res) => {
  try {
      const habit = await Habit.findOne({ _id: req.params.id, userId: req.user.id }); 
      if (!habit) {
          return res.status(404).json({ message: "Hábito no encontrado" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const isCompletedToday = habit.completedDates.some(
          (date) => new Date(date).getTime() === today.getTime()
      );

      if (isCompletedToday) {
          return res.status(400).json({ message: "Ya has completado este hábito hoy" });
      }

      habit.completedDates.push(today);
      habit.streakDays += 1;
      await habit.save();
      res.status(200).json();
      res.json(habit);
  } catch (error) {
      console.error("Error al completar hábito:", error.message);
      res.status(500).json({ message: error.message });
  }
};

export const deleteHabit = async (req, res) => {
  try {
      const habit = await Habit.findOneAndDelete({ _id: req.params.id, userId: req.user.id }); 
      if (!habit) {
          return res.status(404).json({ message: "Hábito no encontrado o no pertenece al usuario" });
      }
      res.json({ message: "Hábito eliminado" });
  } catch (error) {
      console.error("Error al eliminar hábito:", error.message);
      res.status(500).json({ error: error.message });
  }
};
