import { Router, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/user';
import auth from '../middleware/auth';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const router = Router();

// Utöka Request-typen för att inkludera user
interface AuthenticatedRequest extends Request {
	user?: any;
}

// Registrera en ny användare
router.post(
	'/register',
	[
		body('name').notEmpty().withMessage('Name is required'),
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const { name, email, password } = req.body;
			const user = new User({ name, email, password });
			await user.save();
			const token = jwt.sign(
				{ _id: user._id, role: user.role },
				process.env.JWT_SECRET!
			);
			res.status(201).send({ user, token });
		} catch (error) {
			console.error('Error during user registration:', error); // Logga felet
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Logga in en användare
router.post(
	'/login',
	[
		body('email').isEmail().withMessage('Valid email is required'),
		body('password').notEmpty().withMessage('Password is required'),
	],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
				return res.status(400).send({ error: 'Invalid credentials' });
			}
			const token = jwt.sign(
				{ _id: user._id, role: user.role },
				process.env.JWT_SECRET!
			);
			res.send({ user, token });
		} catch (error) {
			console.error('Error during user login:', error); // Logga felet
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Hämta användarens profil
router.get('/me', auth, async (req: AuthenticatedRequest, res: Response) => {
	try {
		res.send(req.user);
	} catch (error) {
		console.error('Error fetching user profile:', error); // Logga felet
		res.status(500).send({ error: 'Server error' });
	}
});

// Begär en återställningslänk för lösenord
router.post(
	'/forgot-password',
	[body('email').isEmail().withMessage('Valid email is required')],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findOne({ email: req.body.email });
			if (!user) {
				return res.status(400).send({ error: 'User not found' });
			}

			const resetToken = crypto.randomBytes(32).toString('hex');
			const resetTokenHash = await bcrypt.hash(resetToken, 10);
			user.resetPasswordToken = resetTokenHash;
			user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
			await user.save();

			const transporter = nodemailer.createTransport({
				service: 'gmail',
				auth: {
					user: process.env.EMAIL,
					pass: process.env.EMAIL_PASSWORD,
				},
			});

			const mailOptions = {
				to: user.email,
				from: process.env.EMAIL,
				subject: 'Password Reset',
				text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
                Please click on the following link, or paste this into your browser to complete the process:\n\n
                http://${req.headers.host}/reset-password/${resetToken}\n\n
                If you did not request this, please ignore this email and your password will remain unchanged.\n`,
			};

			await transporter.sendMail(mailOptions);

			res.send({ message: 'Password reset link sent' });
		} catch (error) {
			console.error('Error during password reset request:', error); // Logga felet
			res.status(500).send({ error: 'Server error' });
		}
	}
);

// Återställ lösenord
router.post(
	'/reset-password/:token',
	[body('password').notEmpty().withMessage('Password is required')],
	async (req: Request, res: Response) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({ errors: errors.array() });
		}

		try {
			const user = await User.findOne({
				resetPasswordToken: req.params.token,
				resetPasswordExpires: { $gt: Date.now() },
			});

			if (!user) {
				return res.status(400).send({ error: 'Invalid or expired token' });
			}

			user.password = req.body.password;
			user.resetPasswordToken = undefined;
			user.resetPasswordExpires = undefined;
			await user.save();

			res.send({ message: 'Password has been reset' });
		} catch (error) {
			console.error('Error during password reset:', error); // Logga felet
			res.status(500).send({ error: 'Server error' });
		}
	}
);

export default router;
