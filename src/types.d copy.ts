import { Request } from 'express';

declare global {
	namespace Express {
		interface Request {
			user?: any; // Du kan ersätta `any` med den faktiska typen av `user` om du vet den
		}
	}
}
