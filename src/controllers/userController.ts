import { Request, Response } from 'express';
import { User } from '../models/user';

export const createUser = async (req: Request, res: Response) => {
	try {
		const user = new User(req.body);
		await user.save();
		res.status(201).send(user);
	} catch (error) {
		res.status(400).send(error);
	}
};

export const getUsers = async (req: Request, res: Response) => {
	try {
		const users = await User.find();
		res.status(200).send(users);
	} catch (error) {
		res.status(500).send(error);
	}
};

export const updateUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findByIdAndUpdate(req.params.id, req.body, {
			new: true,
			runValidators: true,
		});
		if (!user) {
			return res.status(404).send();
		}
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const user = await User.findByIdAndDelete(req.params.id);
		if (!user) {
			return res.status(404).send();
		}
		res.status(200).send(user);
	} catch (error) {
		res.status(500).send(error);
	}
};
