import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import {
	createTask,
	getTasks,
	updateTask,
	deleteTask,
} from '../controllers/taskController';
import auth from '../middleware/auth';

const router = Router();

// Utöka Request-typen för att inkludera user
interface AuthenticatedRequest extends Request {
	user?: any;
}

router.post(
	'/',
	auth,
	[
		body('title').notEmpty().withMessage('Title is required'),
		body('description').notEmpty().withMessage('Description is required'),
	],
	async (req: AuthenticatedRequest, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			req.body.owner = req.user._id;
			const task = new Task(req.body);
			await task.save();
			res.status(201).send(task);
		} catch (error) {
			res.status(400).send(error);
		}
	}
);

router.get('/', auth, async (req: AuthenticatedRequest, res: Response) => {
	try {
		const tasks = await Task.find({ owner: req.user._id });
		res.status(200).send(tasks);
	} catch (error) {
		res.status(500).send(error);
	}
});

router.patch(
	'/:id',
	auth,
	[
		body('title').optional().notEmpty().withMessage('Title is required'),
		body('description')
			.optional()
			.notEmpty()
			.withMessage('Description is required'),
	],
	async (req: AuthenticatedRequest, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const task = await Task.findOneAndUpdate(
				{ _id: req.params.id, owner: req.user._id },
				req.body,
				{ new: true, runValidators: true }
			);
			if (!task) {
				return res.status(404).send();
			}
			res.status(200).send(task);
		} catch (error) {
			res.status(400).send(error);
		}
	}
);

router.delete(
	'/:id',
	auth,
	async (req: AuthenticatedRequest, res: Response) => {
		try {
			const task = await Task.findOneAndDelete({
				_id: req.params.id,
				owner: req.user._id,
			});
			if (!task) {
				return res.status(404).send();
			}
			res.status(200).send(task);
		} catch (error) {
			res.status(500).send(error);
		}
	}
);

export default router;
