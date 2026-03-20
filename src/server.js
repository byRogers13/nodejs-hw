import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errors } from 'celebrate';

import { connectMongoDB } from './db/connectMongoDB.js';
import notesRouter from './routes/notesRoutes.js';

import { logger } from './middleware/logger.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(logger);
app.use(express.json());
app.use(cors());

app.use(notesRouter);

app.use(notFoundHandler);

// celebrate validation errors handler
app.use(errors());

app.use(errorHandler);

async function startServer() {
    await connectMongoDB();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();
