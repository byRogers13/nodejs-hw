import mongoose from 'mongoose';

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

export const Note = mongoose.model('Note', noteSchema);
