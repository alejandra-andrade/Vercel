# Habit Tracker App

Este proyecto es una aplicación web para ayudar a las personas a crear y gestionar sus hábitos. Está construido con **Next.js** para el frontend, **Express.js** para el backend y **MongoDB** para la base de datos.

## Requisitos previos

- Node.js
- MongoDB Atlas (asegurarse de tener la URL de conexión)

## Instalación

1. Clona el repositorio:

    ```bash
    git clone <repositorio>
    cd habit-tracker
    ```

2. Instala las dependencias:

    ```bash
    npm install
    ```

3. Crea un archivo `.env` con la siguiente configuración:

    ```plaintext
    DATABASE_URL=mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/habit-tracker?retryWrites=true&w=majority
    ```

4. Inicia el servidor:

    ```bash
    node server.js
    ```
5. Iniciar backend
   ```bash
   cd backend
    npm start
    ```
6. Iniciar frontend
   ```bash
   cd frontend
    npm run dev
    ```

El servidor correrá en `http://localhost:5000`.
