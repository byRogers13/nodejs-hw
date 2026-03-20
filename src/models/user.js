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
    },
    { timestamps: true }
);

// Видаляти password перед відправкою у JSON
userSchema.methods.toJSON = function toJSON() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// username за замовчуванням = email
userSchema.pre('save', function preSave(next) {
    if (!this.username) {
        this.username = this.email;
    }
    next();
});

export const User = mongoose.model('User', userSchema);
