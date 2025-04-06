import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        return res.status(401).json({ message: "Acceso denegado. No se proporcionó token." });
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET); 
        req.user = decoded;
        next();
    } catch (error) {
        console.error("Error al verificar el token:", error.message);
        res.status(401).json({ message: "Token inválido." });
    }
};