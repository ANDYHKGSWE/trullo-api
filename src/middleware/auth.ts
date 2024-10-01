import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user';

interface AuthenticatedRequest extends Request {
	user?: any;
}

const auth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.header('Authorization')?.replace('Bearer ', '');
		if (!token) {
			throw new Error();
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		const user = await User.findOne({
			_id: (decoded as any)._id,
			'tokens.token': token,
		});

		if (!user) {
			throw new Error();
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please authenticate.' });
	}
};

export default auth;
