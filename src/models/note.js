import mongoose from 'mongoose';
import { TAGS } from '../constants/tags.js';


const TAGS = [
    'Work',
    'Personal',
    'Meeting',
    'Shopping',
    'Ideas',
    'Travel',
    'Finance',
    'Health',
    'Important',
    'Todo',
];

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        content: {
            type: String,
            default: '',
            trim: true,
        },
        tag: {
            type: String,
            enum: TAGS,
            default: 'Todo',
        },
    },
    { timestamps: true }
);

noteSchema.index({ title: 'text', content: 'text' });

export const Note = mongoose.model('Note', noteSchema);
