import nodemailer from 'nodemailer';

export async function sendEmail(options) {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    const port = Number(SMTP_PORT);

    const transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port,
        secure: port === 465,
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASSWORD,
        },
    });

    return transporter.sendMail(options);
}
