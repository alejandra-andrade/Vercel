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

El servidor correrá en `http://localhost:5000`.

## Endpoints

- `POST /habits`: Crea un nuevo hábito.
- `GET /habits`: Obtiene todos los hábitos.
- `DELETE /habits/:id`: Elimina un hábito.
- `PATCH /habits/:id/complete`: Marca un hábito como completado en el día actual.
