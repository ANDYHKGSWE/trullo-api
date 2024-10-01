import { Request, Response } from 'express';
import { User } from '../models/user';

export const createUser = async (req: Request, res: Response) => {
	try {
		const { name, email, password, role } = req.body;
		const user = new User({ name, email, password, role });
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
		const { id } = req.params;
		const { name, email, password, role } = req.body;
		const user = await User.findByIdAndUpdate(
			id,
			{ name, email, password, role },
			{ new: true }
		);
		if (!user) {
			return res.status(404).send('User not found');
		}
		res.status(200).send(user);
	} catch (error) {
		res.status(400).send(error);
	}
};

export const deleteUser = async (req: Request, res: Response) => {
	try {
		const { id } = req.params;
		const user = await User.findByIdAndDelete(id);
		if (!user) {
			return res.status(404).send('User not found');
		}
		res.status(200).send('User deleted');
	} catch (error) {
		res.status(500).send(error);
	}
};
