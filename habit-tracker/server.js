import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json()); 

app.post('/habits', async (req, res) => {
    try {
      const habit = new Habit(req.body);
      await habit.save();
      res.status(200).json(createHabit);
      res.status(201).json(habit);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.get('/habits', async (req, res) => {
    try {
      const habits = await Habit.find();
      res.json(habits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.delete('/habits/:id', async (req, res) => {
    try {
      const habit = await Habit.findByIdAndDelete(req.params.id);
      if (!habit) {
        return res.status(404).json({ message: 'Hábito no encontrado' });
      }
      res.json({ message: 'Hábito eliminado' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.patch('/habits/:id/complete', async (req, res) => {
    try {
      const habit = await Habit.findById(req.params.id);
      if (!habit) {
        return res.status(404).json({ message: 'Hábito no encontrado' });
      }
  
      const today = new Date().setHours(0, 0, 0, 0);
      if (habit.completedDates.includes(today)) {
        return res.status(400).json({ message: 'Ya has completado este hábito hoy' });
      }
  
      habit.completedDates.push(today);
      habit.streak += 1;
      await habit.save();
      res.status(200).json(createHabit);
      res.json(habit);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', (error) => console.error('Error de conexión:', error));
db.once('open', () => console.log('Conectado a MongoDB Atlas'));

app.listen(5000, () => console.log('Servidor Express corriendo en el puerto 5000'));
