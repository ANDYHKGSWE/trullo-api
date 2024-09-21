import { Request, Response } from 'express';
import { Task } from '../models/task';

export const createTask = async (req: Request, res: Response) => {
	try {
		const task = new Task(req.body);
		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
};

export const getTasks = async (req: Request, res: Response) => {
	try {
		const tasks = await Task.find().populate('assignedTo');
		res.status(200).send(tasks);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const updateTask = async (req: Request, res: Response) => {
	try {
		const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
};

export const deleteTask = async (req: Request, res: Response) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(404).send();
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send(error);
	}
};
