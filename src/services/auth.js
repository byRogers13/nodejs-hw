import crypto from 'crypto';
import { Session } from '../models/session.js';
import { FIFTEEN_MINUTES, ONE_DAY } from '../constants/time.js';

function generateToken() {
    return crypto.randomBytes(30).toString('hex');
}

export async function createSession(userId) {
    const accessToken = generateToken();
    const refreshToken = generateToken();

    const now = Date.now();

    const session = await Session.create({
        userId,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(now + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(now + ONE_DAY),
    });

    return session;
}

export function setSessionCookies(res, session) {
    const commonOptions = {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
    };

    res.cookie('accessToken', session.accessToken, {
        ...commonOptions,
        maxAge: FIFTEEN_MINUTES,
    });

    res.cookie('refreshToken', session.refreshToken, {
        ...commonOptions,
        maxAge: ONE_DAY,
    });

    res.cookie('sessionId', session._id.toString(), {
        ...commonOptions,
        maxAge: ONE_DAY,
    });
}
