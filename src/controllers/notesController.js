import createHttpError from 'http-errors';
import { Note } from '../models/note.js';

export async function getAllNotes(req, res, next) {
    try {
        const { page = 1, perPage = 10, tag, search = '' } = req.query;

        const pageNumber = Number(page);
        const perPageNumber = Number(perPage);

        const filter = {
            userId: req.user._id,
        };

        if (tag) {
            filter.tag = tag;
        }

        if (search !== '') {
            filter.$text = { $search: search };
        }

        const skip = (pageNumber - 1) * perPageNumber;

        let notesQuery = Note.find(filter);

        if (filter.$text) {
            notesQuery = notesQuery
                .select({ score: { $meta: 'textScore' } })
                .sort({ score: { $meta: 'textScore' } });
        } else {
            notesQuery = notesQuery.sort({ createdAt: -1 });
        }

        notesQuery = notesQuery.skip(skip).limit(perPageNumber);

        const [totalNotes, notes] = await Promise.all([
            Note.countDocuments(filter),
            notesQuery,
        ]);

        const totalPages = Math.ceil(totalNotes / perPageNumber) || 1;

        res.status(200).json({
            page: pageNumber,
            perPage: perPageNumber,
            totalNotes,
            totalPages,
            notes,
        });
    } catch (err) {
        next(err);
    }
}

export async function getNoteById(req, res, next) {
    try {
        const { noteId } = req.params;

        const note = await Note.findOne({ _id: noteId, userId: req.user._id });
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
        const note = await Note.create({
            ...req.body,
            userId: req.user._id,
        });

        res.status(201).json(note);
    } catch (err) {
        next(err);
    }
}

export async function updateNote(req, res, next) {
    try {
        const { noteId } = req.params;

        const updated = await Note.findOneAndUpdate(
            { _id: noteId, userId: req.user._id },
            req.body,
            { new: true, runValidators: true }
        );

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

        const deleted = await Note.findOneAndDelete({ _id: noteId, userId: req.user._id });

        if (!deleted) {
            throw createHttpError(404, 'Note not found');
        }

        res.status(200).json(deleted);
    } catch (err) {
        next(err);
    }
}
