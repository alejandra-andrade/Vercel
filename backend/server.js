import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import routes from './routes.js';
import { protect } from "./middleware/authMiddleware.js";
import Habit from "./models/habits.js";
dotenv.config();

const app = express();

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on('error', (error) => console.error('Error de conexión:', error));
db.once('open', () => console.log('Conectado a MongoDB Atlas'));

app.use(cors());
app.use(express.json());
app.use('/',routes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando.');
});

app.get("/habits/:userId", protect, async (req, res) => {
  try {
      const { userId } = req.params; 
      console.log("User ID recibido:", userId);

      if (req.user.id !== userId) {
          return res.status(403).json({ message: "No tienes permiso para acceder a estos hábitos." });
      }

      const habits = await Habit.find({ userId });
      res.json(habits); 
  } catch (error) {
      console.error("Error al obtener los hábitos:", error.message);
      res.status(500).json({ message: "Error al obtener los hábitos" });
  }
});

app.patch("/habits/:habitId/mark-as-done", protect, async (req, res) => {
  const { habitId } = req.params;
  console.log("Habit ID recibido:", habitId);

  try {
      const habit = await Habit.findById(habitId);
      if (!habit) {
          console.log("Hábito no encontrado");
          return res.status(404).json({ message: "Hábito no encontrado" });
      }

      habit.streakDays += 1;
      habit.progress = Math.min((habit.streakDays / habit.goalDays) * 100, 100);

      const updatedHabit = await habit.save();
      console.log("Hábito actualizado:", updatedHabit);
      res.status(200).json(updatedHabit);
  } catch (error) {
      console.error("Error en el servidor:", error);
      res.status(500).json({ message: "Error al actualizar el hábito", error });
  }
});

app.patch("/habits/:habitId/reset-streak", protect, async (req, res) => {
    const { habitId } = req.params;

    try {
        const habit = await Habit.findById(habitId);
        if (!habit) {
            return res.status(404).json({ message: "Hábito no encontrado" });
        }

        habit.streakDays = 0;
        habit.progress = 0;

        const updatedHabit = await habit.save(); 
        res.status(200).json(updatedHabit); 
    } catch (error) {
        console.error("Error al reiniciar la racha:", error.message);
        res.status(500).json({ message: "Error al reiniciar la racha", error });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor Express corriendo en el puerto ${PORT}`));
