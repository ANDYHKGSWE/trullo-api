import mongoose, { Schema, Document } from "mongoose";

export interface IProject extends Document {
    name: string;
    description: string;
    tasks: mongoose.Types.ObjectId[];
}

const projectSchema: Schema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: false},
    tasks: [{type: Schema.Types.ObjectId, ref: "Task", required: false}]
})

const Project = mongoose.model<IProject>("Project", projectSchema);

export default Project;