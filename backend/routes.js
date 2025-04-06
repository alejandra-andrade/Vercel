import express from "express";
import userRoutes from "./routes/userRoutes.js";
import habitRoutes from "./routes/habitRoutes.js";

const router = express.Router(); 
router.use('/User', userRoutes);
router.use('/habits', habitRoutes);

export default router;