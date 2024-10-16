import {Request, Response, NextFunction} from 'express';
import {ZodSchema, z} from 'zod';

export const validateRequest = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                res.status(400).json({error: error.errors});
            } else {
                res.status(400).json({error: 'Invalid Input'});
            }
        }
    };
};


export const userSchema = z.object({
    name: z.string().min(1),
    email: z.string().email(),
    password: z.string().min(8),
});

export const createUserSchema = z.union([
    userSchema,
    z.array(userSchema)
  ]);
  
export const updateUserSchema = userSchema.partial();

export const taskSchema = z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    status: z.enum(['To Do', 'In Progress', 'Blocked', 'Done']),
    assignedTo: z.string().length(24).optional(),
    finishedBy: z.date().optional(),
    tags: z.array(z.string()).optional(),
    projectId: z.string().length(24).optional(),
});

export const projectSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    tasks: z.array(z.string().length(24)).optional(),
})