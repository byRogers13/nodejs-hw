import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res, next) {
    try {
        const notes = await Note.find().sort({ createdAt: -1 });
        res.status(200).json(notes);
    } catch (err) {
        next(err);
    }
}

export async function getNoteById(req, res, next) {
    try {
        const { noteId } = req.params;

        const note = await Note.findById(noteId);

        if (!note) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(note);
    } catch (err) {
        next(err);
    }
}

export async function createNote(req, res, next) {
    try {
        const note = await Note.create(req.body);
        res.status(201).json(note);
    } catch (err) {
        next(err);
    }
}

export async function updateNote(req, res, next) {
    try {
        const { noteId } = req.params;

        const updated = await Note.findByIdAndUpdate(noteId, req.body, {
            new: true,
            runValidators: true,
        });

        if (!updated) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(updated);
    } catch (err) {
        next(err);
    }
}

export async function deleteNote(req, res, next) {
    try {
        const { noteId } = req.params;

        const deleted = await Note.findByIdAndDelete(noteId);

        if (!deleted) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
}
