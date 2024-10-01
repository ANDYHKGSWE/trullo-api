import { Router, Request, Response } from 'express';
import Task from '../models/task';
import auth from '../middleware/auth';

const router = Router();

// Skapa en ny uppgift
router.post('/', auth, async (req: Request, res: Response) => {
	try {
		const task = new Task({
			...req.body,
			owner: req.user._id,
		});
		await task.save();
		res.status(201).send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

// Hämta alla uppgifter
router.get('/', auth, async (req: Request, res: Response) => {
	try {
		const tasks = await Task.find({ owner: req.user._id });
		res.send(tasks);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Hämta en specifik uppgift
router.get('/:id', auth, async (req: Request, res: Response) => {
	const _id = req.params.id;

	try {
		const task = await Task.findOne({ _id, owner: req.user._id });

		if (!task) {
			return res.status(404).send();
		}

		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

// Uppdatera en uppgift
router.patch('/:id', auth, async (req: Request, res: Response) => {
	const updates = Object.keys(req.body);
	const allowedUpdates = ['description', 'completed'];
	const isValidOperation = updates.every((update) =>
		allowedUpdates.includes(update)
	);

	if (!isValidOperation) {
		return res.status(400).send({ error: 'Invalid updates!' });
	}

	try {
		const task = await Task.findOne({
			_id: req.params.id,
			owner: req.user._id,
		});

		if (!task) {
			return res.status(404).send();
		}

		updates.forEach((update) => {
			if (update in task) {
				(task as any)[update] = req.body[update];
			}
		});
		await task.save();
		res.send(task);
	} catch (error) {
		res.status(400).send(error);
	}
});

// Ta bort en uppgift
router.delete('/:id', auth, async (req: Request, res: Response) => {
	try {
		const task = await Task.findOneAndDelete({
			_id: req.params.id,
			owner: req.user._id,
		});

		if (!task) {
			return res.status(404).send();
		}

		res.send(task);
	} catch (error) {
		res.status(500).send(error);
	}
});

export default router;
