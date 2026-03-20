import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
        },
        avatar: {
            type: String,
            default: 'https://ac.goit.global/fullstack/react/default-avatar.jpg',
        },
    },
    { timestamps: true }
);

// remove password in responses
userSchema.methods.toJSON = function toJSON() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// username auto = email
userSchema.pre('save', function preSave(next) {
    if (!this.username) {
        this.username = this.email;
    }
    next();
});

export const User = mongoose.model('User', userSchema);
