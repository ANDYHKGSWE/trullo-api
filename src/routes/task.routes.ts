import express from "express";
import {createTask, getTasks, getTaskById, updateTask, deleteTask} from '../controllers/task.controller';
import {validateRequest, taskSchema} from '../middleware/validation.middleware';
import {auth} from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', auth, validateRequest(taskSchema), createTask);
router.get('/', auth, getTasks);
router.get('/:id', auth, getTaskById);
router.put('/:id', auth, validateRequest(taskSchema), updateTask);
router.delete('/:id', auth, deleteTask);

export default router;