import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import Task from '../models/task';

const router = Router();

// Skapa en ny uppgift med validering
router.post(
	'/',
	[
		body('title').notEmpty().withMessage('Title is required'),
		body('description').notEmpty().withMessage('Description is required'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const task = new Task(req.body);
			await task.save();
			res.status(201).send(task);
		} catch (error) {
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Hämta alla uppgifter
router.get('/', async (req, res) => {
	try {
		const tasks = await Task.find();
		res.status(200).send(tasks);
	} catch (error) {
		res.status(500).send({ error: 'Server error' });
	}
});

// Hämta en specifik uppgift
router.get('/:id', async (req, res) => {
	try {
		const task = await Task.findById(req.params.id);
		if (!task) {
			return res.status(404).send({ error: 'Task not found' });
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send({ error: 'Server error' });
	}
});

// Uppdatera en uppgift med validering
router.patch(
	'/:id',
	[
		body('title').optional().notEmpty().withMessage('Title cannot be empty'),
		body('description')
			.optional()
			.notEmpty()
			.withMessage('Description cannot be empty'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});
			if (!task) {
				return res.status(404).send({ error: 'Task not found' });
			}
			res.status(200).send(task);
		} catch (error) {
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Ta bort en uppgift
router.delete('/:id', async (req, res) => {
	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(404).send({ error: 'Task not found' });
		}
		res.status(200).send(task);
	} catch (error) {
		res.status(500).send({ error: 'Server error' });
	}
});

export default router;
