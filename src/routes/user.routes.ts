import express from "express";
import {createUser, getUsers, getUserById, updateUser, deleteUser, loginUser} from '../controllers/user.controller';
import {validateRequest, createUserSchema, updateUserSchema} from '../middleware/validation.middleware';
import { auth } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', validateRequest(createUserSchema), createUser);
router.get('/', auth, getUsers);
router.get('/:id', auth, getUserById);
router.put('/:id', auth, validateRequest(updateUserSchema), updateUser);
router.delete('/:id', auth, deleteUser);
router.post('/login', loginUser);

export default router;
