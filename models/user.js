import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

// Middleware para encriptar la contraseña antes de guardarla
userSchema.pre('save', async function(next) {
    if (this.isModified('password') || this.isNew) {
        try {
            const salt = await bcrypt.genSalt(10); // Salting
            this.password = await bcrypt.hash(this.password, salt); // Hashing
            next();
        } catch (err) {
            next(err);
        }
    } else {
        return next();
    }
});

export default mongoose.model('User', userSchema); // Default export
