import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';

import { User } from '../models/user.js';
import { Session } from '../models/session.js';
import { createSession, setSessionCookies } from '../services/auth.js';
import { ONE_DAY, FIFTEEN_MINUTES } from '../constants/time.js';

const cookieClearOptions = {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
};

export async function registerUser(req, res, next) {
    try {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing) {
            throw createHttpError(400, 'Email in use');
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            email,
            password: hashedPassword,
        });

        const session = await createSession(user._id);
        setSessionCookies(res, session);

        res.status(201).json(user);
    } catch (err) {
        next(err);
    }
}

export async function loginUser(req, res, next) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            throw createHttpError(401, 'Invalid credentials');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw createHttpError(401, 'Invalid credentials');
        }

        // видалити старі сесії користувача
        await Session.deleteMany({ userId: user._id });

        const session = await createSession(user._id);
        setSessionCookies(res, session);

        res.status(200).json(user);
    } catch (err) {
        next(err);
    }
}

export async function refreshUserSession(req, res, next) {
    try {
        const { sessionId, refreshToken } = req.cookies;

        const session = await Session.findOne({ _id: sessionId, refreshToken });
        if (!session) {
            throw createHttpError(401, 'Session not found');
        }

        if (session.refreshTokenValidUntil.getTime() < Date.now()) {
            throw createHttpError(401, 'Session token expired');
        }

        await Session.deleteOne({ _id: session._id });

        const newSession = await createSession(session.userId);
        setSessionCookies(res, newSession);

        res.status(200).json({ message: 'Session refreshed' });
    } catch (err) {
        next(err);
    }
}

export async function logoutUser(req, res, next) {
    try {
        const { sessionId } = req.cookies;

        if (sessionId) {
            await Session.deleteOne({ _id: sessionId });
        }

        res.clearCookie('sessionId', cookieClearOptions);
        res.clearCookie('accessToken', cookieClearOptions);
        res.clearCookie('refreshToken', cookieClearOptions);

        res.sendStatus(204);
    } catch (err) {
        next(err);
    }
}
