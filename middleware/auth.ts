import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

const auth = (req: Request, res: Response, next: NextFunction) => {
	const token = req.header('Authorization')?.replace('Bearer ', '');
	if (!token) {
		return res.status(401).send({ error: 'Please authenticate' });
	}

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET!);
		req.user = decoded;
		next();
	} catch (error) {
		res.status(401).send({ error: 'Please authenticate' });
	}
};

export default auth;
