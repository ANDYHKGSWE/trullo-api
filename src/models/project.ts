import { Schema, model } from 'mongoose';

const projectSchema = new Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true,
	},
	// Lägg till andra fält efter behov
});

const Project = model('Project', projectSchema);

export default Project;
