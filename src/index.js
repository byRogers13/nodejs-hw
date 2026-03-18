const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pinoHttp = require('pino-http');

// 1) Підвантажуємо змінні оточення з .env
dotenv.config();

// 2) PORT: або з env, або 3000
const PORT = Number(process.env.PORT) || 3000;

const app = express();

// 3) Middleware: логер HTTP-запитів (pino-http)
app.use(
    pinoHttp({
    })
);

// 4) Middleware: cors + express.json()
app.use(cors());
app.use(express.json());

// 5) Маршрути

// GET /notes -> всі нотатки
app.get('/notes', (req, res) => {
    res.status(200).json({
        message: 'Retrieved all notes',
    });
});

// GET /notes/:noteId -> нотатка за id
app.get('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;

    res.status(200).json({
        message: `Retrieved note with ID: ${noteId}`,
    });
});

// GET /test-error -> імітація помилки
app.get('/test-error', () => {
    throw new Error('Simulated server error');
});

// 6) Middleware для 404 (після всіх маршрутів!)
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

// 7) Middleware для помилок 500 (має 4 аргументи!)
app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(500).json({
        message: err.message || 'Internal Server Error',
    });
});

// 8) Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
