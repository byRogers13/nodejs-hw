import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pinoHttp from 'pino-http';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const app = express();

// pino-http logger (з pino-pretty для локальної розробки)
const logger = pinoHttp({
    transport:
        process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: { colorize: true },
            }
            : undefined,
});

app.use(logger);

app.use(cors());
app.use(express.json());

app.get('/notes', (req, res) => {
    res.status(200).json({
        message: 'Retrieved all notes',
    });
});

app.get('/notes/:noteId', (req, res) => {
    const { noteId } = req.params;

    res.status(200).json({
        message: `Retrieved note with ID: ${noteId}`,
    });
});

app.get('/test-error', () => {
    throw new Error('Simulated server error');
});

app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
    });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
    res.status(500).json({
        message: err.message,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
