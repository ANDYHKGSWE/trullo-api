import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/user';
import auth from '../middleware/auth';

const router = Router();

// Registrera en ny användare
router.post(
	'/register',
	[
		body('username').notEmpty().withMessage('Username is required'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = new User(req.body);
			await user.save();
			const token = jwt.sign(
				{ _id: user._id, role: user.role },
				process.env.JWT_SECRET!
			);
			res.status(201).send({ user, token });
		} catch (error) {
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Logga in en användare
router.post(
	'/login',
	[
		body('username').notEmpty().withMessage('Username is required'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findOne({ username: req.body.username });
			if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
				return res.status(400).send({ error: 'Invalid credentials' });
			}
			const token = jwt.sign(
				{ _id: user._id, role: user.role },
				process.env.JWT_SECRET!
			);
			res.send({ user, token });
		} catch (error) {
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Hämta användarens profil
router.get('/me', auth, async (req, res) => {
	res.send(req.user);
});

export default router;
