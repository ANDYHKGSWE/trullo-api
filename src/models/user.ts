import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
	name: string;
	email: string;
	password: string;
	role: string;
	resetPasswordToken?: string;
	resetPasswordExpires?: number;
	comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
	name: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, enum: ['user', 'admin'], default: 'user' },
	resetPasswordToken: { type: String },
	resetPasswordExpires: { type: Number },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}
	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
	next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (
	candidatePassword: string
) {
	return bcrypt.compare(candidatePassword, this.password);
};

export const User = model<IUser>('User', userSchema);
