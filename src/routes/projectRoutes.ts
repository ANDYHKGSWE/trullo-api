import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import Project from '../models/project'; // Kontrollera att denna fil finns och är korrekt exporterad

const router = Router();

// Skapa ett nytt projekt med validering
router.post(
	'/',
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('description').notEmpty().withMessage('Description is required'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const project = new Project(req.body);
			await project.save();
			res.status(201).send(project);
		} catch (error) {
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Hämta alla projekt
router.get('/', async (req: Request, res: Response) => {
	try {
		const projects = await Project.find();
		res.status(200).send(projects);
	} catch (error) {
		res.status(500).send({ error: 'Server error' });
	}
});

// Hämta ett specifikt projekt
router.get('/:id', async (req: Request, res: Response) => {
	try {
		const project = await Project.findById(req.params.id);
		if (!project) {
			return res.status(404).send({ error: 'Project not found' });
		}
		res.status(200).send(project);
	} catch (error) {
		res.status(500).send({ error: 'Server error' });
	}
});

// Uppdatera ett projekt med validering
router.patch(
	'/:id',
	[
		body('name').optional().notEmpty().withMessage('Name cannot be empty'),
		body('description')
			.optional()
			.notEmpty()
			.withMessage('Description cannot be empty'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
				new: true,
				runValidators: true,
			});
			if (!project) {
				return res.status(404).send({ error: 'Project not found' });
			}
			res.status(200).send(project);
		} catch (error) {
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Ta bort ett projekt
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const project = await Project.findByIdAndDelete(req.params.id);
		if (!project) {
			return res.status(404).send({ error: 'Project not found' });
		}
		res.status(200).send(project);
	} catch (error) {
		res.status(500).send({ error: 'Server error' });
	}
});

export default router;
