import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String },
	status: {
		type: String,
		enum: ['to-do', 'in progress', 'blocked', 'done'],
		default: 'to-do',
	},
	assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
	createdAt: { type: Date, default: Date.now },
	finishedBy: { type: Date },
});

export const Task = model('Task', taskSchema);
