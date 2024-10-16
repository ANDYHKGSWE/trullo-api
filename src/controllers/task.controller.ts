import { Request, Response } from "express";
import Task, { ITask } from "../models/task.model";
import Project from "../models/project.model"; 

export const createTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task: ITask = new Task(req.body);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });

    }
};

export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, startDate, endDate, tags, projectId, page =1, limit = 10 } = req.query;
      let query: any = {};
  
      if (status) {
        query.status = status;
      }
  
      if (startDate && endDate) {
        query.createdAt = {
          $gte: new Date(startDate as string),
          $lte: new Date(endDate as string)
        };
      }

      if (typeof tags === 'string') {
        query.tags = { $in: tags.split(',') };
      }

      if (projectId) {
        query.projectId = projectId;
      }

      const options = {
        page: parseInt(page as string, 10),
        limit: parseInt(limit as string, 10),
        populate: [
            {path: 'assignedTo', select: 'name email'},
            {path: 'projectId', select: 'name description'}
        ]
      };
  
      const tasks = await Task.paginate(query, options);
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: (error as Error).message });
    }
  };

export const getTaskById = async (req: Request, res: Response): Promise<void> => {
    try {
        const task: ITask | null = await Task.findById(req.params.id)
            .populate('assignedTo', 'name email')
            .populate('projectId', 'name description');
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
};

export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task: ITask | null = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!task) {
            res.status(404).json({ error: "Task not found" });
            return;
        }
        res.status(200).json(task);
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
};

export const deleteTask = async (req: Request, res: Response): Promise<void> => {
    try {
        const task: ITask | null = await Task.findByIdAndDelete(req.params.id);
        if (!task) {
            res.status(404).json({message: 'Task not found'});
            return;
        }
        res.status(200).json({message: 'Task deleted'});
    } catch (error) {
        res.status(500).json({error: (error as Error).message});
    }
};
